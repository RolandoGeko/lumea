import type { BudgetId, ContainerId, InspirationId, PaletteId, SizeId } from '../data/options'

export type Destination = 'velatorio' | 'hogar'

/** Selecciones del configurador "Crea tu homenaje" */
export interface TributeConfig {
  productId: string
  destination: Destination | ''
  paletteId: PaletteId | ''
  sizeId: SizeId | ''
  favoriteFlowers: string[]
  avoidFlowers: string[]
  flowerNotes: string
  containerId: ContainerId | ''
  budgetId: BudgetId | ''
  dedication: string
  signature: string
  aboutPerson: string
  inspirationId: InspirationId | ''
  inspirationOther: string
  district: string
  date: string
  time: string
  place: string
}

export const emptyConfig: TributeConfig = {
  productId: '',
  destination: '',
  paletteId: '',
  sizeId: '',
  favoriteFlowers: [],
  avoidFlowers: [],
  flowerNotes: '',
  containerId: '',
  budgetId: '',
  dedication: '',
  signature: '',
  aboutPerson: '',
  inspirationId: '',
  inspirationOther: '',
  district: '',
  date: '',
  time: '',
  place: '',
}

export interface CartItem {
  /** id único de la línea */
  lineId: string
  /** 'personalizado' si viene del configurador; 'rapido' si se agregó desde la ficha */
  kind: 'personalizado' | 'rapido'
  quantity: number
  config: TributeConfig
  addedAt: string
}
