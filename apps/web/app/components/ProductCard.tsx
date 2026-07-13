import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '../../lib/types'
import { formatINR } from '../../lib/format'
import { categoryLabel, validProductImages } from '../../lib/product'
import ProductFallback from './ProductFallback'

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const showMrp = Number(product.mrp) > Number(product.base_price)
  const image = validProductImages(product.images)[0]

  return (
    <article className={`group ${index % 3 === 1 ? 'lg:translate-y-12' : ''}`}>
      <Link
        href={`/product/${product.id}`}
        className="block focus-visible:outline-offset-8"
        aria-label={`${product.name}, ${formatINR(product.base_price)}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden border border-brown/10 bg-brown">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
            />
          ) : (
            <ProductFallback category={product.category} className="h-full transition-transform duration-700 group-hover:scale-[1.015]" />
          )}
          <div className="absolute left-0 top-0 bg-cream px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.15em] text-brown">
            Handmade
          </div>
          <div className="absolute bottom-0 right-0 grid h-12 w-12 translate-y-full place-items-center bg-gold text-xl text-brown transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0" aria-hidden="true">↗</div>
        </div>

        <div className="border-b border-brown/20 pb-6 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-editorial text-gold">{categoryLabel(product.category)}</p>
              <h3 className="mt-2 font-serif text-2xl leading-tight transition-colors group-hover:text-gold">{product.name}</h3>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-semibold">{formatINR(product.base_price)}</p>
              {showMrp && <p className="mt-0.5 text-xs text-brown/40 line-through">{formatINR(product.mrp)}</p>}
            </div>
          </div>
          <p className="mt-3 line-clamp-2 max-w-md text-sm leading-6 text-brown/60">
            {product.description || 'A made-to-order object shaped with considered, artisan-led making.'}
          </p>
          <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-brown/55">
            Made to order · {product.lead_time_days} days before dispatch
          </p>
        </div>
      </Link>
    </article>
  )
}
