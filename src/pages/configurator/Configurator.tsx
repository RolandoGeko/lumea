import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { commerce, formatPrice } from '../../config/commerce'
import { getCollection, getProduct } from '../../data/catalog'
import {
  budgets, byId, containers, districts, flowerOptions, inspirations, palettes, sizes,
} from '../../data/options'
import type { PaletteId, SizeId } from '../../data/options'
import ProductVisual from '../../components/product/ProductVisual'
import { Field, describedBy } from '../../components/ui/Field'
import Notice from '../../components/ui/Notice'
import Modal from '../../components/quote/Modal'
import QuotePanel from '../../components/quote/QuotePanel'
import { useCart } from '../../context/CartContext'
import { load, remove, save } from '../../lib/storage'
import { emptyConfig } from '../../lib/types'
import type { TributeConfig } from '../../lib/types'
import {
  detectInspiration, getSuggestions, recommendedContainers, recommendedPalettes, recommendedSizes, suggestProducts,
} from '../../lib/recommendations'
import { estimateUnitPrice } from '../../lib/pricing'
import { todayIso } from '../../lib/validation'
import { MAX_ABOUT, MAX_DEDICATION, steps } from './steps'
import { PaletteSwatches, PriceLine, Preview, Suggestions, SummaryList } from './Summary'

interface Draft {
  config: TributeConfig
  step: number
  maxStep: number
}

/** v2: el taller tiene 5 momentos (antes 12 pasos); un borrador antiguo se descarta. */
const DRAFT_KEY = 'configurador-v2'
const freshDraft = (): Draft => ({ config: { ...emptyConfig }, step: 0, maxStep: 0 })

/** Alturas orientativas (cm) para el dibujo a escala */
const sizeHeight: Record<SizeId, number> = { intimo: 40, mediano: 62, amplio: 95, monumental: 130 }

/** Ajusta tamaño/presentación si dejan de ser válidos para la pieza elegida */
function normalizeForProduct(config: TributeConfig): TributeConfig {
  const p = getProduct(config.productId)
  if (!p) return config
  return {
    ...config,
    sizeId: config.sizeId && p.sizes.includes(config.sizeId) ? config.sizeId : '',
    containerId: config.containerId && p.containers.includes(config.containerId) ? config.containerId : '',
  }
}

/** Opción seleccionable: bloque de esquinas rectas con marca de selección en texto */
function Option({
  selected, onClick, children, className = '', tag, badge = true,
}: { selected: boolean; onClick: () => void; children: ReactNode; className?: string; tag?: string; badge?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`group relative border text-left transition-colors duration-300 ${
        selected ? 'border-tinta bg-papel' : 'border-tinta/15 bg-transparent hover:border-tinta/50'
      } ${className}`}
    >
      {badge && (selected || tag) && (
        <span className={`ficha absolute right-3 top-3 ${selected ? '!text-terracota-oscura' : ''}`}>{selected ? 'Elegido' : tag}</span>
      )}
      {children}
    </button>
  )
}

function SubTitle({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="mb-5 flex items-baseline gap-4 border-t border-tinta/15 pt-4">
      <span className="ficha">{n}</span>
      <h3 className="font-display text-[28px] leading-none">{children}</h3>
    </div>
  )
}

/** Dibujo a escala: la pieza junto a la altura de una persona (170 cm) */
function ScaleDrawing({ sizeId, options }: { sizeId: TributeConfig['sizeId']; options: SizeId[] }) {
  const H = 150 // cm representados
  const px = (cm: number) => 180 - (cm / H) * 170
  return (
    <svg viewBox="0 0 240 190" className="h-auto w-full max-w-[280px]" role="img" aria-label="Comparación de tamaños con la altura de una persona">
      {[0, 50, 100, 150].map((cm) => (
        <g key={cm}>
          <line x1="20" x2="232" y1={px(cm)} y2={px(cm)} stroke="currentColor" strokeOpacity={cm === 0 ? 0.5 : 0.1} />
          <text x="0" y={px(cm) + 3} className="fill-piedra font-mono" fontSize="8">{cm}</text>
        </g>
      ))}
      {/* Persona: línea de referencia */}
      <line x1="44" x2="44" y1={px(0)} y2={px(150)} stroke="currentColor" strokeOpacity="0.35" strokeDasharray="2 3" />
      <text x="48" y={px(144)} className="fill-piedra font-mono" fontSize="7">PERSONA ↑ 170</text>
      {options.map((id, i) => {
        const h = sizeHeight[id]
        const x = 84 + i * 38
        const on = id === sizeId
        return (
          <g key={id}>
            <rect x={x} y={px(h)} width="22" height={(h / H) * 170} className={on ? 'fill-terracota' : 'fill-tinta'} fillOpacity={on ? 0.9 : 0.12} />
            <text x={x + 11} y={px(h) - 5} textAnchor="middle" className={on ? 'fill-terracota-oscura font-mono' : 'fill-piedra font-mono'} fontSize="7">
              {h}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Configurator() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { items, addItem, replaceConfig } = useCart()
  const editId = params.get('editar')
  const editing = editId ? items.find((i) => i.lineId === editId) : undefined
  const last = steps.length - 1

  const [draft, setDraft] = useState<Draft>(() => {
    if (editing) return { config: { ...emptyConfig, ...editing.config }, step: last, maxStep: last }
    const stored = load<Draft>(DRAFT_KEY, freshDraft())
    const base: Draft = { ...freshDraft(), ...stored, config: { ...emptyConfig, ...stored.config } }
    base.step = Math.min(base.step, last)
    base.maxStep = Math.min(base.maxStep, last)
    const product = getProduct(params.get('producto'))
    if (product) {
      const pal = params.get('paleta') as PaletteId | null
      const config = normalizeForProduct({
        ...base.config,
        productId: product.id,
        paletteId: pal && byId(palettes, pal) ? pal : base.config.paletteId || product.palettes[0],
        sizeId: (params.get('tamano') as TributeConfig['sizeId']) || base.config.sizeId,
        containerId: (params.get('presentacion') as TributeConfig['containerId']) || base.config.containerId,
      })
      return { config, step: 0, maxStep: base.maxStep }
    }
    return base
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [added, setAdded] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [mobileSummary, setMobileSummary] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  const { config, step, maxStep } = draft
  const current = steps[step]
  const product = getProduct(config.productId)
  const inspiration = byId(inspirations, config.inspirationId)

  useEffect(() => {
    if (!editId && params.get('producto')) setParams({}, { replace: true })
  }, [editId, params, setParams])

  useEffect(() => {
    if (!editing) save(DRAFT_KEY, draft)
  }, [draft, editing])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
    headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  const set = (patch: Partial<TributeConfig>) => {
    setDraft((d) => {
      let next = { ...d.config, ...patch }
      if (patch.productId && patch.productId !== d.config.productId) {
        const p = getProduct(patch.productId)
        next = normalizeForProduct(next)
        // La paleta la eligió la persona: solo se completa si aún no hay una
        if (p && !next.paletteId) next.paletteId = p.palettes[0]
      }
      return { ...d, config: next }
    })
    setErrors((e) => {
      const copy = { ...e }
      Object.keys(patch).forEach((k) => delete copy[k])
      return copy
    })
    setAdded(false)
  }

  const goTo = (i: number) => {
    setErrors({})
    setDraft((d) => ({ ...d, step: i, maxStep: Math.max(d.maxStep, i) }))
  }

  const next = () => {
    const e = current.validate?.(config) ?? {}
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus()
      return
    }
    goTo(Math.min(step + 1, last))
  }

  const firstInvalidStep = () => steps.findIndex((s) => Object.keys(s.validate?.(config) ?? {}).length > 0)

  const suggestions = useMemo(() => getSuggestions(config), [config])
  const price = estimateUnitPrice(config)

  const onAdd = () => {
    const bad = firstInvalidStep()
    if (bad >= 0) return goTo(bad)
    if (editing) {
      replaceConfig(editing.lineId, config)
      navigate('/carrito')
      return
    }
    addItem(config, 'personalizado')
    setAdded(true)
  }

  const onQuote = () => {
    const bad = firstInvalidStep()
    if (bad >= 0) return goTo(bad)
    setQuoteOpen(true)
  }

  const restart = () => {
    remove(DRAFT_KEY)
    setDraft(freshDraft())
    setAdded(false)
    setErrors({})
    if (editId) setParams({}, { replace: true })
  }

  const toggleFlower = (list: 'favoriteFlowers' | 'avoidFlowers', flower: string) => {
    const other = list === 'favoriteFlowers' ? 'avoidFlowers' : 'favoriteFlowers'
    const has = config[list].includes(flower)
    set({
      [list]: has ? config[list].filter((f) => f !== flower) : [...config[list], flower],
      [other]: config[other].filter((f) => f !== flower),
    } as Partial<TributeConfig>)
  }

  const recSizes = recommendedSizes(config.destination)
  const recContainers = recommendedContainers(config.destination)
  const recPalettes = recommendedPalettes(config.inspirationId)
  const detected = config.aboutPerson.trim().length > 12 ? detectInspiration(config.aboutPerson) : null
  const orderedPalettes = [...palettes].sort((a, b) => Number(recPalettes.includes(b.id)) - Number(recPalettes.includes(a.id)))

  return (
    <div className="container-l pb-24 pt-10 lg:pt-16">
      {/* Cabecera del taller */}
      <header className="grid-l items-end gap-y-6">
        <div className="col-span-4 lg:col-span-7">
          <p className="ficha">{editing ? 'Editando una pieza de tu selección' : 'Taller · Crea tu homenaje'}</p>
          <h1 className="mt-5 text-[52px] sm:text-[72px] lg:text-[88px]">
            Una pieza <em className="text-terracota">a partir de alguien.</em>
          </h1>
        </div>
        <p className="col-span-4 max-w-sm text-[15px] text-piedra lg:col-span-4 lg:col-start-9">
          Cuatro momentos. Primero la persona, luego el color, la forma y las palabras. Lo que escribas se queda en este navegador.
        </p>
      </header>

      {/* Momentos */}
      <nav aria-label="Momentos del taller" className="-mx-4 mt-12 overflow-x-auto px-4">
        <ol className="grid min-w-[620px] grid-cols-5 border-t border-tinta/20">
          {steps.map((s, i) => {
            const reachable = i <= maxStep
            const active = i === step
            return (
              <li key={s.id}>
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => goTo(i)}
                  aria-current={active ? 'step' : undefined}
                  className={`-mt-px w-full border-t-2 pb-2 pt-3 text-left transition-colors ${
                    active ? 'border-terracota' : reachable ? 'border-transparent hover:border-tinta/40' : 'border-transparent'
                  }`}
                >
                  <span className={`ficha block ${active ? '!text-terracota-oscura' : ''}`}>{i < last ? `0${i + 1}` : 'Fin'}</span>
                  <span className={`mt-1 block font-display text-[22px] leading-none ${reachable ? 'text-tinta' : 'text-tinta/30'}`}>{s.short}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Lámina en móvil: resumen plegable */}
      <div className="mt-6 border-y border-tinta/15 lg:hidden">
        <button type="button" onClick={() => setMobileSummary((m) => !m)} aria-expanded={mobileSummary} className="flex w-full items-center gap-4 py-3 text-left">
          <Preview config={config} className="h-20 w-16 shrink-0 overflow-hidden" />
          <span className="flex-1">
            <span className="ficha block">Tu pieza</span>
            <span className="block font-display text-[22px] leading-tight">{product?.name ?? inspiration?.name ?? 'En proceso'}</span>
            <span className="ficha block">
              {commerce.showPrices && price !== null ? `Referencia ${formatPrice(price)}` : product ? 'A cotizar' : 'Sin pieza de partida aún'}
            </span>
          </span>
          <span className="ficha !text-tinta">{mobileSummary ? 'Cerrar' : 'Ver'}</span>
        </button>
        {mobileSummary && (
          <div className="space-y-4 pb-5">
            <SummaryList config={config} />
            <PriceLine config={config} />
          </div>
        )}
      </div>

      <div className="grid-l mt-10 gap-y-12 lg:mt-14">
        {/* Momento actual */}
        <section aria-labelledby="paso-titulo" className="col-span-4 min-w-0 lg:col-span-7">
          <p className="ficha">{step < last ? `Momento ${step + 1} de ${last}` : 'Revisión'}</p>
          <h2 id="paso-titulo" ref={headingRef} tabIndex={-1} className="mt-3 scroll-mt-28 text-[44px] focus:outline-none sm:text-[56px]">
            {current.title}
          </h2>
          <p className="mt-3 max-w-lg text-piedra">{current.intro}</p>

          <div className="mt-10 space-y-14">
            {/* 01 · QUIÉN ERA */}
            {current.id === 'quien' && (
              <>
                <fieldset>
                  <legend className="sr-only">Lo que más se le parece</legend>
                  <div id="f-inspirationId" tabIndex={-1} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {inspirations.map((insp) => {
                      const pal = byId(palettes, insp.palettes[0])
                      return (
                        <Option key={insp.id} selected={config.inspirationId === insp.id} onClick={() => set({ inspirationId: insp.id })} className="flex min-h-[132px] flex-col justify-between p-5">
                          <span>
                            <span className="block font-display text-[30px] leading-none">{insp.name}</span>
                            <span className="mt-2 block text-[14px] text-piedra">{insp.description}</span>
                          </span>
                          {pal && (
                            <span className="mt-4 flex gap-1" aria-hidden="true">
                              {pal.colors.map((c, i) => (
                                <span key={i} className="h-2 w-8" style={{ background: c }} />
                              ))}
                            </span>
                          )}
                        </Option>
                      )
                    })}
                  </div>
                  {config.inspirationId === 'otra' && (
                    <div className="mt-5">
                      <Field id="f-inspirationOther" label="Con tus palabras" error={errors.inspirationOther}>
                        <input id="f-inspirationOther" className="field-input" maxLength={120} value={config.inspirationOther} placeholder="Los domingos de fútbol, el taller de carpintería…" onChange={(e) => set({ inspirationOther: e.target.value })} aria-invalid={!!errors.inspirationOther} aria-describedby={describedBy('f-inspirationOther', errors.inspirationOther)} />
                      </Field>
                    </div>
                  )}
                  {errors.inspirationId && <p className="field-error" role="alert">{errors.inspirationId}</p>}
                </fieldset>

                <div>
                  <SubTitle n="Opcional">Si quieres, cuéntanos algo más</SubTitle>
                  <Field id="f-aboutPerson" label="Sobre la persona" optional error={errors.aboutPerson} hint={`${config.aboutPerson.length}/${MAX_ABOUT} caracteres`}>
                    <textarea
                      id="f-aboutPerson"
                      rows={5}
                      className="field-input"
                      placeholder="Cocinaba para toda la familia los domingos y siempre tenía música puesta."
                      value={config.aboutPerson}
                      maxLength={MAX_ABOUT}
                      onChange={(e) => set({ aboutPerson: e.target.value })}
                      aria-describedby={describedBy('f-aboutPerson', errors.aboutPerson, 'x')}
                    />
                  </Field>
                  {detected && detected.id !== config.inspirationId && (
                    <p className="mt-3 text-[14px] text-tinta/80">
                      Por lo que escribes ({detected.reason}), quizá encaje “{byId(inspirations, detected.id)?.name}”.{' '}
                      <button type="button" className="link-line !text-[13px]" onClick={() => set({ inspirationId: detected.id })}>
                        Usar esa
                      </button>
                    </p>
                  )}
                  <Notice className="mt-5">
                    Esto se guarda solo en tu navegador. No se envía a ningún lado; al preparar la solicitud decides si lo compartes.
                  </Notice>
                </div>
              </>
            )}

            {/* 02 · SU PALETA */}
            {current.id === 'paleta' && (
              <>
                <fieldset>
                  <legend className="sr-only">Paletas de color</legend>
                  <div id="f-paletteId" tabIndex={-1} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {orderedPalettes.map((p) => (
                      <Option key={p.id} selected={config.paletteId === p.id} onClick={() => set({ paletteId: p.id })} className="p-1.5" badge={false}>
                        <span className="grid h-36 grid-cols-3 grid-rows-3 gap-1" aria-hidden="true">
                          <span className="col-span-2 row-span-3" style={{ background: p.colors[0] }} />
                          <span style={{ background: p.colors[1] }} />
                          <span style={{ background: p.colors[2] }} />
                          <span style={{ background: p.colors[3] }} />
                        </span>
                        <span className="block px-2 pb-2 pt-3 font-display text-[20px] leading-tight">{p.name}</span>
                        <span className={`ficha block px-2 pb-1 ${config.paletteId === p.id ? '!text-terracota-oscura' : ''}`}>
                          {config.paletteId === p.id ? 'Elegida' : recPalettes.includes(p.id) ? 'Para ti' : '\u00a0'}
                        </span>
                      </Option>
                    ))}
                  </div>
                  {config.paletteId && <p className="mt-4 text-[15px] text-piedra">{byId(palettes, config.paletteId)?.description}</p>}
                  {errors.paletteId && <p className="field-error" role="alert">{errors.paletteId}</p>}
                </fieldset>

                <div>
                  <SubTitle n="Flores">Flores que eran suyas</SubTitle>
                  {inspiration && inspiration.flowers.length > 0 && (
                    <p className="-mt-2 mb-5 text-[14px] text-piedra">
                      Para “{inspiration.name}” solemos pensar en {inspiration.flowers.join(', ').toLowerCase()}.
                    </p>
                  )}
                  <fieldset>
                    <legend className="field-label">Que estén</legend>
                    <div className="flex flex-wrap gap-2">
                      {flowerOptions.map((f) => (
                        <button key={f} type="button" aria-pressed={config.favoriteFlowers.includes(f)} onClick={() => toggleFlower('favoriteFlowers', f)} className={config.favoriteFlowers.includes(f) ? 'chip-on !py-1.5' : 'chip-off !py-1.5'}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="mt-7">
                    <legend className="field-label">Que no estén</legend>
                    <div className="flex flex-wrap gap-2">
                      {flowerOptions.map((f) => (
                        <button
                          key={f}
                          type="button"
                          aria-pressed={config.avoidFlowers.includes(f)}
                          onClick={() => toggleFlower('avoidFlowers', f)}
                          className={config.avoidFlowers.includes(f) ? 'chip border-terracota !py-1.5 text-terracota-oscura line-through' : 'chip-off !py-1.5'}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="mt-7">
                    <Field id="f-flowerNotes" label="¿Algo más sobre las flores?" optional error={errors.flowerNotes} hint="Alergias, una flor con historia, aromas suaves…">
                      <textarea id="f-flowerNotes" rows={3} className="field-input" value={config.flowerNotes} onChange={(e) => set({ flowerNotes: e.target.value })} maxLength={300} aria-describedby={describedBy('f-flowerNotes', errors.flowerNotes, 'x')} />
                    </Field>
                  </div>
                </div>
              </>
            )}

            {/* 03 · LA FORMA */}
            {current.id === 'forma' && (
              <>
                <fieldset>
                  <SubTitle n="a">Dónde estará</SubTitle>
                  <legend className="sr-only">Dónde estará</legend>
                  <div id="f-destination" tabIndex={-1} className="grid gap-3 sm:grid-cols-2">
                    {([
                      ['velatorio', 'En el velatorio', 'Acompaña la ceremonia. Más presencia, puede ir de pie.'],
                      ['hogar', 'En casa de la familia', 'Más íntima, en un recipiente que se queda con ellos.'],
                    ] as const).map(([id, name, text]) => (
                      <Option key={id} selected={config.destination === id} onClick={() => set({ destination: id })} className="p-5 pr-20">
                        <span className="block font-display text-[26px] leading-none">{name}</span>
                        <span className="mt-2 block text-[14px] text-piedra">{text}</span>
                      </Option>
                    ))}
                  </div>
                  {errors.destination && <p className="field-error" role="alert">{errors.destination}</p>}
                </fieldset>

                <fieldset>
                  <SubTitle n="b">De qué pieza partimos</SubTitle>
                  <legend className="sr-only">Pieza de partida</legend>
                  <p className="-mt-2 mb-5 text-[14px] text-piedra">
                    {config.inspirationId || config.destination ? 'Ordenadas según lo que nos contaste. ' : ''}Es un punto de partida: la pieza final se diseña para ti.
                  </p>
                  <div id="f-productId" tabIndex={-1} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {suggestProducts(config).map((p) => {
                      const selected = p.id === config.productId
                      return (
                        <button
                          key={p.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => set({ productId: p.id })}
                          className={`border p-1.5 text-left transition-colors ${selected ? 'border-tinta bg-papel' : 'border-transparent hover:border-tinta/30'}`}
                        >
                          <span className="block aspect-[4/5] overflow-hidden">
                            <ProductVisual product={p} />
                          </span>
                          <span className="ficha mt-2 block px-1">
                            Nº {p.number} · {getCollection(p.collection)?.name}
                          </span>
                          <span className="block px-1 pb-1 font-display text-[22px] leading-tight">{p.name}</span>
                        </button>
                      )
                    })}
                  </div>
                  {product && config.destination && !product.occasions.includes(config.destination) && (
                    <Notice className="mt-4">{product.name} suele pensarse para otra ocasión, pero podemos adaptarla.</Notice>
                  )}
                  {errors.productId && <p className="field-error" role="alert">{errors.productId}</p>}
                </fieldset>

                {product && (
                  <fieldset>
                    <SubTitle n="c">Tamaño</SubTitle>
                    <legend className="sr-only">Tamaño</legend>
                    <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
                      <div id="f-sizeId" tabIndex={-1} className="border-t border-tinta/15">
                        {product.sizes.map((sid) => {
                          const s = byId(sizes, sid)!
                          const p = estimateUnitPrice({ ...config, sizeId: sid })
                          const on = config.sizeId === sid
                          return (
                            <button
                              key={sid}
                              type="button"
                              aria-pressed={on}
                              onClick={() => set({ sizeId: sid })}
                              className={`grid w-full grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-tinta/15 py-4 pl-3 text-left transition-colors ${on ? 'border-l-2 border-l-terracota bg-papel' : 'border-l-2 border-l-transparent hover:bg-papel/60'}`}
                            >
                              <span className="font-display text-[26px] leading-none">{s.name}</span>
                              <span className="pr-3 text-[14px]">{commerce.showPrices && p !== null ? formatPrice(p) : 'A cotizar'}</span>
                              <span className="ficha mt-1">
                                {s.approx}
                                {recSizes.includes(sid) && ` · bien para ${config.destination === 'hogar' ? 'casa' : 'velatorio'}`}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      <ScaleDrawing sizeId={config.sizeId} options={product.sizes} />
                    </div>
                    {errors.sizeId && <p className="field-error" role="alert">{errors.sizeId}</p>}
                  </fieldset>
                )}

                {product && (
                  <fieldset>
                    <SubTitle n="d">Recipiente</SubTitle>
                    <legend className="sr-only">Recipiente</legend>
                    <div id="f-containerId" tabIndex={-1} className="grid gap-3 sm:grid-cols-2">
                      {product.containers.map((cid) => {
                        const c = byId(containers, cid)!
                        return (
                          <Option key={cid} selected={config.containerId === cid} onClick={() => set({ containerId: cid })} className="p-5 pr-20">
                            <span className="block font-display text-[24px] leading-none">{c.name}</span>
                            <span className="mt-2 block text-[14px] text-piedra">{c.description}</span>
                            <span className="ficha mt-3 block">
                              {c.extra > 0 && commerce.showPrices ? `+ ${formatPrice(c.extra)}` : 'Incluido'}
                              {c.keepsake && ' · se conserva'}
                              {recContainers.includes(cid) && config.destination && ` · bien para ${config.destination === 'hogar' ? 'casa' : 'velatorio'}`}
                            </span>
                          </Option>
                        )
                      })}
                    </div>
                    {errors.containerId && <p className="field-error" role="alert">{errors.containerId}</p>}
                  </fieldset>
                )}

                <fieldset>
                  <SubTitle n={product ? 'e' : 'c'}>Presupuesto</SubTitle>
                  <legend className="sr-only">Rango de presupuesto</legend>
                  <div id="f-budgetId" tabIndex={-1} className="flex flex-wrap gap-2">
                    {budgets.map((b) => (
                      <button key={b.id} type="button" aria-pressed={config.budgetId === b.id} onClick={() => set({ budgetId: b.id })} className={config.budgetId === b.id ? 'chip-on' : 'chip-off'}>
                        {b.name}
                      </button>
                    ))}
                  </div>
                  {product && (
                    <p className="mt-4 text-[14px] text-piedra">
                      Lo elegido tiene una referencia de <strong className="text-tinta">{price !== null ? formatPrice(price) : 'cotización'}</strong>. {commerce.priceDisclaimer}
                    </p>
                  )}
                  {errors.budgetId && <p className="field-error" role="alert">{errors.budgetId}</p>}
                </fieldset>
              </>
            )}

            {/* 04 · LAS PALABRAS */}
            {current.id === 'palabras' && (
              <>
                <div>
                  <SubTitle n="a">La tarjeta</SubTitle>
                  <div className="grid gap-6 sm:grid-cols-[1fr_220px]">
                    <div className="space-y-5">
                      <Field id="f-dedication" label="Dedicatoria" optional error={errors.dedication} hint={`${config.dedication.length}/${MAX_DEDICATION} caracteres`}>
                        <textarea
                          id="f-dedication"
                          rows={4}
                          className="field-input font-display text-[22px] italic leading-snug"
                          placeholder="Gracias por cada domingo y por tu manera de cuidarnos."
                          value={config.dedication}
                          maxLength={MAX_DEDICATION}
                          onChange={(e) => set({ dedication: e.target.value })}
                          aria-invalid={!!errors.dedication}
                          aria-describedby={describedBy('f-dedication', errors.dedication, 'x')}
                        />
                      </Field>
                      <Field id="f-signature" label="Firma" optional error={errors.signature} hint="Tus nietos · La familia Pérez · El equipo de Finanzas">
                        <input id="f-signature" className="field-input" value={config.signature} maxLength={80} onChange={(e) => set({ signature: e.target.value })} aria-describedby={describedBy('f-signature', errors.signature, 'x')} />
                      </Field>
                    </div>
                    {/* La tarjeta, tal como se leerá */}
                    <figure className="flex aspect-[3/4] flex-col justify-between self-start bg-papel p-5 ring-1 ring-tinta/10" aria-label="Vista de la tarjeta">
                      <span className="ficha">Tarjeta</span>
                      <blockquote className={`font-display text-[20px] italic leading-snug ${config.dedication ? 'text-tinta' : 'text-tinta/30'}`}>
                        {config.dedication || 'Aquí se leerá tu dedicatoria.'}
                      </blockquote>
                      <figcaption className="ficha">{config.signature || '—'}</figcaption>
                    </figure>
                  </div>
                </div>

                <div>
                  <SubTitle n="b">La entrega</SubTitle>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="f-district" label="Distrito" error={errors.district}>
                      <select id="f-district" className="field-input" value={config.district} onChange={(e) => set({ district: e.target.value })} aria-invalid={!!errors.district} aria-describedby={describedBy('f-district', errors.district)}>
                        <option value="">Elige un distrito</option>
                        {districts.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </Field>
                    <Field id="f-date" label="Fecha deseada" error={errors.date}>
                      <input id="f-date" type="date" min={todayIso()} className="field-input" value={config.date} onChange={(e) => set({ date: e.target.value })} aria-invalid={!!errors.date} aria-describedby={describedBy('f-date', errors.date)} />
                    </Field>
                    <Field id="f-time" label="Horario" optional>
                      <select id="f-time" className="field-input" value={config.time} onChange={(e) => set({ time: e.target.value })}>
                        <option value="">Por coordinar</option>
                        <option>Mañana (8:00–12:00)</option>
                        <option>Tarde (12:00–17:00)</option>
                        <option>Noche (17:00–21:00)</option>
                      </select>
                    </Field>
                    <Field id="f-place" label="Lugar" error={errors.place} hint="Nombre del velatorio o funeraria, o 'casa de la familia'.">
                      <input id="f-place" className="field-input" value={config.place} maxLength={160} onChange={(e) => set({ place: e.target.value })} aria-invalid={!!errors.place} aria-describedby={describedBy('f-place', errors.place, 'x')} />
                    </Field>
                    <Notice className="sm:col-span-2">{commerce.deliveryDisclaimer} La dirección exacta la coordinamos contigo directamente.</Notice>
                  </div>
                </div>
              </>
            )}

            {/* REVISIÓN */}
            {current.id === 'revision' && (
              <div className="space-y-10">
                <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
                  <Preview config={config} className="aspect-[4/5] overflow-hidden" />
                  <div>
                    <p className="ficha">{product ? `Parte de la lámina Nº ${product.number}` : 'Pieza personalizada'}</p>
                    <p className="mt-2 font-display text-[44px] leading-none">{product?.name ?? 'Tu pieza'}</p>
                    {(inspiration || config.inspirationOther) && (
                      <p className="mt-1 font-display text-[24px] italic text-terracota">{config.inspirationId === 'otra' ? config.inspirationOther : inspiration?.name}</p>
                    )}
                    <PaletteSwatches id={config.paletteId} className="mt-4" />
                    <div className="mt-6">
                      <SummaryList config={config} />
                    </div>
                    <div className="mt-5">
                      <PriceLine config={config} />
                    </div>
                  </div>
                </div>

                {(config.dedication || config.aboutPerson) && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {config.dedication && (
                      <blockquote className="border-l-2 border-terracota pl-5">
                        <p className="font-display text-[24px] italic leading-snug">“{config.dedication}”</p>
                        {config.signature && <footer className="ficha mt-3">{config.signature}</footer>}
                      </blockquote>
                    )}
                    {config.aboutPerson && (
                      <div className="border-l-2 border-tinta/20 pl-5 text-[14px] text-piedra">
                        <p className="ficha mb-2">Sobre la persona · solo en tu navegador</p>
                        <p>{config.aboutPerson}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {steps.slice(0, -1).map((s, i) => (
                    <button key={s.id} type="button" className="link-line !text-[13px]" onClick={() => goTo(i)}>
                      Volver a {s.short.toLowerCase()}
                    </button>
                  ))}
                </div>

                <Notice>{commerce.availabilityDisclaimer}</Notice>

                {added ? (
                  <div className="border-t border-tinta/15 pt-6" role="status">
                    <p className="font-display text-[32px] leading-tight">Tu pieza está en tu selección.</p>
                    <p className="mt-2 text-[15px] text-piedra">Desde allí puedes ajustar cantidades y preparar la solicitud.</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link to="/carrito" className="btn-primary">Ver mi selección</Link>
                      <button type="button" className="btn-ghost" onClick={restart}>Empezar otra pieza</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" className="btn-primary" onClick={onAdd}>
                      {editing ? 'Guardar cambios' : 'Guardar en mi selección'}
                    </button>
                    {!editing && (
                      <button type="button" className="btn-accent" onClick={onQuote}>
                        Preparar cotización
                      </button>
                    )}
                    <button type="button" className="btn-ghost" onClick={editing ? () => navigate('/carrito') : restart}>
                      {editing ? 'Cancelar' : 'Empezar de nuevo'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {current.id !== 'revision' && (
            <div className="mt-14 flex items-center justify-between gap-3 border-t border-tinta/20 pt-6">
              <button type="button" className="link-line disabled:opacity-30" onClick={() => goTo(Math.max(0, step - 1))} disabled={step === 0}>
                Atrás
              </button>
              <button type="button" className="btn-primary" onClick={next}>
                {step === last - 1 ? 'Ver la pieza' : `Seguir · ${steps[step + 1].short}`}
              </button>
            </div>
          )}
          {Object.keys(errors).length > 0 && (
            <p className="mt-3 text-[14px] text-terracota-oscura" role="alert">
              Falta completar lo marcado.
            </p>
          )}
        </section>

        {/* Lámina en vivo (escritorio) */}
        <aside className="hidden lg:col-span-4 lg:col-start-9 lg:block" aria-label="Tu pieza en proceso">
          <div className="sticky top-28 space-y-6">
            <div>
              <div className="flex items-baseline justify-between">
                <p className="ficha">Lámina en proceso</p>
                <PaletteSwatches id={config.paletteId} />
              </div>
              <Preview config={config} className="mt-3 aspect-[4/5] overflow-hidden" />
              <p className="ficha mt-2 normal-case tracking-normal">
                {product ? 'Foto de referencia de estilo. Tu pieza se hace a mano según lo que elijas.' : config.paletteId ? 'Así se reparte el color.' : ''}
              </p>
            </div>
            {current.id !== 'revision' && (
              <>
                <SummaryList config={config} />
                <PriceLine config={config} />
                {config.dedication && (
                  <p className="border-l-2 border-terracota pl-4 font-display text-[18px] italic leading-snug">“{config.dedication}”</p>
                )}
              </>
            )}
            <Suggestions items={suggestions} onApply={(s) => s.apply && set(s.apply)} />
          </div>
        </aside>
      </div>

      <div className="mt-12 lg:hidden">
        <Suggestions items={suggestions} onApply={(s) => s.apply && set(s.apply)} />
      </div>

      <Modal open={quoteOpen} onClose={() => setQuoteOpen(false)} title="Preparar cotización">
        <QuotePanel items={[{ lineId: 'borrador', kind: 'personalizado', quantity: 1, config, addedAt: new Date().toISOString() }]} />
      </Modal>
    </div>
  )
}
