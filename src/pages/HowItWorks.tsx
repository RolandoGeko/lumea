import { Link } from 'react-router-dom'
import { commerce } from '../config/commerce'
import { howItWorksSteps } from '../content/howItWorks'
import Faq from '../components/ui/Faq'
import Notice from '../components/ui/Notice'
import Photo from '../components/ui/Photo'

const links: Record<number, [string, string]> = {
  0: ['/crea-tu-homenaje', 'Abrir el taller'],
  1: ['/colecciones', 'Ver las piezas'],
}

export default function HowItWorks() {
  return (
    <div className="container-l pb-28 pt-12 lg:pt-20">
      <header className="grid-l items-end gap-y-6">
        <div className="col-span-4 lg:col-span-7">
          <p className="ficha">Cómo funciona</p>
          <h1 className="mt-5 text-[52px] sm:text-[72px] lg:text-[88px]">
            Cinco pasos, <em className="text-terracota">una persona al otro lado.</em>
          </h1>
        </div>
        <p className="col-span-4 max-w-sm text-[15px] text-piedra lg:col-span-4 lg:col-start-9">
          Estos encargos llegan sin aviso. Por eso el camino es corto, y nada se elabora sin que lo confirmes.
        </p>
      </header>

      <div className="grid-l mt-16 gap-y-12">
        <ol className="col-span-4 border-t border-tinta/20 lg:col-span-7">
          {howItWorksSteps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[56px_1fr] gap-4 border-b border-tinta/15 py-7 sm:grid-cols-[88px_1fr]">
              <span className="font-display text-[44px] leading-none text-terracota">0{i + 1}</span>
              <div>
                <h2 className="text-[30px] sm:text-[34px]">{s.title}</h2>
                <p className="mt-2 max-w-lg text-piedra">{s.text}</p>
                {links[i] && (
                  <Link to={links[i][0]} className="link-line mt-4">
                    {links[i][1]}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
        <aside className="col-span-4 lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-28">
            <Photo id="lluvia-vaso" className="aspect-[4/5]" />
            <div className="mt-6 space-y-3">
              <Notice>{commerce.availabilityDisclaimer}</Notice>
              <Notice>{commerce.deliveryDisclaimer}</Notice>
            </div>
          </div>
        </aside>
      </div>

      <section className="grid-l mt-28 gap-y-8" aria-labelledby="faq-titulo">
        <div className="col-span-4 lg:col-span-3">
          <p className="ficha">Preguntas</p>
          <h2 id="faq-titulo" className="mt-3 text-[40px] sm:text-[52px]">Lo que suelen preguntarnos</h2>
        </div>
        <div className="col-span-4 lg:col-span-8 lg:col-start-5">
          <Faq />
        </div>
      </section>
    </div>
  )
}
