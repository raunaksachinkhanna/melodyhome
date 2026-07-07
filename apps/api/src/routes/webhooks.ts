import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// ─── Types ────────────────────────────────────────────────────────────────────

interface RazorpayPaymentEntity {
  id: string;
  order_id: string;
  amount: number; // paise (divide by 100 for INR)
  currency: string;
  status: string;
  email: string | null;
  contact: string | null;
  notes: Record<string, string>;
}

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment: {
      entity: RazorpayPaymentEntity;
    };
  };
}

interface OrderItemInput {
  product_variant_id: string;
  quantity: number;
  unit_price: number;
  hsn_code: string;
}

interface PgError {
  code: string;
  constraint?: string;
}

function isUniqueViolation(err: unknown): err is PgError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: unknown }).code === '23505'
  );
}

// ─── POST /api/webhooks/razorpay ──────────────────────────────────────────────

router.post('/', async (req: Request, res: Response) => {
  // RAW BODY STRATEGY
  // In index.ts, this route is mounted with express.raw({ type: 'application/json' })
  // applied BEFORE the global express.json() middleware. express.raw() consumes the
  // request stream and sets req._body = true, which causes the subsequent global
  // express.json() to skip this request entirely. req.body is therefore a raw Buffer
  // here, which is mandatory: Razorpay's HMAC-SHA256 must be computed over the exact
  // bytes Razorpay sent — re-serialising a parsed object would break verification.
  // Source: https://razorpay.com/docs/webhooks/validate-test/
  const rawBody = req.body as Buffer;

  const receivedSig = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  if (!receivedSig || typeof receivedSig !== 'string') {
    return res.status(400).json({ error: 'Missing x-razorpay-signature header' });
  }

  if (!Buffer.isBuffer(rawBody) || rawBody.length === 0) {
    return res.status(400).json({ error: 'Empty or unparseable request body' });
  }

  // Verified from live Razorpay docs (razorpay.com/docs/webhooks/validate-test):
  // Signature = hex( HMAC-SHA256( key=webhook_secret, message=raw_body ) )
  // Header carrying the signature: x-razorpay-signature
  const expectedSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  // timingSafeEqual prevents timing-based side-channel attacks.
  // Both Buffers must be the same byte length; guard against malformed input.
  let signaturesMatch = false;
  try {
    const expectedBuf = Buffer.from(expectedSig, 'hex');
    const receivedBuf = Buffer.from(receivedSig, 'hex');
    if (expectedBuf.length === receivedBuf.length) {
      signaturesMatch = crypto.timingSafeEqual(expectedBuf, receivedBuf);
    }
  } catch {
    signaturesMatch = false;
  }

  if (!signaturesMatch) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Parse body only after signature is verified
  let event: RazorpayWebhookPayload;
  try {
    event = JSON.parse(rawBody.toString('utf8')) as RazorpayWebhookPayload;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  // Acknowledge all events other than payment.captured — do not process them
  if (event.event !== 'payment.captured') {
    return res.status(200).json({ received: true });
  }

  const payment = event.payload?.payment?.entity;
  if (!payment) {
    return res.status(400).json({ error: 'Malformed payment.captured payload' });
  }

  // Razorpay's order_id (e.g. "order_XXXXXXXXXXXXXXXX") is stable and unique
  // per checkout session. We use it as our idempotency key so that retried or
  // duplicate payment.captured webhooks are safely ignored.
  const razorpayOrderId = payment.order_id;
  const razorpayPaymentId = payment.id;

  if (!razorpayOrderId) {
    return res.status(400).json({ error: 'payment.order_id missing in payload' });
  }

  // ── Extract customer and item data from Razorpay payment notes ─────────────
  // At checkout-order creation time, the front-end encodes customer details
  // and cart items into the Razorpay order's `notes` object. We read them back
  // here. All values in `notes` are strings; structured fields are JSON-encoded.
  const notes: Record<string, string> = payment.notes ?? {};

  const customerName: string = notes['customer_name'] ?? 'Unknown';
  const customerPhone: string = payment.contact ?? notes['customer_phone'] ?? '';
  const customerEmail: string | null = payment.email ?? notes['customer_email'] ?? null;

  let shippingAddress: Record<string, unknown> = {};
  try {
    if (notes['shipping_address']) {
      shippingAddress = JSON.parse(notes['shipping_address']) as Record<string, unknown>;
    }
  } catch {
    shippingAddress = {};
  }

  // Razorpay amounts are in paise (smallest currency unit); convert to INR
  const totalAmount = payment.amount / 100;
  const gstAmount = parseFloat(notes['gst_amount'] ?? '0') || 0;

  let items: OrderItemInput[] = [];
  try {
    if (notes['items']) {
      items = JSON.parse(notes['items']) as OrderItemInput[];
    }
  } catch {
    items = [];
  }

  // ── Atomic order write ─────────────────────────────────────────────────────
  // Open a dedicated connection from the pool so BEGIN/COMMIT are scoped to
  // this request. ROLLBACK on any error so no partial state is persisted.
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query<{ id: string }>(
      `INSERT INTO orders (
        idempotency_key,
        customer_name,
        customer_phone,
        customer_email,
        shipping_address,
        total_amount,
        gst_amount,
        status,
        razorpay_order_id,
        razorpay_payment_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed', $8, $9)
      RETURNING id`,
      [
        razorpayOrderId,
        customerName,
        customerPhone,
        customerEmail,
        JSON.stringify(shippingAddress),
        totalAmount,
        gstAmount,
        razorpayOrderId,
        razorpayPaymentId,
      ]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_variant_id, quantity, unit_price, hsn_code)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_variant_id, item.quantity, item.unit_price, item.hsn_code]
      );
    }

    await client.query('COMMIT');

    // TODO: enqueue downstream fulfilment work (Shiprocket, WhatsApp, packing list)

    return res.status(200).json({ received: true, order_id: orderId });
  } catch (err) {
    await client.query('ROLLBACK');

    // A check-then-insert on idempotency_key is racy: two concurrent deliveries
    // of the same webhook can both pass the SELECT check before either commits
    // its INSERT, producing duplicate orders. Instead we let the UNIQUE
    // constraint on orders.idempotency_key be the single source of truth and
    // treat a 23505 (unique_violation) here as "already processed", not a failure.
    if (isUniqueViolation(err) && err.constraint === 'orders_idempotency_key_key') {
      return res.status(200).json({ received: true, duplicate: true });
    }

    console.error('Webhook order write failed, transaction rolled back:', err);
    return res.status(500).json({ error: 'Order processing failed' });
  } finally {
    client.release();
  }
});

export default router;
