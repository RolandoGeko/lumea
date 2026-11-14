import { Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { commerce } from '../../config/commerce'
import Logo from './Logo'
import { navItems } from './Header'

const year = new Date().getFullYear()

/** Pie como colofón de catálogo: quiénes somos, índice, notas y créditos. */
export default function Footer() {
  const socials = Object.entries(brand.social).filter(([, url]) => url)
  return (
    <footer className="bg-tinta text-papel">
      <div className="container-l grid-l gap-y-12 py-20">
        <div className="col-span-4 space-y-5 lg:col-span-5">
          <Logo className="!text-papel" />
          <p className="max-w-sm font-display text-[28px] leading-tight text-papel/85">{brand.tagline}.</p>
          <p className="ficha !text-papel/50">Estudio de homenajes florales · {brand.city}</p>
        </div>
        <nav aria-label="Pie de página" className="col-span-2 lg:col-span-3">
          <p className="ficha mb-5 !text-papel/50">Índice</p>
          <ul className="space-y-2 text-[15px]">
            {navItems.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-papel/80 transition-colors hover:text-papel">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/carrito" className="text-papel/80 transition-colors hover:text-papel">
                Mi selección
              </Link>
            </li>
          </ul>
        </nav>
        <div className="col-span-4 space-y-4 text-[14px] leading-relaxed text-papel/65 sm:col-span-2 lg:col-span-4">
          <p className="ficha mb-5 !text-papel/50">Notas</p>
          {brand.contactEmail && <p>{brand.contactEmail}</p>}
          {socials.length > 0 && (
            <p className="flex gap-4">
              {socials.map(([name, url]) => (
                <a key={name} href={url} target="_blank" rel="noreferrer" className="capitalize hover:text-papel">
                  {name}
                </a>
              ))}
            </p>
          )}
          <p>{commerce.priceDisclaimer}</p>
          <p>
            Las fotografías son referencias de estilo de Unsplash; no son piezas elaboradas por {brand.name}. Donde aún no hay una foto adecuada, lo indicamos.{' '}
            <Link to="/creditos" className="text-papel underline underline-offset-4">
              Créditos
            </Link>
          </p>
        </div>
      </div>
      <div className="border-t border-papel/10">
        <div className="container-l flex flex-wrap justify-between gap-2 py-6 font-mono text-[10px] uppercase tracking-[0.08em] text-papel/45">
          <span>© {year} {brand.name}</span>
          <span>Prototipo de validación comercial · Sin transacciones reales</span>
        </div>
      </div>
    </footer>
  )
}
