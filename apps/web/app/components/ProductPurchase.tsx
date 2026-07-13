'use client'

import { useMemo, useState } from 'react'
import { formatINR } from '../../lib/format'
import { categoryLabel, variantLabel } from '../../lib/product'
import type { ProductDetail } from '../../lib/types'
import { useCart } from './cart/CartProvider'

export default function ProductPurchase({ product }: { product: ProductDetail }) {
  const [selectedId, setSelectedId] = useState(product.variants[0]?.id ?? '')
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const selected = useMemo(
    () => product.variants.find((variant) => variant.id === selectedId),
    [product.variants, selectedId]
  )
  const price = selected?.price ?? product.base_price
  const mrp = selected?.mrp ?? product.mrp
  const showMrp = Number(mrp) > Number(price)

  return (
    <div className="lg:sticky lg:top-28">
      <p className="text-xs font-bold uppercase tracking-editorial text-gold">{categoryLabel(product.category)}</p>
      <h1 className="balance mt-3 font-serif text-4xl leading-[1.05] sm:text-6xl">{product.name}</h1>
      <div className="mt-5 flex items-baseline gap-3" aria-live="polite">
        <span className="font-serif text-3xl">{formatINR(price)}</span>
        {showMrp && <span className="text-sm text-brown/40 line-through">{formatINR(mrp)}</span>}
      </div>
      <p className="mt-2 text-xs text-brown/50">Inclusive of applicable taxes</p>

      <div className="mt-8 border-y border-brown/15 py-6">
        <div className="flex gap-3">
          <span className="mt-0.5 text-gold" aria-hidden="true">✦</span>
          <div>
            <p className="text-sm font-bold">Made to order for you</p>
            <p className="mt-1 text-xs leading-5 text-brown/60">Please allow approximately {product.lead_time_days} days before dispatch. We&apos;ll take the time the piece requires.</p>
          </div>
        </div>
      </div>

      {product.variants.length > 0 ? (
        <fieldset className="mt-7">
          <legend className="text-xs font-bold uppercase tracking-[0.12em]">Choose an option</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {product.variants.map((variant) => {
              const active = variant.id === selectedId
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedId(variant.id)}
                  aria-pressed={active}
                  className={`min-h-12 border px-4 text-left text-sm transition-colors ${active ? 'border-brown bg-brown text-cream' : 'border-brown/20 hover:border-gold'}`}
                >
                  {variantLabel(variant)}
                </button>
              )
            })}
          </div>
          {selected?.stock_note && <p className="mt-3 text-xs text-brown/60">{selected.stock_note}</p>}
        </fieldset>
      ) : (
        <p className="mt-7 border border-brown/15 p-4 text-sm text-brown/60">This piece has no purchasable options available right now.</p>
      )}

      <div className="mt-7 flex gap-3">
        <div className="inline-flex shrink-0 items-center border border-brown/25" aria-label="Quantity">
          <button type="button" className="h-12 w-11 text-lg" onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Decrease quantity">−</button>
          <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">{quantity}</span>
          <button type="button" className="h-12 w-11 text-lg" onClick={() => setQuantity((current) => current + 1)} aria-label="Increase quantity">+</button>
        </div>
        <button
          type="button"
          disabled={!selected}
          onClick={() => {
            if (!selected) return
            addItem({
              productId: product.id,
              variantId: selected.id,
              name: product.name,
              category: categoryLabel(product.category),
              variantLabel: variantLabel(selected),
              unitPrice: selected.price,
              quantity,
              leadTimeDays: product.lead_time_days,
            })
          }}
          className="min-h-12 flex-1 bg-gold px-5 text-sm font-bold text-brown transition-colors hover:bg-brown hover:text-cream disabled:cursor-not-allowed disabled:opacity-45"
        >
          Add to cart
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-px bg-brown/15 text-xs">
        <div className="bg-cream p-4"><span className="block font-bold">Handmade</span><span className="mt-1 block text-brown/55">Natural variations expected</span></div>
        <div className="bg-cream p-4"><span className="block font-bold">Delivery</span><span className="mt-1 block text-brown/55">Tracking follows dispatch</span></div>
      </div>
    </div>
  )
}
