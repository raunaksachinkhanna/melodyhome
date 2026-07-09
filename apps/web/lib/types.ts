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
