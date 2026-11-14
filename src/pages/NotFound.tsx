import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-l pb-28 pt-16 lg:pt-24">
      <p className="ficha">Error 404</p>
      <h1 className="mt-5 max-w-3xl text-[52px] sm:text-[72px]">Esta página <em className="text-terracota">no existe.</em></h1>
      <p className="mt-6 max-w-md text-piedra">Puede que el enlace haya cambiado. Vuelve al inicio o mira las piezas.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/" className="btn-primary">
          Ir al inicio
        </Link>
        <Link to="/colecciones" className="btn-ghost">
          Ver las piezas
        </Link>
      </div>
    </div>
  )
}
