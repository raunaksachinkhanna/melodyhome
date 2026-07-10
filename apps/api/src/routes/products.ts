import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!UUID_RE.test(id)) {
    return res.status(404).json({ error: 'Product not found' });
  }

  try {
    const { rows: productRows } = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND is_active = TRUE',
      [id]
    );

    const product = productRows[0];
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { rows: variants } = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = $1 AND is_active = TRUE ORDER BY created_at ASC',
      [id]
    );

    res.json({ ...product, variants });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
