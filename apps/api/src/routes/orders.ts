import Razorpay from 'razorpay';
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { pool } from '../db';

const router = Router();

// ─── Razorpay client ──────────────────────────────────────────────────────────

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

if (!razorpayKeyId || !razorpayKeySecret) {
  throw new Error(
    'RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are required'
  );
}

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});

// ─── Request validation ───────────────────────────────────────────────────────

const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email().optional(),
  }),
  shipping_address: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
  }),
  items: z
    .array(
      z.object({
        product_variant_id: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

interface VariantRow {
  id: string;
  price: string;
  hsn_code: string;
}

// ─── POST /api/orders ──────────────────────────────────────────────────────────

router.post('/', async (req: Request, res: Response) => {
  const parseResult = createOrderSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid request body', details: parseResult.error.flatten() });
  }

  const { customer, shipping_address: shippingAddress, items } = parseResult.data;

  try {
    // ── Server-side pricing: look up real prices, never trust the client ───
    const variantIds = items.map((item) => item.product_variant_id);
    const { rows: variantRows } = await pool.query<VariantRow>(
      `SELECT product_variants.id, product_variants.price, products.hsn_code
       FROM product_variants
       JOIN products ON products.id = product_variants.product_id
       WHERE product_variants.id = ANY($1)
         AND product_variants.is_active = TRUE
         AND products.is_active = TRUE`,
      [variantIds]
    );

    const variantsById = new Map(variantRows.map((row) => [row.id, row]));

    const missingIds = variantIds.filter((id) => !variantsById.has(id));
    if (missingIds.length > 0) {
      return res.status(400).json({ error: 'One or more product variants do not exist', variant_ids: missingIds });
    }

    const orderItems = items.map((item) => {
      const variant = variantsById.get(item.product_variant_id)!;
      return {
        product_variant_id: variant.id,
        quantity: item.quantity,
        unit_price: parseFloat(variant.price),
        hsn_code: variant.hsn_code,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    const gstAmount = 0;

    const amountInPaise = Math.round(totalAmount * 100);
    const receipt = `receipt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // ── Create the Razorpay order. Our own orders/order_items rows are written
    // later by the webhooks.razorpay handler on payment.captured, not here. ──
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email ?? '',
        shipping_address: JSON.stringify(shippingAddress),
        gst_amount: String(gstAmount),
        items: JSON.stringify(orderItems),
      },
    });

    return res.status(200).json({
      razorpay_order_id: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      key_id: razorpayKeyId,
    });
  } catch (err) {
    console.error('Failed to create order:', err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;
