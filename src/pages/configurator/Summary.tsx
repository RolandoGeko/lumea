import { commerce, formatPrice } from '../../config/commerce'
import { getCollection, getProduct } from '../../data/catalog'
import { budgets, byId, containers, inspirations, palettes, sizes } from '../../data/options'
import ProductVisual from '../../components/product/ProductVisual'
import { budgetFits, estimateUnitPrice } from '../../lib/pricing'
import type { TributeConfig } from '../../lib/types'
import type { Suggestion } from '../../lib/recommendations'

const inspirationName = (c: TributeConfig) =>
  c.inspirationId === 'otra' ? c.inspirationOther.trim() || 'Otra cosa' : byId(inspirations, c.inspirationId)?.name

/**
 * La lámina en proceso. Antes de elegir una pieza de partida muestra la paleta
 * como una composición de color; después, la fotografía de referencia.
 */
export function Preview({ config, className = '' }: { config: TributeConfig; className?: string }) {
  const product = getProduct(config.productId)
  const palette = byId(palettes, config.paletteId)

  if (product) {
    return (
      <div className={`relative ${className}`}>
        <ProductVisual product={product} />
      </div>
    )
  }

  if (palette) {
    const [a, b, c, d] = palette.colors
    return (
      <div className={`grid grid-cols-3 grid-rows-4 gap-1.5 bg-papel p-1.5 ${className}`} aria-label={`Paleta ${palette.name}`} role="img">
        <span className="col-span-2 row-span-3" style={{ background: a }} />
        <span className="row-span-2" style={{ background: b }} />
        <span style={{ background: c }} />
        <span className="col-span-2" style={{ background: d }} />
        <span className="flex items-end bg-papel p-2">
          <span className="ficha leading-tight">{palette.name}</span>
        </span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col justify-between bg-arena/70 p-6 ${className}`}>
      <p className="ficha">Lámina en blanco</p>
      <div>
        <span className="block h-px w-full bg-tinta/15" />
        <span className="mt-3 block h-px w-2/3 bg-tinta/15" />
        <span className="mt-3 block h-px w-1/2 bg-tinta/15" />
      </div>
      <p className="max-w-[16rem] font-display text-[26px] leading-[1.1] text-tinta/70">
        La pieza va tomando forma mientras nos cuentas.
      </p>
    </div>
  )
}

export function PaletteSwatches({ id, className = '' }: { id: TributeConfig['paletteId']; className?: string }) {
  const p = byId(palettes, id)
  if (!p) return null
  return (
    <span className={`flex gap-1 ${className}`} aria-hidden="true">
      {p.colors.map((c, i) => (
        <span key={i} className="h-4 w-4 ring-1 ring-tinta/10" style={{ background: c }} />
      ))}
    </span>
  )
}

export function SummaryList({ config }: { config: TributeConfig }) {
  const product = getProduct(config.productId)
  const size = byId(sizes, config.sizeId)
  const flowers = config.favoriteFlowers.length ? config.favoriteFlowers.join(', ') : undefined
  const rows: [string, string | undefined][] = [
    ['Su mundo', inspirationName(config)],
    ['Paleta', byId(palettes, config.paletteId)?.name],
    ['Flores', flowers],
    ['Sin', config.avoidFlowers.join(', ') || undefined],
    ['Para', config.destination === 'velatorio' ? 'Velatorio' : config.destination === 'hogar' ? 'Hogar de la familia' : undefined],
    ['Parte de', product ? `Nº ${product.number} ${product.name} · ${getCollection(product.collection)?.name}` : undefined],
    ['Tamaño', size ? `${size.name} · ${size.approx}` : undefined],
    ['Recipiente', byId(containers, config.containerId)?.name],
    ['Presupuesto', byId(budgets, config.budgetId)?.name],
    ['Entrega', [config.district, config.date].filter(Boolean).join(' · ') || undefined],
  ]
  return (
    <dl className="border-t border-tinta/15">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[96px_1fr] gap-3 border-b border-tinta/10 py-2">
          <dt className="ficha pt-[3px]">{k}</dt>
          <dd className={`text-[14px] leading-snug ${v ? 'text-tinta' : 'text-piedra/50'}`}>{v ?? '—'}</dd>
        </div>
      ))}
    </dl>
  )
}

export function PriceLine({ config }: { config: TributeConfig }) {
  const price = estimateUnitPrice(config)
  const fit = budgetFits(config.budgetId, price)
  if (!getProduct(config.productId)) return null
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="ficha">Referencia</span>
      <span className="text-right">
        <span className="font-display text-[34px] leading-none">
          {commerce.showPrices && price !== null ? formatPrice(price) : 'A cotizar'}
        </span>
        {fit === 'over' && <span className="ficha block !text-terracota-oscura">Supera tu presupuesto</span>}
        {fit === 'ok' && <span className="ficha block !text-salvia-oscura">Dentro de tu presupuesto</span>}
      </span>
    </div>
  )
}

export function Suggestions({ items, onApply }: { items: Suggestion[]; onApply: (s: Suggestion) => void }) {
  if (!items.length) return null
  return (
    <div aria-live="polite">
      <p className="ficha">Notas del taller</p>
      <ul className="mt-3 space-y-3">
        {items.map((s) => (
          <li
            key={s.id}
            className={`border-l-2 pl-4 text-[14px] leading-relaxed ${s.tone === 'warning' ? 'border-terracota text-terracota-oscura' : 'border-salvia text-tinta/80'}`}
          >
            <p>{s.text}</p>
            {s.apply && (
              <button type="button" className="link-line mt-1.5 !text-[13px]" onClick={() => onApply(s)}>
                Aplicar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
