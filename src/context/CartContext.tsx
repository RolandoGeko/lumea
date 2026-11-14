import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { load, save } from '../lib/storage'
import { estimateUnitPrice } from '../lib/pricing'
import { uid } from '../lib/random'
import type { CartItem, TributeConfig } from '../lib/types'
import { getProduct } from '../data/catalog'

interface CartState {
  items: CartItem[]
  count: number
  /** Suma de los ítems con precio referencial */
  subtotal: number
  /** true si algún ítem es solo por cotización */
  hasQuoteOnly: boolean
  addItem: (config: TributeConfig, kind: CartItem['kind'], quantity?: number) => string
  updateItem: (lineId: string, patch: Partial<TributeConfig>) => void
  replaceConfig: (lineId: string, config: TributeConfig) => void
  setQuantity: (lineId: string, quantity: number) => void
  removeItem: (lineId: string) => void
  clear: () => void
}

const CartContext = createContext<CartState | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    load<CartItem[]>('carrito', []).filter((i) => getProduct(i.config?.productId)),
  )

  useEffect(() => save('carrito', items), [items])

  const addItem = useCallback((config: TributeConfig, kind: CartItem['kind'], quantity = 1) => {
    const lineId = uid()
    setItems((prev) => [...prev, { lineId, kind, quantity, config, addedAt: new Date().toISOString() }])
    return lineId
  }, [])

  const updateItem = useCallback((lineId: string, patch: Partial<TributeConfig>) => {
    setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, config: { ...i.config, ...patch } } : i)))
  }, [])

  const replaceConfig = useCallback((lineId: string, config: TributeConfig) => {
    setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, config, kind: 'personalizado' } : i)))
  }, [])

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    const q = Math.max(1, Math.min(50, Math.round(quantity) || 1))
    setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, quantity: q } : i)))
  }, [])

  const removeItem = useCallback((lineId: string) => setItems((prev) => prev.filter((i) => i.lineId !== lineId)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartState>(() => {
    let subtotal = 0
    let hasQuoteOnly = false
    items.forEach((i) => {
      const p = estimateUnitPrice(i.config)
      if (p === null) hasQuoteOnly = true
      else subtotal += p * i.quantity
    })
    return {
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal,
      hasQuoteOnly,
      addItem,
      updateItem,
      replaceConfig,
      setQuantity,
      removeItem,
      clear,
    }
  }, [items, addItem, updateItem, replaceConfig, setQuantity, removeItem, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
