export interface Product {
  id: string
  sku: string
  name: string
  description: string | null
  artisan_story: string | null
  category: string
  material: string | null
  hsn_code: string
  base_price: string
  mrp: string
  images: string[]
  lead_time_days: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string
  colour: string | null
  size: string | null
  fragrance: string | null
  price: string
  mrp: string
  stock_note: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductDetail extends Product {
  variants: ProductVariant[]
}

export interface CartItem {
  productId: string
  variantId: string
  name: string
  category: string
  variantLabel: string
  unitPrice: string
  quantity: number
  leadTimeDays: number
}
