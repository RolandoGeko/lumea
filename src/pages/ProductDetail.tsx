import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { commerce, formatPrice } from '../config/commerce'
import { getCollection, getProduct, products } from '../data/catalog'
import { byId, containers, formats, occasions, palettes, sizes } from '../data/options'
import type { ContainerId, PaletteId, SizeId } from '../data/options'
import ProductVisual from '../components/product/ProductVisual'
import ProductCard from '../components/product/ProductCard'
import Notice from '../components/ui/Notice'
import { useCart } from '../context/CartContext'
import { estimateUnitPrice } from '../lib/pricing'
import { emptyConfig } from '../lib/types'
import NotFound from './NotFound'

/** El `key` reinicia las selecciones al pasar de un producto a otro. */
export default function ProductDetail() {
  const { id } = useParams()
  return <ProductDetailView key={id} id={id} />
}

function ProductDetailView({ id }: { id?: string }) {
  const product = getProduct(id)
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [imageIdx, setImageIdx] = useState(0)
  const [paletteId, setPaletteId] = useState<PaletteId | ''>(product?.palettes[0] ?? '')
  const [sizeId, setSizeId] = useState<SizeId | ''>(product?.sizes[0] ?? '')
  const [containerId, setContainerId] = useState<ContainerId | ''>(product?.containers[0] ?? '')
  const [added, setAdded] = useState(false)

  if (!product) return <NotFound />

  const collection = getCollection(product.collection)
  const price = estimateUnitPrice({ productId: product.id, sizeId, containerId })
  const related = products.filter((p) => p.collection === product.collection && p.id !== product.id)

  const configParams = new URLSearchParams({ producto: product.id, paleta: paletteId, tamano: sizeId, presentacion: containerId })

  const quickAdd = () => {
    addItem({ ...emptyConfig, productId: product.id, paletteId, sizeId, containerId }, 'rapido')
    setAdded(true)
  }

  const sizeName = byId(sizes, sizeId)
  const containerName = byId(containers, containerId)
  const shotLabels = ['Pieza completa', 'Detalle', 'Contexto']

  return (
    <div className="container-l pb-28 pt-8 lg:pt-12">
      <nav aria-label="Ruta" className="ficha mb-8">
        <Link to="/colecciones" className="hover:text-tinta">
          Piezas
        </Link>{' '}
        /{' '}
        <Link to={`/colecciones?coleccion=${product.collection}`} className="hover:text-tinta">
          {collection?.name}
        </Link>{' '}
        / <span className="text-tinta">Nº {product.number}</span>
      </nav>

      <div className="grid-l gap-y-12">
        {/* Galería */}
        <section aria-label="Galería" className="col-span-4 lg:col-span-7">
          <div className="aspect-[4/5] overflow-hidden">
            <ProductVisual product={product} image={product.images[imageIdx]} paletteId={paletteId} containerId={containerId} sizeId={sizeId} showCredit eager />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-4" role="group" aria-label="Tomas">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageIdx(i)}
                  aria-pressed={imageIdx === i}
                  className={`group w-28 text-left transition-opacity sm:w-36 ${imageIdx === i ? 'opacity-100' : 'opacity-55 hover:opacity-100'}`}
                >
                  <span className={`block aspect-[4/5] overflow-hidden border-b-2 ${imageIdx === i ? 'border-tinta' : 'border-transparent'}`}>
                    <ProductVisual product={product} image={img} />
                  </span>
                  <span className="ficha mt-2 block">
                    {String(i + 1).padStart(2, '0')} · {shotLabels[i] ?? 'Toma'}
                  </span>
                </button>
              ))}
            </div>
          )}
          <p className="ficha mt-6 max-w-[60ch] normal-case tracking-normal">
            Fotografía de referencia de estilo. Cada pieza se hace a mano en la paleta, tamaño y presentación que elijas, según las flores de temporada.
          </p>
        </section>

        {/* Ficha */}
        <section className="col-span-4 lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-28">
            <p className="ficha">
              Lámina Nº {product.number} · Colección {collection?.name}
            </p>
            <h1 className="mt-5 text-[72px] leading-[0.9] sm:text-[88px]">{product.name}</h1>
            <p className="mt-5 font-display text-[28px] italic leading-tight text-terracota-oscura">{product.portrait}</p>
            <p className="mt-5 text-[16px] leading-relaxed text-piedra">{product.description}</p>

            <dl className="mt-8 border-t border-tinta/20 text-[14px]">
              {[
                ['Flores', product.flowers.join(' · ')],
                ['Formato', byId(formats, product.format)?.name],
                ['Medidas', sizeName ? `${sizeName.name}, ${sizeName.approx}` : '—'],
                ['Recipiente', containerName?.name ?? '—'],
                ['Ideal para', product.occasions.map((o) => byId(occasions, o)?.name).join(', ')],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-tinta/20 py-3">
                  <dt className="ficha pt-0.5">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            <fieldset className="mt-8">
              <legend className="field-label">
                Paleta · <span className="text-tinta">{byId(palettes, paletteId)?.name}</span>
              </legend>
              <div className="flex flex-wrap gap-3">
                {product.palettes.map((pid) => {
                  const p = byId(palettes, pid)!
                  return (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => setPaletteId(pid)}
                      aria-pressed={paletteId === pid}
                      aria-label={p.name}
                      title={p.name}
                      className={`grid h-11 w-16 grid-cols-4 overflow-hidden outline-offset-[3px] ${paletteId === pid ? 'outline outline-1 outline-tinta' : 'opacity-80 hover:opacity-100'}`}
                    >
                      {p.colors.map((c, i) => (
                        <span key={i} className="h-full" style={{ background: c }} />
                      ))}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <fieldset className="mt-7">
              <legend className="field-label">Tamaño</legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sid) => {
                  const s = byId(sizes, sid)!
                  return (
                    <button key={sid} type="button" onClick={() => setSizeId(sid)} aria-pressed={sizeId === sid} className={sizeId === sid ? 'chip-on' : 'chip-off'}>
                      {s.name} <span className="opacity-70">{s.approx}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <fieldset className="mt-7">
              <legend className="field-label">Presentación</legend>
              <div className="flex flex-wrap gap-2">
                {product.containers.map((cid) => {
                  const c = byId(containers, cid)!
                  return (
                    <button key={cid} type="button" onClick={() => setContainerId(cid)} aria-pressed={containerId === cid} className={containerId === cid ? 'chip-on' : 'chip-off'}>
                      {c.name}
                      {c.keepsake && <span className="opacity-70">· se conserva</span>}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-7">
              <p className="field-label">Se puede personalizar</p>
              <ul className="text-[15px] leading-relaxed">
                {product.customizations.map((c) => (
                  <li key={c}>— {c}</li>
                ))}
              </ul>
            </div>

            <div className="mt-8 space-y-5 border-t border-tinta/20 pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="ficha">{price !== null ? 'Precio referencial' : 'Precio'}</p>
                <p className="font-display text-[44px] leading-none">
                  {commerce.showPrices && price !== null ? formatPrice(price) : 'Por cotización'}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button type="button" className="btn-primary w-full" onClick={() => navigate(`/crea-tu-homenaje?${configParams}`)}>
                  Personalizar esta pieza
                </button>
                <button type="button" className="btn-ghost w-full" onClick={quickAdd}>
                  {price !== null ? 'Agregar a mi selección' : 'Agregar para cotizar'}
                </button>
              </div>
              {added && (
                <p className="text-sm text-salvia-oscura" role="status">
                  Agregado a tu selección.{' '}
                  <Link to="/carrito" className="underline underline-offset-4">
                    Ver mi selección
                  </Link>
                </p>
              )}
              <Notice>{commerce.availabilityDisclaimer}</Notice>
            </div>
          </div>
        </section>
      </div>

      {related.length > 0 && (
        <section className="mt-32 border-t border-tinta/15 pt-16" aria-labelledby="relacionados">
          <h2 id="relacionados" className="text-[44px]">
            Más de {collection?.name}
          </h2>
          <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
