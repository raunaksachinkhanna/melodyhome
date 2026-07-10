import type { Product, ProductDetail } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`)
  }

  return res.json()
}

export async function getProduct(id: string): Promise<ProductDetail | null> {
  const res = await fetch(`${API_URL}/api/products/${id}`, { cache: 'no-store' })

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status}`)
  }

  return res.json()
}
