import { Link } from 'react-router-dom'
import { commerce, formatPrice } from '../../config/commerce'
import { getCollection } from '../../data/catalog'
import type { Product } from '../../data/catalog'
import { fromPrice } from '../../lib/pricing'
import ProductVisual from './ProductVisual'

/**
 * Lámina: foto grande y ficha en mono, como en un catálogo de exposición.
 * Al pasar el cursor, la foto cambia a la segunda toma de la pieza.
 */
export default function ProductCard({ product, aspect = 'aspect-[4/5]' }: { product: Product; aspect?: string }) {
  const price = fromPrice(product.id)
  const second = product.images[1]
  return (
    <article className="group relative flex flex-col">
      <Link to={`/colecciones/${product.id}`} className={`relative block overflow-hidden ${aspect}`} tabIndex={-1} aria-hidden="true">
        <ProductVisual product={product} />
        {second && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-[var(--ease-suave)] group-hover:opacity-100">
            <ProductVisual product={product} image={second} />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <p className="ficha flex justify-between gap-3 border-b border-tinta/15 pb-2">
          <span>
            Nº {product.number} · {getCollection(product.collection)?.name}
          </span>
          <span className="whitespace-nowrap text-tinta">
            {commerce.showPrices && price !== null ? `desde ${formatPrice(price)}` : 'a cotizar'}
          </span>
        </p>
        <h3 className="mt-3 text-[34px] leading-none">
          <Link to={`/colecciones/${product.id}`} className="after:absolute after:inset-0 focus:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-[15px] leading-snug text-piedra">{product.portrait}</p>
        <p className="ficha mt-3">{product.flowers.join(' · ')}</p>
      </div>
    </article>
  )
}
