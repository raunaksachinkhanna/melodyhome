'use client'

import { useState } from 'react'
import type { ProductVariant } from '../../lib/types'
import { formatINR } from '../../lib/format'

function labelFor(variant: ProductVariant): string {
  const parts = [variant.colour, variant.size, variant.fragrance].filter(
    (part): part is string => Boolean(part)
  )
  return parts.length > 0 ? parts.join(' / ') : variant.sku
}

export default function VariantPicker({
  basePrice,
  variants,
}: {
  basePrice: string
  variants: ProductVariant[]
}) {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    variants[0]?.id
  )

  const selected = variants.find((variant) => variant.id === selectedId)
  const showVariantPrice =
    selected && Number(selected.price) !== Number(basePrice)

  if (variants.length === 0) {
    return (
      <p className="text-sm text-brown/70">
        No options currently available for this piece.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 text-sm font-medium text-brown">Choose an option</p>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const active = variant.id === selectedId
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedId(variant.id)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'border-brown bg-brown text-cream'
                    : 'border-brown/30 bg-transparent text-brown hover:border-brown'
                }`}
              >
                {labelFor(variant)}
              </button>
            )
          })}
        </div>
      </div>

      {showVariantPrice && selected && (
        <p className="text-sm text-brown/70">
          Selected option: {formatINR(selected.price)}
        </p>
      )}

      <button
        type="button"
        disabled={!selected}
        onClick={() => {
          if (selected) {
            console.log('Add to cart:', selected.id)
          }
        }}
        className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold tracking-wide text-brown transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        Add to cart
      </button>
    </div>
  )
}
