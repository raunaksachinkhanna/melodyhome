'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from './cart/CartProvider'

const NAV_ITEMS = [
  { label: 'The Craft', href: '/#the-craft' },
  { label: 'Collection', href: '/#collection' },
  { label: 'Our Impact', href: '/#impact' },
  { label: 'Corporate Gifting', href: '/#corporate-gifting' },
]

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { itemCount, openCart } = useCart()
  const overHero = pathname === '/' && !scrolled

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const headerTone = overHero
    ? 'border-cream/15 bg-brown/35 text-cream backdrop-blur-sm'
    : 'border-gold/20 bg-cream/95 text-brown shadow-[0_1px_0_rgba(62,14,0,0.05)] backdrop-blur-md'

  return (
    <header className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300 ${headerTone}`}>
      <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-3"
          aria-label="Melody Home, home"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full border border-gold font-serif text-sm text-gold transition-transform group-hover:rotate-12" aria-hidden="true">
            M
          </span>
          <span className="font-serif text-xl tracking-[0.03em] sm:text-2xl">
            Melody Home
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartButton count={itemCount} onClick={openCart} />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 top-[14px] h-px w-5 bg-current transition-transform ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`overflow-hidden border-t border-gold/20 bg-cream text-brown transition-[max-height,opacity] duration-300 lg:hidden ${menuOpen ? 'max-h-96 opacity-100' : 'pointer-events-none max-h-0 opacity-0'}`}
      >
        <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between border-b border-brown/10 py-4 font-serif text-2xl"
            >
              {item.label}
              <span className="text-sm text-gold" aria-hidden="true">0{index + 1}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}

function CartButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex h-11 items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:text-gold sm:px-3"
      aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
    >
      <span>Cart</span>
      <span className="grid h-6 min-w-6 place-items-center rounded-full border border-current px-1 text-[0.65rem] tabular-nums">
        {count}
      </span>
    </button>
  )
}
