import { photos } from '../../data/photos'
import type { PhotoKey } from '../../data/photos'
import { PhotoCredit } from '../product/ProductVisual'

/** Foto de sitio (no de producto) con crédito discreto. */
export default function Photo({ id, className = '', eager = false, credit = true }: { id: PhotoKey; className?: string; eager?: boolean; credit?: boolean }) {
  const p = photos[id]
  return (
    <figure className={`photo-frame ${className}`}>
      <img src={p.src} alt={p.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className="h-full w-full object-cover" />
      {credit && <PhotoCredit author={p.author} url={p.url} />}
    </figure>
  )
}
