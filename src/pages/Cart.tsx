import { jumpTo } from '../lib/jump'
import { Link } from 'react-router-dom'
import { commerce, formatPrice } from '../config/commerce'
import { getCollection, getProduct } from '../data/catalog'
import { byId, containers, inspirations, palettes, sizes } from '../data/options'
import ProductVisual from '../components/product/ProductVisual'
import QuotePanel from '../components/quote/QuotePanel'
import Notice from '../components/ui/Notice'
import SectionHeading from '../components/ui/SectionHeading'
import { useCart } from '../context/CartContext'
import { estimateUnitPrice } from '../lib/pricing'

export default function Cart() {
  const { items, subtotal, hasQuoteOnly, setQuantity, removeItem, updateItem, clear } = useCart()

  if (items.length === 0) {
    return (
      <div className="container-l pb-28 pt-12 lg:pt-20">
        <SectionHeading as="h1" eyebrow="Mi selección · vacía" title={<>Todavía <em className="text-terracota">no hay piezas.</em></>}>
          Empieza una pieza en el taller o mira las doce de partida. Lo que guardes se queda en este navegador.
        </SectionHeading>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/crea-tu-homenaje" className="btn-primary">
            Abrir el taller
          </Link>
          <Link to="/colecciones" className="btn-ghost">
            Ver las piezas
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-l pb-28 pt-12 lg:pt-20">
      <SectionHeading as="h1" eyebrow="Mi selección" title="Tus piezas">
        Revisa, ajusta y prepara tu solicitud. No se realiza ningún cobro ni reserva.
      </SectionHeading>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
        <section aria-label="Homenajes seleccionados">
          <ul className="border-t border-tinta/20">
            {items.map((item) => {
              const c = item.config
              const product = getProduct(c.productId)!
              const unit = estimateUnitPrice(c)
              const insp = byId(inspirations, c.inspirationId)
              return (
                <li key={item.lineId} className="grid grid-cols-[96px_1fr] gap-5 border-b border-tinta/15 py-8 sm:grid-cols-[160px_1fr] sm:gap-6">
                  <div className="aspect-[4/5] overflow-hidden">
                    <ProductVisual product={product} paletteId={c.paletteId} containerId={c.containerId} sizeId={c.sizeId} />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="ficha">
                          Nº {product.number} · {getCollection(product.collection)?.name} · {item.kind === 'personalizado' ? 'Personalizado' : 'Selección rápida'}
                        </p>
                        <h2 className="mt-1 text-[34px]">{product.name}</h2>
                      </div>
                      <p className="text-right font-display text-[26px]">
                        {commerce.showPrices && unit !== null ? formatPrice(unit * item.quantity) : 'A cotizar'}
                        {unit !== null && item.quantity > 1 && <span className="ficha block">{formatPrice(unit)} c/u</span>}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="text-sm">
                        <span className="field-label !mb-1">Paleta</span>
                        <select className="field-input !py-2 text-sm" value={c.paletteId} onChange={(e) => updateItem(item.lineId, { paletteId: e.target.value as typeof c.paletteId })}>
                          {palettes.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-sm">
                        <span className="field-label !mb-1">Tamaño</span>
                        <select className="field-input !py-2 text-sm" value={c.sizeId} onChange={(e) => updateItem(item.lineId, { sizeId: e.target.value as typeof c.sizeId })}>
                          {product.sizes.map((s) => (
                            <option key={s} value={s}>
                              {byId(sizes, s)?.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-sm">
                        <span className="field-label !mb-1">Presentación</span>
                        <select className="field-input !py-2 text-sm" value={c.containerId} onChange={(e) => updateItem(item.lineId, { containerId: e.target.value as typeof c.containerId })}>
                          {product.containers.map((cid) => (
                            <option key={cid} value={cid}>
                              {byId(containers, cid)?.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    {item.kind === 'personalizado' && (
                      <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                        {c.destination && (
                          <div className="flex gap-2">
                            <dt className="text-piedra">Para:</dt>
                            <dd>{c.destination === 'velatorio' ? 'Velatorio' : 'Hogar'}</dd>
                          </div>
                        )}
                        {insp && (
                          <div className="flex gap-2">
                            <dt className="text-piedra">Inspiración:</dt>
                            <dd>{c.inspirationId === 'otra' ? c.inspirationOther : insp.name}</dd>
                          </div>
                        )}
                        {(c.district || c.date) && (
                          <div className="flex gap-2">
                            <dt className="text-piedra">Entrega:</dt>
                            <dd>{[c.district, c.date].filter(Boolean).join(' · ')}</dd>
                          </div>
                        )}
                        {c.favoriteFlowers.length > 0 && (
                          <div className="flex gap-2">
                            <dt className="text-piedra">Flores:</dt>
                            <dd>{c.favoriteFlowers.join(', ')}</dd>
                          </div>
                        )}
                        {c.dedication && (
                          <div className="sm:col-span-2">
                            <dt className="sr-only">Dedicatoria</dt>
                            <dd className="font-display text-[20px] italic">“{c.dedication}”</dd>
                          </div>
                        )}
                      </dl>
                    )}

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center border border-tinta/20" role="group" aria-label={`Cantidad de ${product.name}`}>
                        <button type="button" className="h-10 w-10 text-lg hover:bg-arena disabled:opacity-40" onClick={() => setQuantity(item.lineId, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Disminuir cantidad">
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={item.quantity}
                          onChange={(e) => setQuantity(item.lineId, Number(e.target.value))}
                          className="w-12 bg-transparent text-center text-sm [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                          aria-label="Cantidad"
                        />
                        <button type="button" className="h-10 w-10 text-lg hover:bg-arena disabled:opacity-40" onClick={() => setQuantity(item.lineId, item.quantity + 1)} disabled={item.quantity >= 50} aria-label="Aumentar cantidad">
                          +
                        </button>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <Link to={`/crea-tu-homenaje?editar=${item.lineId}`} className="text-tinta underline underline-offset-4 hover:text-terracota-oscura">
                          {item.kind === 'personalizado' ? 'Editar personalización' : 'Personalizar'}
                        </Link>
                        <button type="button" className="text-terracota-oscura underline underline-offset-4" onClick={() => removeItem(item.lineId)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <button type="button" className="mt-4 text-sm text-piedra underline underline-offset-4" onClick={clear}>
            Vaciar selección
          </button>
        </section>

        <aside className="space-y-5" aria-label="Resumen">
          <div className="space-y-4 border-t-2 border-tinta pt-5 lg:sticky lg:top-28">
            <h2 className="ficha !text-tinta">Resumen</h2>
            <dl className="space-y-2 text-sm">
              {items.map((i) => {
                const unit = estimateUnitPrice(i.config)
                return (
                  <div key={i.lineId} className="flex justify-between gap-3">
                    <dt>
                      {getProduct(i.config.productId)?.name} × {i.quantity}
                    </dt>
                    <dd>{commerce.showPrices && unit !== null ? formatPrice(unit * i.quantity) : 'Por cotizar'}</dd>
                  </div>
                )
              })}
            </dl>
            <div className="flex items-baseline justify-between border-t border-tinta/10 pt-3">
              <span className="ficha">Subtotal referencial</span>
              <span className="font-display text-[36px]">{commerce.showPrices ? formatPrice(subtotal) : '—'}</span>
            </div>
            {hasQuoteOnly && <p className="text-xs text-piedra">+ ítems por cotizar</p>}
            <p className="text-xs text-piedra">{commerce.priceDisclaimer} No incluye entrega.</p>
            <a href="#solicitud" onClick={jumpTo('solicitud')} className="btn-accent w-full">
              Preparar solicitud
            </a>
          </div>
        </aside>
      </div>

      <section id="solicitud" className="mt-20 scroll-mt-28 bg-arena p-6 sm:p-12" aria-labelledby="solicitud-titulo">
        <p className="ficha">Solicitud de cotización</p>
        <h2 id="solicitud-titulo" className="mt-3 text-[40px] sm:text-[52px]">
          Prepara tu mensaje
        </h2>
        <p className="mt-2 max-w-2xl text-piedra">
          Armamos un mensaje con tus piezas, personalizaciones y datos de entrega. Podrás revisarlo antes de compartirlo.
        </p>
        <Notice className="mt-4 max-w-2xl">No guardamos tus datos en ningún servidor. Esta solicitud no es una compra ni una reserva.</Notice>
        <div className="mt-8">
          <QuotePanel items={items} />
        </div>
      </section>
    </div>
  )
}
