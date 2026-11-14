import { getProduct } from '../data/catalog'
import { byId, containers, sizes, budgets } from '../data/options'
import type { TributeConfig } from './types'

/** Redondea a múltiplos de 10 para que los montos se lean como referencia, no como cifra exacta. */
const round10 = (n: number) => Math.round(n / 10) * 10

/**
 * Precio unitario referencial. Devuelve null cuando el producto es solo por cotización
 * o cuando el tamaño elegido es monumental.
 */
export function estimateUnitPrice(config: Pick<TributeConfig, 'productId' | 'sizeId' | 'containerId'>): number | null {
  const product = getProduct(config.productId)
  if (!product || product.basePrice === null) return null
  const size = byId(sizes, config.sizeId) ?? byId(sizes, product.sizes[0])
  if (size?.id === 'monumental') return null
  const container = byId(containers, config.containerId)
  return round10(product.basePrice * (size?.multiplier ?? 1) + (container?.extra ?? 0))
}

/** "Desde" precio de un producto para tarjetas y filtros. */
export function fromPrice(productId: string): number | null {
  const product = getProduct(productId)
  if (!product || product.basePrice === null) return null
  const smallest = byId(sizes, product.sizes[0])
  if (smallest?.id === 'monumental') return null
  return round10(product.basePrice * (smallest?.multiplier ?? 1))
}

export function budgetFits(budgetId: string, price: number | null): 'ok' | 'over' | 'under' | 'unknown' {
  const budget = byId(budgets, budgetId)
  if (!budget || budget.id === 'por-definir' || price === null) return 'unknown'
  if (price > budget.max) return 'over'
  if (price < budget.min * 0.6) return 'under'
  return 'ok'
}
