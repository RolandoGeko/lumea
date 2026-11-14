import { useState } from 'react'
import { Link } from 'react-router-dom'
import { brand } from '../config/brand'
import { collections, getProduct } from '../data/catalog'
import type { CollectionId } from '../data/catalog'
import type { PhotoKey } from '../data/photos'
import ProductCard from '../components/product/ProductCard'
import Photo from '../components/ui/Photo'
import Reveal from '../components/ui/Reveal'

/* Foto que representa a cada colección en el índice */
const collectionPhoto: Record<CollectionId, PhotoKey> = {
  esencia: 'bahati',
  vida: 'dalias-ceramica',
  legado: 'espigas-ceramica',
  unica: 'claveles-azul',
}

/* Sección 3: de un recuerdo a una pieza (ejemplos ilustrativos) */
const memories: { memory: string; piece: string; photo: PhotoKey }[] = [
  { memory: 'Cuidaba su huerto y regalaba lo que cosechaba.', piece: 'Flores amarillas y blancas de estación, sueltas, como recién cortadas, en cerámica de barro claro.', photo: 'amarillos-pedestal' },
  { memory: 'Cantaba boleros los domingos mientras cocinaba.', piece: 'Claveles coral y vino, con follaje oscuro. Colores con temperamento.', photo: 'claveles-ventana' },
  { memory: 'Vivía frente al mar y caminaba por el malecón.', piece: 'Campánulas azules en una cerámica gris, del color del mar en invierno.', photo: 'campanulas-ventana' },
]

/* Sección 6: flores sencillas */
const simpleFlowers: { name: string; note: string; photo: PhotoKey }[] = [
  { name: 'Clavel', note: 'Dura dos semanas. Tiene más tonos de los que se cree.', photo: 'clavel-sombra' },
  { name: 'Crisantemo', note: 'Firme y generoso. En araña, casi una escultura.', photo: 'crisantemo-vidrio' },
  { name: 'Margarita', note: 'La flor del jardín de todos. Mejor suelta que apretada.', photo: 'margaritas-mesa' },
  { name: 'Astromelia', note: 'Flor andina, de larga vida en el florero.', photo: 'astromelia-blanca' },
  { name: 'Lluvia', note: 'Sola parece poco; junta se vuelve garúa.', photo: 'lluvia-vaso' },
]

const steps = [
  { title: 'Nos cuentas', text: 'Cómo era, qué le gustaba, dónde y cuándo se entrega.' },
  { title: 'Proponemos', text: 'Una pieza con flores, paleta y forma pensadas para esa persona.' },
  { title: 'Ajustamos contigo', text: 'Confirmamos disponibilidad de temporada, precio y dedicatoria.' },
  { title: 'Entregamos', text: 'En Lima Metropolitana, con la tarjeta escrita a mano.' },
]

export default function Home() {
  const [activeCollection, setActiveCollection] = useState<CollectionId>('esencia')
  const hero = getProduct('es-01')!
  const featured = ['es-02', 'vi-03', 'le-01'].map((id) => getProduct(id)!)

  return (
    <>
      {/* 1 · PORTADA */}
      <section className="container-l grid-l items-end gap-y-10 pb-20 pt-10 lg:pb-28 lg:pt-14">
        <div className="col-span-4 lg:col-span-5 lg:pb-6">
          <p className="eyebrow">Estudio de homenajes florales · Lima</p>
          <h1 className="mt-8 text-[64px] leading-[0.92] sm:text-[88px] lg:text-[112px]">
            Flores con la forma <em className="text-terracota-oscura">de alguien.</em>
          </h1>
          <p className="mt-8 max-w-[34ch] text-[18px] leading-relaxed text-piedra">
            Diseñamos homenajes florales a partir de cómo era una persona: su carácter, sus lugares, sus costumbres.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Link to="/crea-tu-homenaje" className="btn-primary">
              Crear un homenaje
            </Link>
            <Link to="/colecciones" className="link-line">
              Ver las piezas
            </Link>
          </div>
        </div>
        <figure className="col-span-4 lg:col-span-6 lg:col-start-7">
          <Photo id="crisantemo-arana" eager className="aspect-[4/5] w-full" />
          <figcaption className="ficha mt-3 flex justify-between gap-4">
            <span>
              Nº {hero.number} · {hero.name}
            </span>
            <span className="text-right">{hero.flowers.slice(0, 2).join(' · ')}</span>
          </figcaption>
        </figure>
      </section>

      {/* 2 · POSTURA */}
      <section className="bg-arena" aria-label="Lo que creemos">
        <div className="container-l grid-l py-24 lg:py-36">
          <Reveal className="col-span-4 lg:col-span-9 lg:col-start-2">
            <p className="font-display text-[40px] leading-[1.05] sm:text-[56px] lg:text-[76px]">
              Un homenaje no tiene que parecerse a un funeral. <span className="text-piedra">Puede parecerse a una persona.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3 · DE UN RECUERDO A UNA PIEZA */}
      <section className="container-l py-24 lg:py-40" aria-labelledby="recuerdo-titulo">
        <div className="grid-l gap-y-6">
          <p className="eyebrow col-span-4 lg:col-span-3">De un recuerdo a una pieza</p>
          <h2 id="recuerdo-titulo" className="col-span-4 text-[44px] sm:text-[56px] lg:col-span-7 lg:text-[64px]">
            Nos cuentas cómo era. Nosotros buscamos sus colores.
          </h2>
        </div>
        <ol className="mt-16 space-y-20 lg:mt-24 lg:space-y-28">
          {memories.map((m, i) => (
            <li key={m.photo} className="grid-l items-center gap-y-6">
              <Reveal className={`col-span-4 lg:col-span-5 ${i % 2 ? 'lg:order-2 lg:col-start-8' : ''}`}>
                <Photo id={m.photo} credit={false} className="aspect-[4/5] w-full" />
              </Reveal>
              <div className={`col-span-4 lg:col-span-4 ${i % 2 ? 'lg:order-1 lg:col-start-2' : 'lg:col-start-7'}`}>
                <p className="ficha">Ejemplo ilustrativo · {String(i + 1).padStart(2, '0')}</p>
                <p className="mt-5 font-display text-[34px] leading-tight sm:text-[40px]">“{m.memory}”</p>
                <p className="mt-6 border-t border-tinta/15 pt-5 text-[17px] leading-relaxed text-piedra">{m.piece}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-16 lg:mt-24 lg:pl-[calc((100%-0px)/12)]">
          <Link to="/crea-tu-homenaje" className="link-line">
            Empezar con un recuerdo
          </Link>
        </div>
      </section>

      {/* 4 · COLECCIONES COMO ÍNDICE */}
      <section className="border-t border-tinta/15" aria-labelledby="colecciones-titulo">
        <div className="container-l grid-l gap-y-12 py-24 lg:py-32">
          <div className="col-span-4 lg:col-span-6">
            <p className="eyebrow">Colecciones</p>
            <h2 id="colecciones-titulo" className="mt-5 text-[44px] sm:text-[56px]">
              Cuatro maneras de retratar a alguien
            </h2>
            <ol className="mt-12 border-t border-tinta/15">
              {collections.map((c, i) => {
                const active = c.id === activeCollection
                return (
                  <li key={c.id} className="border-b border-tinta/15">
                    <Link
                      to={`/colecciones?coleccion=${c.id}`}
                      onMouseEnter={() => setActiveCollection(c.id)}
                      onFocus={() => setActiveCollection(c.id)}
                      className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-2 py-6 sm:grid-cols-[3rem_1fr_auto]"
                    >
                      <span className="ficha">{String(i + 1).padStart(2, '0')}</span>
                      <span>
                        <span className={`block font-display text-[40px] leading-none transition-colors sm:text-[52px] ${active ? 'text-tinta' : 'text-tinta lg:text-tinta/45 lg:group-hover:text-tinta'}`}>
                          {c.name}
                        </span>
                        <span className="mt-2 block text-[15px] text-piedra">{c.tagline}</span>
                      </span>
                      <span className="ficha hidden self-center sm:block" aria-hidden="true">
                        {active ? 'Ver →' : ''}
                      </span>
                      <span className="col-start-2 mt-4 block w-24 sm:hidden" aria-hidden="true">
                        <Photo id={collectionPhoto[c.id]} credit={false} className="aspect-[4/5] w-full" />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </div>
          <div className="col-span-4 hidden lg:col-span-5 lg:col-start-8 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] w-full">
                {collections.map((c) => (
                  <div key={c.id} className={`absolute inset-0 transition-opacity duration-700 ease-[var(--ease-suave)] ${c.id === activeCollection ? 'opacity-100' : 'opacity-0'}`} aria-hidden={c.id !== activeCollection}>
                    <Photo id={collectionPhoto[c.id]} className="h-full w-full" />
                  </div>
                ))}
              </div>
              <p className="ficha mt-3">{collections.find((c) => c.id === activeCollection)?.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · PIEZAS DESTACADAS */}
      <section className="bg-papel" aria-labelledby="piezas-titulo">
        <div className="container-l py-24 lg:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="piezas-titulo" className="text-[44px] sm:text-[56px]">
              Algunas piezas
            </h2>
            <Link to="/colecciones" className="link-line">
              Ver las 12 piezas
            </Link>
          </div>
          <div className="grid-l mt-14 gap-y-16 lg:mt-20">
            <Reveal className="col-span-4 lg:col-span-5">
              <ProductCard product={featured[0]} aspect="aspect-[4/5]" />
            </Reveal>
            <Reveal className="col-span-4 lg:col-span-3 lg:col-start-7 lg:mt-32" delay={120}>
              <ProductCard product={featured[1]} aspect="aspect-[3/4]" />
            </Reveal>
            <Reveal className="col-span-4 lg:col-span-3 lg:col-start-10 lg:mt-64" delay={240}>
              <ProductCard product={featured[2]} aspect="aspect-[4/5]" />
            </Reveal>
          </div>
          <p className="ficha mt-16">Precios referenciales desde el tamaño más pequeño. Se confirman con cada pedido según temporada.</p>
        </div>
      </section>

      {/* 6 · FLORES SENCILLAS */}
      <section className="container-l py-24 lg:py-40" aria-labelledby="flores-titulo">
        <div className="grid-l gap-y-6">
          <p className="eyebrow col-span-4 lg:col-span-3">Filosofía floral</p>
          <h2 id="flores-titulo" className="col-span-4 text-[44px] sm:text-[56px] lg:col-span-8 lg:text-[64px]">
            No hace falta una flor cara. Hace falta saber ponerla.
          </h2>
        </div>
        <ul className="mt-14 flex snap-x gap-4 overflow-x-auto pb-4 lg:mt-20 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:pb-0">
          {simpleFlowers.map((f, i) => (
            <li key={f.name} className={`w-[68%] shrink-0 snap-start sm:w-[40%] lg:w-auto ${i % 2 ? 'lg:mt-16' : ''}`}>
              <Photo id={f.photo} credit={false} className="aspect-[3/4] w-full" />
              <p className="mt-4 font-display text-[28px] leading-none">{f.name}</p>
              <p className="mt-2 text-[14px] leading-snug text-piedra">{f.note}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 7 · CÓMO FUNCIONA */}
      <section className="border-y border-tinta/15" aria-labelledby="proceso-titulo">
        <div className="container-l py-20 lg:py-24">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="proceso-titulo" className="text-[36px] sm:text-[44px]">
              Cómo trabajamos
            </h2>
            <Link to="/como-funciona" className="link-line">
              Detalle del proceso
            </Link>
          </div>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-tinta/30 pt-5">
                <p className="ficha">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-3 font-display text-[28px] leading-none">{s.title}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-piedra">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="ficha mt-12">Atención y entregas en Lima Metropolitana · Disponibilidad sujeta a temporada · Horarios por confirmar</p>
        </div>
      </section>

      {/* 8 · EMPRESAS Y FUNERARIAS */}
      <section className="bg-tinta text-papel" aria-labelledby="empresas-titulo">
        <div className="container-l grid-l items-center gap-y-10 py-20 lg:py-28">
          <div className="col-span-4 lg:col-span-5">
            <p className="ficha !text-papel/55">Empresas y funerarias</p>
            <h2 id="empresas-titulo" className="mt-5 text-[40px] !text-papel sm:text-[52px]">
              Condolencias en nombre de un equipo, con el mismo cuidado.
            </h2>
            <p className="mt-6 max-w-[42ch] text-[17px] leading-relaxed text-papel/70">
              Pedidos múltiples, un solo contacto, factura con RUC y piezas sobrias que no parecen de catálogo.
            </p>
            <Link to="/empresas" className="link-line mt-10 text-papel hover:!text-acantilado">
              Atención corporativa
            </Link>
          </div>
          <Reveal className="col-span-4 lg:col-span-5 lg:col-start-8">
            <Photo id="linhle" className="aspect-[4/5] w-full" />
          </Reveal>
        </div>
      </section>

      {/* 9 · CIERRE */}
      <section className="container-l py-28 text-center lg:py-40" aria-labelledby="cierre-titulo">
        <p className="eyebrow">{brand.name}</p>
        <h2 id="cierre-titulo" className="mx-auto mt-6 max-w-[16ch] text-[48px] sm:text-[64px] lg:text-[80px]">
          Cuéntanos de quién quieres acordarte.
        </h2>
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-5">
          <Link to="/crea-tu-homenaje" className="btn-primary">
            Crear un homenaje
          </Link>
          <Link to="/contacto" className="link-line self-center">
            Escribirnos
          </Link>
        </div>
      </section>
    </>
  )
}
