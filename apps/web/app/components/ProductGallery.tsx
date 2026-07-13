import Image from 'next/image'
import type { ProductDetail } from '../../lib/types'
import { validProductImages } from '../../lib/product'
import ProductFallback from './ProductFallback'

export default function ProductGallery({ product }: { product: ProductDetail }) {
  const images = validProductImages(product.images)

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] overflow-hidden border border-brown/10">
        <ProductFallback category={product.category} className="h-full" />
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {images.map((image, index) => (
        <figure key={`${image}-${index}`} className={`relative overflow-hidden bg-brown ${index === 0 ? 'aspect-[4/5] sm:col-span-2' : 'aspect-square'}`}>
          <Image
            src={image}
            alt={`${product.name}${images.length > 1 ? `, view ${index + 1}` : ''}`}
            fill
            priority={index === 0}
            sizes={index === 0 ? '(min-width: 1024px) 56vw, 100vw' : '(min-width: 1024px) 27vw, 50vw'}
            className="object-cover"
          />
        </figure>
      ))}
    </div>
  )
}
