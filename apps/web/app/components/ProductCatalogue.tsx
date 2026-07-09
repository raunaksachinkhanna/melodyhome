'use client'

import { useMemo, useState } from 'react'
import type { Product } from '../../lib/types'
import ProductCard from './ProductCard'

const CATEGORY_LABELS: Record<string, string> = {
  brass: 'Brass',
  candle: 'Candles',
  textile: 'Textiles',
  growbag: 'Growbags',
}

function labelFor(category: string): string {
  return (
    CATEGORY_LABELS[category] ??
    category.charAt(0).toUpperCase() + category.slice(1)
  )
}

export default function ProductCatalogue({
  products,
}: {
  products: Product[]
}) {
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  )

  const [selected, setSelected] = useState<string>('all')

  const visible =
    selected === 'all'
      ? products
      : products.filter((p) => p.category === selected)

  return (
    <section
      id="collection"
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterButton
          active={selected === 'all'}
          onClick={() => setSelected('all')}
        >
          All
        </FilterButton>
        {categories.map((category) => (
          <FilterButton
            key={category}
            active={selected === category}
            onClick={() => setSelected(category)}
          >
            {labelFor(category)}
          </FilterButton>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-brown/70">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-brown bg-brown text-cream'
          : 'border-brown/30 bg-transparent text-brown hover:border-brown'
      }`}
    >
      {children}
    </button>
  )
}
