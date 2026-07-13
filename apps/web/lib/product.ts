import type { ProductVariant } from './types'

const CATEGORY_LABELS: Record<string, string> = {
  brass: 'ठठेरा brass',
  candle: 'Candles',
  textile: 'Textiles',
  growbag: 'Gamla growbags',
}

export function categoryLabel(category: string): string {
  return (
    CATEGORY_LABELS[category] ??
    category.charAt(0).toUpperCase() + category.slice(1)
  )
}

export function variantLabel(variant: ProductVariant): string {
  const parts = [variant.colour, variant.size, variant.fragrance].filter(
    (part): part is string => Boolean(part)
  )
  return parts.length > 0 ? parts.join(' · ') : variant.sku
}

export function validProductImages(images: string[]): string[] {
  return images.filter((image) => {
    try {
      const url = new URL(image)
      return url.protocol === 'https:' || url.protocol === 'http:'
    } catch {
      return false
    }
  })
}
