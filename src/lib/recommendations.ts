/**
 * RECOMENDACIONES BASADAS EN REGLAS LOCALES
 * Sin inteligencia artificial ni servicios externos: reglas simples y editables.
 */
import { getProduct, products } from '../data/catalog'
import { byId, budgets, containers, inspirations, palettes, sizes } from '../data/options'
import type { ContainerId, InspirationId, PaletteId, SizeId } from '../data/options'
import { estimateUnitPrice } from './pricing'
import type { TributeConfig } from './types'

export interface Suggestion {
  id: string
  text: string
  /** Cambios que se aplican si el usuario acepta la sugerencia */
  apply?: Partial<TributeConfig>
  tone?: 'info' | 'warning'
}

/** Palabras clave en la descripción de la persona → inspiración sugerida */
const keywordRules: { words: string[]; inspiration: InspirationId; reason: string }[] = [
  { words: ['mar', 'playa', 'surf', 'pesca', 'océano', 'oceano', 'barco', 'costa', 'olas'], inspiration: 'mar', reason: 'mencionas el mar' },
  { words: ['jardín', 'jardin', 'plantas', 'campo', 'montaña', 'montana', 'cerro', 'naturaleza', 'árboles', 'arboles', 'chacra'], inspiration: 'naturaleza', reason: 'mencionas la naturaleza' },
  { words: ['alegre', 'alegría', 'alegria', 'risa', 'baile', 'bailar', 'fiesta', 'música', 'musica', 'color', 'carnaval'], inspiration: 'alegria', reason: 'describes una personalidad alegre' },
  { words: ['tranquil', 'paz', 'calma', 'sereno', 'serena', 'silencio', 'lectura', 'leer', 'meditar'], inspiration: 'serenidad', reason: 'describes una presencia tranquila' },
  { words: ['arte', 'pint', 'música clásica', 'escrib', 'poes', 'teatro', 'diseño', 'artista', 'creativ'], inspiration: 'arte', reason: 'mencionas el arte o la creatividad' },
  { words: ['fe', 'dios', 'luz', 'esperanza', 'oración', 'oracion', 'iglesia'], inspiration: 'fe-luz', reason: 'mencionas la fe o la esperanza' },
]

export function detectInspiration(text: string): { id: InspirationId; reason: string } | null {
  const lower = text.toLowerCase()
  for (const rule of keywordRules) {
    if (rule.words.some((w) => lower.includes(w))) return { id: rule.inspiration, reason: rule.reason }
  }
  return null
}

export function recommendedSizes(destination: TributeConfig['destination']): SizeId[] {
  if (destination === 'hogar') return ['intimo', 'mediano']
  if (destination === 'velatorio') return ['mediano', 'amplio', 'monumental']
  return []
}

export function recommendedContainers(destination: TributeConfig['destination']): ContainerId[] {
  if (destination === 'hogar') return ['ceramica', 'vidrio', 'canasta', 'madera', 'sin-recipiente']
  if (destination === 'velatorio') return ['base-pie', 'madera', 'ceramica']
  return []
}

export function recommendedPalettes(inspirationId: TributeConfig['inspirationId']): PaletteId[] {
  return byId(inspirations, inspirationId)?.palettes ?? []
}

/** Genera sugerencias contextuales para el configurador */
export function getSuggestions(config: TributeConfig): Suggestion[] {
  const out: Suggestion[] = []
  const product = getProduct(config.productId)
  if (!product) return out

  // 1. Destino vs. tamaño
  if (config.destination && config.sizeId) {
    const rec = recommendedSizes(config.destination)
    if (!rec.includes(config.sizeId)) {
      const alt = product.sizes.find((s) => rec.includes(s))
      if (alt) {
        out.push({
          id: 'size-destination',
          text:
            config.destination === 'hogar'
              ? `Para un hogar suele funcionar mejor un tamaño ${byId(sizes, alt)?.name.toLowerCase()}, más fácil de ubicar.`
              : `Para un velatorio, un tamaño ${byId(sizes, alt)?.name.toLowerCase()} tendrá más presencia.`,
          apply: { sizeId: alt },
        })
      }
    }
  }

  // 2. Destino vs. presentación
  if (config.destination === 'hogar' && config.containerId === 'base-pie') {
    const alt = product.containers.find((c) => byId(containers, c)?.keepsake)
    out.push({
      id: 'container-home',
      text: 'La base de pie está pensada para velatorios. Para el hogar, un recipiente conservable acompaña por más tiempo.',
      apply: alt ? { containerId: alt } : undefined,
    })
  }

  // 3. Inspiración → paleta
  const inspiration = byId(inspirations, config.inspirationId)
  if (inspiration && inspiration.palettes.length && config.paletteId && !inspiration.palettes.includes(config.paletteId)) {
    const alt = inspiration.palettes.find((p) => product.palettes.includes(p))
    if (alt) {
      out.push({
        id: 'palette-inspiration',
        text: `Con la inspiración "${inspiration.name}", la paleta ${byId(palettes, alt)?.name} puede expresar mejor ese sentimiento.`,
        apply: { paletteId: alt },
      })
    }
  }

  // 4. Inspiración → flores
  if (inspiration && inspiration.flowers.length && config.favoriteFlowers.length === 0) {
    out.push({
      id: 'flowers-inspiration',
      text: `Flores que suelen acompañar la inspiración "${inspiration.name}": ${inspiration.flowers.join(', ')}.`,
    })
  }

  // 5. Descripción de la persona → inspiración
  if (config.aboutPerson.trim().length > 8) {
    const detected = detectInspiration(config.aboutPerson)
    if (detected && detected.id !== config.inspirationId) {
      const insp = byId(inspirations, detected.id)
      out.push({
        id: 'about-inspiration',
        text: `Como ${detected.reason}, podría inspirarte "${insp?.name}".`,
        apply: { inspirationId: detected.id },
      })
    }
  }

  // 6. Conflicto entre flores favoritas y a evitar
  const conflict = config.favoriteFlowers.filter((f) => config.avoidFlowers.includes(f))
  if (conflict.length) {
    out.push({
      id: 'flower-conflict',
      tone: 'warning',
      text: `Marcaste ${conflict.join(', ')} como favorita y como flor a evitar. Revisa tu elección.`,
    })
  }

  // 7. Presupuesto
  const price = estimateUnitPrice(config)
  const budget = byId(budgets, config.budgetId)
  if (budget && budget.id !== 'por-definir' && price !== null && price > budget.max) {
    const cheaperSize = product.sizes.find((s) => {
      const p = estimateUnitPrice({ ...config, sizeId: s })
      return p !== null && p <= budget.max
    })
    out.push({
      id: 'budget-over',
      tone: 'warning',
      text: cheaperSize
        ? `La referencia supera tu presupuesto. Un tamaño ${byId(sizes, cheaperSize)?.name.toLowerCase()} se acerca más a lo que indicaste.`
        : 'La referencia supera tu presupuesto. Podemos proponerte alternativas al revisar tu solicitud.',
      apply: cheaperSize ? { sizeId: cheaperSize } : undefined,
    })
  }

  return out
}

/** Diseños alternativos para el paso 1 según destino o inspiración ya elegidos */
export function suggestProducts(config: Pick<TributeConfig, 'destination' | 'inspirationId'>) {
  const insp = byId(inspirations, config.inspirationId)
  return products
    .map((p) => {
      let score = 0
      if (config.destination && p.occasions.includes(config.destination)) score += 2
      if (insp) score += p.palettes.filter((pl) => insp.palettes.includes(pl)).length
      return { p, score }
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p)
}
