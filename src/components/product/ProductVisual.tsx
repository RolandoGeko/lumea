import type { Product, ProductImage } from '../../data/catalog'
import type { ContainerId, PaletteId, SizeId } from '../../data/options'
import FloralArt from './FloralArt'

/**
 * Muestra la fotografía de referencia del producto (o, si el producto no tiene foto,
 * la ilustración botánica de respaldo).
 */
export default function ProductVisual({
  product,
  image,
  paletteId,
  containerId,
  sizeId,
  className = '',
  showCredit = false,
  eager = false,
}: {
  product: Product
  image?: ProductImage
  paletteId?: PaletteId | ''
  containerId?: ContainerId | ''
  sizeId?: SizeId | ''
  className?: string
  showCredit?: boolean
  eager?: boolean
}) {
  const img = image ?? product.images[0]
  if (img?.kind === 'pendiente') return <PhotoPending product={product} alt={img.alt} className={className} />
  if (img?.kind === 'photo') {
    return (
      <figure className={`photo-frame h-full w-full ${className}`}>
        <img src={img.src} alt={img.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className="h-full w-full object-cover" />
        {showCredit && img.credit && <PhotoCredit author={img.credit} url={img.creditUrl} />}
      </figure>
    )
  }
  return (
    <FloralArt
      seed={product.id}
      collection={product.collection}
      paletteId={paletteId || product.palettes[0]}
      format={product.format}
      containerId={containerId}
      sizeId={sizeId}
      view={img?.kind === 'illustration' ? img.view : 'frontal'}
      title={img?.alt}
      className={`block h-full w-full ${className}`}
    />
  )
}

/**
 * Marcador editorial: se usa cuando todavía no hay una foto que cumpla el manual
 * de dirección fotográfica. Mejor un espacio honesto que una imagen que no corresponde.
 */
export function PhotoPending({ product, alt, className = '' }: { product: Product; alt: string; className?: string }) {
  return (
    <figure role="img" aria-label={`${alt}. Fotografía en producción.`} className={`relative flex h-full w-full flex-col justify-between bg-arena p-5 sm:p-7 ${className}`}>
      <span className="ficha">Lámina {product.number}</span>
      <span aria-hidden="true" className="mx-auto block h-[46%] w-px bg-tinta/25" />
      <figcaption className="space-y-2">
        <span className="block font-display text-3xl leading-none text-tinta/80 sm:text-4xl">{product.name}</span>
        <span className="ficha block">Fotografía en producción</span>
      </figcaption>
    </figure>
  )
}

export function PhotoCredit({ author, url }: { author: string; url?: string }) {
  return (
    <figcaption className="absolute bottom-0 right-0 bg-tinta/55 px-2 py-1 font-mono text-[10px] tracking-wide text-white/90">
      Foto referencial:{' '}
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
          {author} / Unsplash
        </a>
      ) : (
        `${author} / Unsplash`
      )}
    </figcaption>
  )
}
