import { brand } from '../config/brand'
import { allPhotos } from '../data/photos'
import SectionHeading from '../components/ui/SectionHeading'

export default function Credits() {
  return (
    <div className="container-l pb-28 pt-12 lg:pt-20">
      <SectionHeading as="h1" eyebrow="Créditos" title="Fotografías de referencia">
        <p>
          Las imágenes de este prototipo provienen de{' '}
          <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="underline underline-offset-4">
            Unsplash
          </a>{' '}
          y se usan bajo la{' '}
          <a href="https://unsplash.com/license" target="_blank" rel="noreferrer" className="underline underline-offset-4">
            Licencia Unsplash
          </a>
          . Ilustran estilos y paletas; no son arreglos elaborados por {brand.name}. Gracias a cada fotógrafo y fotógrafa.
        </p>
      </SectionHeading>
      <ul className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {allPhotos.map((p) => (
          <li key={p.src}>
            <div className="photo-frame aspect-[4/5]">
              <img src={p.src} alt={p.alt} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <p className="ficha mt-3 !text-tinta">
              <a href={p.url} target="_blank" rel="noreferrer" className="hover:text-terracota-oscura">
                {p.author}
              </a>
            </p>
            <p className="mt-1 text-[13px] leading-snug text-piedra">{p.alt}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
