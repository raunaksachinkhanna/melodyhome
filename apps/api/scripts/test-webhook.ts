import crypto from 'crypto';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/razorpay';

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

if (!webhookSecret) {
  console.error('RAZORPAY_WEBHOOK_SECRET is not set in apps/api/.env');
  process.exit(1);
}

const payload = {
  event: 'payment.captured',
  payload: {
    payment: {
      entity: {
        id: 'pay_TEST0000000001',
        order_id: 'order_TEST0000000001',
        amount: 214900,
        currency: 'INR',
        status: 'captured',
        email: 'testcustomer@example.com',
        contact: '+919999999999',
        notes: {
          customer_name: 'Test Customer',
          customer_phone: '+919999999999',
          customer_email: 'testcustomer@example.com',
          shipping_address: JSON.stringify({
            line1: '123 Test Street',
            city: 'Ludhiana',
            state: 'Punjab',
            pincode: '141001',
          }),
          gst_amount: '0',
          items: JSON.stringify([
            {
              product_variant_id: '65bd2ac1-3b3f-4d5e-aeb6-c1a5503b8b39',
              quantity: 1,
              unit_price: 799,
              hsn_code: '7409',
            },
            {
              product_variant_id: 'b35b5704-7eb0-431e-9fa9-bbf251eb5293',
              quantity: 1,
              unit_price: 1350,
              hsn_code: '741999',
            },
          ]),
        },
      },
    },
  },
};

async function main(): Promise<void> {
  const rawBody = JSON.stringify(payload);

  const signature = crypto
    .createHmac('sha256', webhookSecret as string)
    .update(rawBody)
    .digest('hex');

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-razorpay-signature': signature,
    },
    body: rawBody,
  });

  const body = await response.json();

  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(body, null, 2));
}

main().catch((err) => {
  console.error('Request failed:', err);
  process.exit(1);
});
