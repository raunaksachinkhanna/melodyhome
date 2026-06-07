import 'dotenv/config';
import express from 'express';
import productsRouter from './routes/products';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/products', productsRouter);

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});

export default app;
