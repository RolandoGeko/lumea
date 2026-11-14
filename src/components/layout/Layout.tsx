import { jumpTo } from '../../lib/jump'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" onClick={jumpTo('contenido')} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-tinta focus:px-4 focus:py-2 focus:text-marfil">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
