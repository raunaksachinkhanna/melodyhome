'use client'

import { useMemo, useState, type ReactNode } from 'react'
import type { Product } from '../../lib/types'
import { categoryLabel } from '../../lib/product'
import ProductCard from './ProductCard'

export default function ProductCatalogue({ products }: { products: Product[] }) {
  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products]
  )
  const [selected, setSelected] = useState('all')
  const visible = selected === 'all' ? products : products.filter((product) => product.category === selected)

  return (
    <section id="collection" className="bg-cream px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:pb-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-b border-brown/20 pb-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-editorial text-gold">The collection</p>
            <h2 className="balance mt-4 max-w-2xl font-serif text-4xl leading-[1.05] tracking-[-0.02em] sm:text-6xl">
              Everyday objects, with a longer memory.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-brown/65 sm:text-base">
            Brassware, candles, textiles, and growbags made in close partnership with skilled makers. Designed to be lived with—not simply displayed.
          </p>
        </div>

        <div className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter collection by category">
            <FilterButton active={selected === 'all'} onClick={() => setSelected('all')}>All objects</FilterButton>
            {categories.map((category) => (
              <FilterButton key={category} active={selected === category} onClick={() => setSelected(category)}>
                {categoryLabel(category)}
              </FilterButton>
            ))}
          </div>
          <p className="text-xs tabular-nums text-brown/50" aria-live="polite">Showing {visible.length} {visible.length === 1 ? 'piece' : 'pieces'}</p>
        </div>

        {visible.length === 0 ? (
          <div className="border-y border-brown/15 py-20 text-center">
            <p className="font-serif text-3xl">This shelf is being prepared.</p>
            <p className="mt-3 text-sm text-brown/60">Choose another collection to keep exploring.</p>
          </div>
        ) : (
          <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-24">
            {visible.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          </div>
        )}
      </div>
    </section>
  )
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap border px-4 py-2.5 text-xs font-semibold transition-colors ${active ? 'border-brown bg-brown text-cream' : 'border-brown/20 text-brown hover:border-gold hover:text-gold'}`}
    >
      {children}
    </button>
  )
}
