import { BrowserRouter, HashRouter, Route, Routes, useSearchParams } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { CartProvider } from './context/CartContext'
import Business from './pages/Business'
import Cart from './pages/Cart'
import Collections from './pages/Collections'
import Contact from './pages/Contact'
import Credits from './pages/Credits'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import NotFound from './pages/NotFound'
import ProductDetail from './pages/ProductDetail'
import Story from './pages/Story'
import Configurator from './pages/configurator/Configurator'

/** Reinicia el configurador cuando se pasa de "editar un ítem" a "crear uno nuevo" */
function ConfiguratorRoute() {
  const [params] = useSearchParams()
  return <Configurator key={params.get('editar') ?? 'nuevo'} />
}

/** Con VITE_HASH_ROUTER=1 las rutas van tras '#', para hosting estático sin configuración (vista previa, GitHub Pages). */
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="colecciones" element={<Collections />} />
            <Route path="colecciones/:id" element={<ProductDetail />} />
            <Route path="crea-tu-homenaje" element={<ConfiguratorRoute />} />
            <Route path="carrito" element={<Cart />} />
            <Route path="empresas" element={<Business />} />
            <Route path="nuestra-historia" element={<Story />} />
            <Route path="como-funciona" element={<HowItWorks />} />
            <Route path="contacto" element={<Contact />} />
            <Route path="creditos" element={<Credits />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  )
}
