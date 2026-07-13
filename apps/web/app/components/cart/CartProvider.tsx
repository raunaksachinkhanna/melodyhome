'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import CartDrawer from './CartDrawer'
import type { CartItem } from '../../../lib/types'

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  isCartOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  setQuantity: (variantId: string, quantity: number) => void
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setCartOpen] = useState(false)

  const addItem = useCallback((item: CartItem) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.variantId === item.variantId)
      if (!existing) return [...current, item]
      return current.map((entry) =>
        entry.variantId === item.variantId
          ? { ...entry, quantity: entry.quantity + item.quantity }
          : entry
      )
    })
    setCartOpen(true)
  }, [])

  const removeItem = useCallback((variantId: string) => {
    setItems((current) => current.filter((item) => item.variantId !== variantId))
  }, [])

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((current) => current.filter((item) => item.variantId !== variantId))
      return
    }
    setItems((current) =>
      current.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    )
  }, [])

  const value = useMemo<CartContextValue>(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + Number(item.unitPrice) * item.quantity, 0),
    isCartOpen,
    addItem,
    removeItem,
    setQuantity,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
  }), [addItem, isCartOpen, items, removeItem, setQuantity])

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
