import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { collections, products } from '../data/catalog'
import { budgets, byId, formats, occasions, palettes } from '../data/options'
import ProductCard from '../components/product/ProductCard'
import { fromPrice } from '../lib/pricing'
import { commerce } from '../config/commerce'

type FilterKey = 'ocasion' | 'paleta' | 'formato' | 'presupuesto'

const filterDefs: { key: FilterKey; label: string; options: { id: string; name: string }[] }[] = [
  { key: 'ocasion', label: 'Ocasión', options: occasions },
  { key: 'formato', label: 'Formato', options: formats },
  { key: 'paleta', label: 'Paleta', options: palettes },
  { key: 'presupuesto', label: 'Presupuesto', options: budgets.filter((b) => b.id !== 'por-definir') },
]

export default function Collections() {
  const [params, setParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const get = (k: FilterKey | 'coleccion') => params.get(k) ?? ''

  const setFilter = (k: FilterKey | 'coleccion', v: string) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const col = params.get('coleccion')
    const occ = params.get('ocasion')
    const pal = params.get('paleta')
    const fmt = params.get('formato')
    const bud = byId(budgets, params.get('presupuesto'))
    return products.filter((p) => {
      if (col && p.collection !== col) return false
      if (occ && !p.occasions.includes(occ as never)) return false
      if (pal && !p.palettes.includes(pal as never)) return false
      if (fmt && p.format !== fmt) return false
      if (bud) {
        const price = fromPrice(p.id)
        if (price === null) return bud.max === Number.POSITIVE_INFINITY
        if (price > bud.max) return false
      }
      return true
    })
  }, [params])

  const activeCount = filterDefs.filter((f) => get(f.key)).length
  const activeCollection = byId(collections, get('coleccion'))
  const count = `${String(filtered.length).padStart(2, '0')} ${filtered.length === 1 ? 'pieza' : 'piezas'}`

  return (
    <div className="container-l pb-28 pt-12 lg:pt-20">
      <header className="grid-l items-end gap-y-6">
        <div className="col-span-4 lg:col-span-7">
          <p className="ficha">Piezas · {activeCollection ? `Colección ${activeCollection.name}` : 'Índice completo'}</p>
          <h1 className="mt-5 text-[52px] sm:text-[72px] lg:text-[88px]">
            {activeCollection ? activeCollection.name : <>Doce piezas <em className="text-terracota">de partida.</em></>}
          </h1>
        </div>
        <p className="col-span-4 max-w-sm text-[15px] text-piedra lg:col-span-4 lg:col-start-9">
          {activeCollection
            ? `${activeCollection.tagline}. ${activeCollection.description}`
            : 'Ninguna se entrega igual a la foto: cada una es un punto de partida que ajustamos a la persona.'}
        </p>
      </header>

      {/* Colecciones como índice */}
      <nav aria-label="Colecciones" className="-mx-4 mt-12 overflow-x-auto px-4">
        <ul className="grid min-w-[560px] grid-cols-5 border-t border-tinta/20">
          {[{ id: '', name: 'Todas' }, ...collections].map((c, i) => {
            const on = get('coleccion') === c.id
            return (
              <li key={c.id || 'todas'}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter('coleccion', c.id)}
                  className={`-mt-px w-full border-t-2 pb-2 pt-3 text-left transition-colors ${on ? 'border-terracota' : 'border-transparent hover:border-tinta/40'}`}
                >
                  <span className={`ficha block ${on ? '!text-terracota-oscura' : ''}`}>{i === 0 ? 'Índice' : `0${i}`}</span>
                  <span className={`mt-1 block font-display text-[24px] leading-none ${on ? 'text-tinta' : 'text-tinta/60'}`}>{c.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Afinar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-tinta/15 py-3">
        <button
          type="button"
          className="ficha !text-tinta"
          aria-expanded={showFilters}
          aria-controls="filtros"
          onClick={() => setShowFilters((s) => !s)}
        >
          {showFilters ? 'Cerrar' : 'Afinar'} {activeCount > 0 && `· ${activeCount} activo${activeCount > 1 ? 's' : ''}`}
        </button>
        <div className="flex items-center gap-6">
          {activeCount > 0 && (
            <button
              type="button"
              className="ficha underline underline-offset-4"
              onClick={() => {
                const col = get('coleccion')
                setParams(col ? { coleccion: col } : {}, { replace: true })
              }}
            >
              Quitar filtros
            </button>
          )}
          <p className="ficha" aria-live="polite">{count}</p>
        </div>
      </div>

      {showFilters && (
        <div id="filtros" className="grid gap-8 border-b border-tinta/15 py-8 sm:grid-cols-2 lg:grid-cols-4" aria-label="Filtros del catálogo">
          {filterDefs.map((f) => (
            <fieldset key={f.key}>
              <legend className="ficha mb-3">{f.label}</legend>
              <ul className="space-y-1.5">
                {f.options.map((o) => {
                  const on = get(f.key) === o.id
                  return (
                    <li key={o.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setFilter(f.key, on ? '' : o.id)}
                        className={`text-left text-[15px] transition-colors ${on ? 'text-terracota-oscura underline underline-offset-4' : 'text-tinta/75 hover:text-tinta'}`}
                      >
                        {o.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </fieldset>
          ))}
        </div>
      )}

      <section aria-label="Piezas" className="mt-14">
        {filtered.length === 0 ? (
          <div className="grid-l border-t border-tinta/15 pt-10">
            <div className="col-span-4 lg:col-span-6">
              <h2 className="text-[40px]">Ninguna pieza con esa combinación.</h2>
              <p className="mt-3 text-piedra">Quita algún filtro, o empieza una pieza desde cero en el taller.</p>
              <button type="button" className="btn-primary mt-6" onClick={() => setParams({}, { replace: true })}>
                Ver todas
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <div key={p.id} className={i % 3 === 1 ? 'lg:mt-20' : ''}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
        <p className="ficha mt-14 normal-case tracking-normal">* {commerce.priceDisclaimer}</p>
      </section>
    </div>
  )
}
