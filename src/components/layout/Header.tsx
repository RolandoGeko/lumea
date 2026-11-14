import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { brand } from '../../config/brand'
import { useCart } from '../../context/CartContext'
import Logo from './Logo'

export const navItems = [
  { to: '/colecciones', label: 'Piezas' },
  { to: '/crea-tu-homenaje', label: 'Crea tu homenaje' },
  { to: '/empresas', label: 'Empresas y funerarias' },
  { to: '/como-funciona', label: 'Cómo funciona' },
  { to: '/nuestra-historia', label: 'Estudio' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <>
      {brand.demoMode && (
        <div className="border-b border-tinta/10 bg-arena px-4 py-2 text-center font-mono text-[10px] uppercase tracking-[0.08em] text-piedra sm:text-[11px]" role="note">
          {brand.demoNotice}
        </div>
      )}
      <header className="sticky top-0 z-40 border-b border-tinta/10 bg-marfil/90 backdrop-blur-md">
        <div className="container-l flex h-16 items-center justify-between gap-6 lg:h-20">
          <Link to="/" aria-label={`${brand.name}, ir al inicio`} className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-7 whitespace-nowrap text-[14px] xl:gap-9">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `border-b pb-0.5 transition-colors ${isActive ? 'border-tinta text-tinta' : 'border-transparent text-tinta/70 hover:text-tinta'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <Link
              to="/carrito"
              className="inline-flex h-11 items-center gap-2 px-2 font-mono text-[11px] uppercase tracking-[0.08em] text-tinta hover:text-terracota-oscura"
              aria-label={`Ver mi selección, ${count} ${count === 1 ? 'homenaje' : 'homenajes'}`}
            >
              <span className="hidden sm:inline">Selección</span>
              <span className="tabular-nums">({count})</span>
            </Link>
            <button
              type="button"
              className="inline-flex h-11 items-center px-2 font-mono text-[11px] uppercase tracking-[0.08em] text-tinta lg:hidden"
              aria-expanded={open}
              aria-controls="menu-movil"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? 'Cerrar' : 'Menú'}
            </button>
          </div>
        </div>

        {open && (
          <nav id="menu-movil" aria-label="Menú móvil" className="border-t border-tinta/10 bg-marfil lg:hidden">
            <ol className="container-l flex flex-col py-6">
              {[{ to: '/', label: 'Inicio' }, ...navItems].map((item, i) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-baseline gap-4 border-b border-tinta/10 py-3.5 ${isActive ? 'text-terracota-oscura' : 'text-tinta'}`
                    }
                  >
                    <span className="ficha w-6">{String(i).padStart(2, '0')}</span>
                    <span className="font-display text-[32px] leading-none">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </header>
    </>
  )
}
