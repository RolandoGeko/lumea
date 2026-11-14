import { getProduct } from '../../data/catalog'
import type { TributeConfig } from '../../lib/types'
import { todayIso } from '../../lib/validation'

/**
 * El configurador es un "taller" de cuatro momentos (más la revisión final).
 * Cada momento agrupa varias decisiones; la pieza se ve en vivo a la derecha.
 */
export type StepId = 'quien' | 'paleta' | 'forma' | 'palabras' | 'revision'

export interface StepDef {
  id: StepId
  short: string
  title: string
  intro: string
  validate?: (c: TributeConfig) => Errors
}

type Errors = Record<string, string>

export const MAX_DEDICATION = 200
export const MAX_ABOUT = 600

export const steps: StepDef[] = [
  {
    id: 'quien', short: 'Quién era', title: '¿Cómo era?',
    intro: 'Empecemos por la persona, no por las flores. Elige lo que más se le parece.',
    validate: (c): Errors => {
      const e: Errors = {}
      if (!c.inspirationId) e.inspirationId = 'Elige lo que más se le parece.'
      else if (c.inspirationId === 'otra' && c.inspirationOther.trim().length < 3) e.inspirationOther = 'Cuéntanos brevemente.'
      if (c.aboutPerson.length > MAX_ABOUT) e.aboutPerson = `Máximo ${MAX_ABOUT} caracteres.`
      return e
    },
  },
  {
    id: 'paleta', short: 'Su paleta', title: 'Sus colores',
    intro: 'Te proponemos las paletas que nacen de lo que nos contaste. Las flores llevan esos tonos.',
    validate: (c): Errors => {
      const e: Errors = {}
      if (!c.paletteId) e.paletteId = 'Elige una paleta.'
      if (c.flowerNotes.length > 300) e.flowerNotes = 'Máximo 300 caracteres.'
      return e
    },
  },
  {
    id: 'forma', short: 'La forma', title: 'La forma de la pieza',
    intro: 'Dónde estará, de qué pieza partimos, su tamaño y en qué recipiente.',
    validate: (c): Errors => {
      const e: Errors = {}
      if (!c.destination) e.destination = 'Elige dónde estará.'
      if (!getProduct(c.productId)) e.productId = 'Elige una pieza de partida.'
      if (!c.sizeId) e.sizeId = 'Elige un tamaño.'
      if (!c.containerId) e.containerId = 'Elige una presentación.'
      if (!c.budgetId) e.budgetId = 'Elige un rango de presupuesto.'
      return e
    },
  },
  {
    id: 'palabras', short: 'Las palabras', title: 'Las palabras y la entrega',
    intro: 'Lo que dirá la tarjeta, y dónde y cuándo debería llegar.',
    validate: (c): Errors => {
      const e: Errors = {}
      if (c.dedication.length > MAX_DEDICATION) e.dedication = `Máximo ${MAX_DEDICATION} caracteres.`
      if (c.signature.length > 80) e.signature = 'Máximo 80 caracteres.'
      if (!c.district) e.district = 'Elige un distrito.'
      if (!c.date) e.date = 'Indica una fecha deseada.'
      else if (c.date < todayIso()) e.date = 'La fecha no puede ser anterior a hoy.'
      if (c.place.trim().length < 4) e.place = 'Indica el lugar (velatorio, funeraria o domicilio).'
      return e
    },
  },
  { id: 'revision', short: 'Tu pieza', title: 'Tu pieza', intro: 'Revisa todo antes de guardarla. Puedes volver a cualquier momento.' },
]
