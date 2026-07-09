import type { Product } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`)
  }

  return res.json()
}
