import type { Product } from '../../lib/types'
import { formatINR } from '../../lib/format'

export default function ProductCard({ product }: { product: Product }) {
  const showMrp = Number(product.mrp) > Number(product.base_price)

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-brown/10 bg-white/40 shadow-sm">
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-brown via-brown to-gold/60">
        <span className="font-serif text-5xl text-cream/25" aria-hidden="true">
          {product.category.charAt(0).toUpperCase()}
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-xs font-medium tracking-wide text-brown">
          Handmade
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-semibold text-brown">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-brown/70">
          {product.description || product.category}
        </p>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-lg font-semibold text-brown">
            {formatINR(product.base_price)}
          </span>
          {showMrp && (
            <span className="text-sm text-brown/40 line-through">
              {formatINR(product.mrp)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
