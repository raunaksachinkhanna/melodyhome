'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { formatINR } from '../../../lib/format'
import { useCart } from './CartProvider'

export default function CartDrawer() {
  const { items, subtotal, isCartOpen, closeCart, removeItem, setQuantity } = useCart()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isCartOpen) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart()
      if (event.key !== 'Tab') return

      const drawer = closeButtonRef.current?.closest('aside')
      const focusable = drawer?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [closeCart, isCartOpen])

  return (
    <div className={`fixed inset-0 z-50 ${isCartOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isCartOpen}>
      <button
        type="button"
        className={`absolute inset-0 bg-brown/65 transition-opacity ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeCart}
        tabIndex={isCartOpen ? 0 : -1}
        aria-label="Close cart"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-[-20px_0_60px_rgba(62,14,0,0.18)] transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex h-[4.75rem] items-center justify-between border-b border-brown/15 px-5 sm:px-7">
          <h2 id="cart-title" className="font-serif text-2xl">Your cart</h2>
          <button ref={closeButtonRef} type="button" onClick={closeCart} className="grid h-11 w-11 place-items-center text-2xl" aria-label="Close cart">
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="font-serif text-6xl text-gold" aria-hidden="true">○</span>
            <h3 className="mt-5 font-serif text-3xl">Room for something meaningful.</h3>
            <p className="mt-3 max-w-xs text-sm leading-6 text-brown/65">Your cart is empty. Explore objects made slowly, with skill and intention.</p>
            <Link href="/#collection" onClick={closeCart} className="mt-7 border-b border-brown pb-1 text-sm font-semibold">Explore the collection</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 py-2 sm:px-7">
              {items.map((item) => (
                <li key={item.variantId} className="border-b border-brown/15 py-6">
                  <div className="flex justify-between gap-5">
                    <div>
                      <p className="text-xs uppercase tracking-editorial text-gold">{item.category}</p>
                      <Link href={`/product/${item.productId}`} onClick={closeCart} className="mt-1 block font-serif text-xl hover:text-gold">{item.name}</Link>
                      <p className="mt-1 text-xs text-brown/60">{item.variantLabel}</p>
                      <p className="mt-1 text-[0.68rem] text-brown/50">Made to order · {item.leadTimeDays} days before dispatch</p>
                    </div>
                    <p className="whitespace-nowrap text-sm font-semibold">{formatINR(String(Number(item.unitPrice) * item.quantity))}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center border border-brown/25" aria-label={`Quantity for ${item.name}`}>
                      <button type="button" className="h-9 w-9 text-lg" onClick={() => setQuantity(item.variantId, item.quantity - 1)} aria-label={`Decrease ${item.name} quantity`}>−</button>
                      <span className="min-w-8 text-center text-sm tabular-nums" aria-live="polite">{item.quantity}</span>
                      <button type="button" className="h-9 w-9 text-lg" onClick={() => setQuantity(item.variantId, item.quantity + 1)} aria-label={`Increase ${item.name} quantity`}>+</button>
                    </div>
                    <button type="button" onClick={() => removeItem(item.variantId)} className="text-xs underline decoration-brown/30 underline-offset-4 hover:decoration-brown">Remove</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-brown/15 bg-white/35 px-5 py-6 sm:px-7">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold">Display subtotal</p>
                <p className="font-serif text-2xl">{formatINR(String(subtotal))}</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-brown/60">Final prices and totals are verified securely by the server at checkout. Every piece is made to order; allow approximately seven days before dispatch.</p>
              <button type="button" disabled className="mt-5 w-full cursor-not-allowed bg-brown px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-cream opacity-55">
                Checkout coming next
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
