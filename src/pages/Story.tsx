import { Link } from 'react-router-dom'
import { brand } from '../config/brand'
import { differentiators, manifesto, philosophy } from '../content/story'
import Photo from '../components/ui/Photo'

export default function Story() {
  return (
    <>
      <section className="container-l pb-20 pt-12 lg:pt-20">
        <div className="grid-l items-end gap-y-10">
          <div className="col-span-4 lg:col-span-7">
            <p className="ficha">Estudio · Lima</p>
            <h1 className="mt-5 text-[52px] sm:text-[72px] lg:text-[88px]">
              Un estudio pequeño <em className="text-terracota">de flores sencillas.</em>
            </h1>
            <p className="mt-8 max-w-lg text-[17px] text-piedra">
              {brand.name} diseña homenajes florales en Lima. Trabajamos con flores de mercado y recipientes que se quedan en casa, y cada
              pieza parte de lo que la familia nos cuenta de alguien.
            </p>
          </div>
          <Photo id="espigas-ceramica" eager className="col-span-4 aspect-[4/5] lg:col-span-4 lg:col-start-9" />
        </div>
      </section>

      <section className="bg-tinta py-24 text-papel" aria-labelledby="manifiesto">
        <div className="container-l grid-l gap-y-10">
          <div className="col-span-4 lg:col-span-3">
            <p className="ficha !text-arena">Lo que pensamos</p>
            <h2 id="manifiesto" className="sr-only">Lo que pensamos</h2>
          </div>
          <ol className="col-span-4 lg:col-span-8 lg:col-start-5">
            {manifesto.map((m, i) => (
              <li key={m} className="grid grid-cols-[48px_1fr] gap-4 border-t border-papel/15 py-5">
                <span className="ficha !text-arena pt-3">0{i + 1}</span>
                <span className="font-display text-[30px] leading-tight !text-papel sm:text-[40px]">{m}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-l py-24" aria-labelledby="filosofia">
        <div className="grid-l gap-y-12">
          <div className="col-span-4 lg:col-span-4">
            <p className="ficha">Cómo trabajamos</p>
            <h2 id="filosofia" className="mt-3 text-[40px] sm:text-[52px]">Tres decisiones que repetimos en cada pieza</h2>
            <Photo id="seca-sombra" className="mt-10 hidden aspect-[4/5] lg:block" />
          </div>
          <div className="col-span-4 lg:col-span-6 lg:col-start-7">
            {philosophy.map((p, i) => (
              <article key={p.title} className="border-t border-tinta/20 py-8">
                <p className="ficha">0{i + 1}</p>
                <h3 className="mt-3 text-[34px]">{p.title}</h3>
                <p className="mt-3 max-w-md text-piedra">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-arena py-24" aria-labelledby="diferencial">
        <div className="container-l">
          <p className="ficha">En corto</p>
          <h2 id="diferencial" className="mt-3 max-w-2xl text-[40px] sm:text-[52px]">Lo que no vas a encontrar en otro lado</h2>
          <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((d) => (
              <li key={d.title} className="border-t border-tinta/30 pt-5">
                <h3 className="text-[26px] leading-tight">{d.title}</h3>
                <p className="mt-3 text-[15px] text-piedra">{d.text}</p>
              </li>
            ))}
          </ul>
          <Link to="/crea-tu-homenaje" className="btn-primary mt-14">Empezar una pieza</Link>
        </div>
      </section>
    </>
  )
}
