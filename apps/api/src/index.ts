import 'dotenv/config';
import express from 'express';
import ordersRouter from './routes/orders';
import productsRouter from './routes/products';
import webhooksRouter from './routes/webhooks';

const app = express();
const PORT = 3000;

// Webhook route MUST be registered before global express.json().
// express.raw() captures the body as a raw Buffer and marks req._body = true,
// which causes the subsequent express.json() to skip this request. This keeps
// the raw bytes intact for Razorpay HMAC-SHA256 signature verification.
app.use('/api/webhooks/razorpay', express.raw({ type: 'application/json' }), webhooksRouter);

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});

export default app;
