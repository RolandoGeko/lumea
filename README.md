# Flor y Punto · MVP web de homenajes florales

Prototipo funcional para validar la propuesta comercial de **Flor y Punto**: homenajes florales contemporáneos y personalizados para Lima Metropolitana.

> **Es una demostración.** Los precios son referenciales. No hay pagos, reservas, pedidos ni entregas reales, y nada se envía a un servidor.

## Cómo ejecutarlo en tu computadora

Necesitas **Node.js 20 o superior** (https://nodejs.org).

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:5173
```

Otros comandos:

```bash
npm run build    # genera la versión optimizada en /dist
npm run preview  # sirve la versión de /dist en local
```

## Qué editar sin tocar componentes

| Quiero cambiar… | Archivo |
|---|---|
| Nombre, lema, logo, WhatsApp, correo, redes, aviso de demo | `src/config/brand.ts` |
| Colores y tipografías | `src/index.css` |
| Moneda, avisos de precio/disponibilidad/entrega, mostrar u ocultar precios | `src/config/commerce.ts` |
| Colecciones y los 12 productos (textos, precios, tamaños, paletas, flores, imágenes) | `src/data/catalog.ts` |
| Paletas, tamaños y multiplicadores, recipientes, presupuestos, inspiraciones, distritos y flores | `src/data/options.ts` |
| Preguntas frecuentes, manifiesto, pasos de "Cómo funciona" y contenido B2B | `src/content/*.ts` |
| Reglas de recomendación del configurador | `src/lib/recommendations.ts` |
| Formato del mensaje de WhatsApp | `src/lib/whatsapp.ts` |

**WhatsApp:** escribe el número en `brand.whatsappNumber` en formato internacional sin `+` (por ejemplo `51987654321`). Si queda vacío, la web no abre WhatsApp y ofrece **copiar el mensaje**.

**Sistema visual (paleta Costa):** colores y tipografías viven en `src/index.css` (bloque `@theme`). Títulos en EB Garamond y texto y fichas en Figtree (Google Fonts, gratuitas). La dirección creativa completa (concepto, sistema de diseño, manual de fotografía) está en el documento "Dirección creativa" (redactado cuando la marca se llamaba LÚMEA).

**Fotos pendientes:** donde no hay una foto que cumpla el manual, el catálogo usa `pendiente('…')` en `src/data/catalog.ts`, que muestra un marcador "Fotografía en producción". Al tener la foto propia, reemplázalo por la imagen.

**Logo:** coloca tu archivo en `/public` (por ejemplo `/public/logo.svg`) y escribe `logoSrc: '/logo.svg'`.

**Fotografías:** la web usa 18 fotos de referencia de [Unsplash](https://unsplash.com/license) (licencia gratuita, uso comercial permitido), optimizadas en `/public/fotos` (WebP). Los autores y enlaces están en `src/data/photos.ts` y en la página `/creditos`. Son **referencias de estilo, no arreglos de la marca**, y así se indica en la web. Antes de lanzar, reemplázalas por fotos propias: guarda el archivo en `/public/fotos` y actualiza `photos.ts` o las imágenes del producto en `catalog.ts`. Algunos nombres de autor se tomaron de los listados de Unsplash; conviene verificarlos en cada enlace.

Si un producto no tiene foto, la web muestra una ilustración botánica SVG de respaldo (`FloralArt`).

## Páginas

| Ruta | Página |
|---|---|
| `/` | Inicio |
| `/colecciones` | Catálogo con filtros por colección, ocasión, paleta, formato y presupuesto (los filtros quedan en la URL) |
| `/colecciones/:id` | Detalle del producto |
| `/crea-tu-homenaje` | "Taller" en 4 momentos (Quién era · Su paleta · La forma · Las palabras) + revisión, con la pieza en vivo al costado |
| `/carrito` | Mi selección y solicitud de cotización |
| `/empresas` | Empresas y funerarias, con formulario corporativo |
| `/nuestra-historia` | Manifiesto, filosofía y propuesta diferencial |
| `/como-funciona` | Proceso en 5 pasos y preguntas frecuentes |
| `/contacto` | Formulario demo, WhatsApp configurable y preguntas frecuentes |
| `/creditos` | Créditos de las fotografías |

## Estructura de carpetas

```
src/
  config/        brand.ts (marca), commerce.ts (comercial)
  data/          catalog.ts (colecciones y productos), options.ts (opciones compartidas)
  content/       textos: faq, story, howItWorks, b2b
  lib/           precios, recomendaciones, WhatsApp, validación, localStorage, tipos
  context/       CartContext (carrito persistente)
  components/
    layout/      Header, Footer, Layout, Logo
    product/     FloralArt (ilustración SVG), ProductVisual, ProductCard
    quote/       QuotePanel (solicitud y WhatsApp), Modal
    ui/          SectionHeading, Field, Faq, Notice
  pages/         Home, Collections, ProductDetail, Cart, Business, Story, HowItWorks, Contact, NotFound
    configurator/ Configurator, steps (pasos y validaciones), Summary
```

## Privacidad (modo demo)

- El carrito y el borrador del configurador se guardan solo en el `localStorage` del navegador.
- Los formularios validan los datos y muestran un resumen. No envían ni almacenan nada en servidores.
- La descripción de la persona homenajeada **no se incluye** en el mensaje, salvo que el usuario lo marque. Además, debe confirmar que revisó el mensaje antes de copiarlo o abrir WhatsApp.

## Publicación futura

`npm run build` genera archivos estáticos en `/dist`, que se pueden subir a cualquier hosting estático. Como usa rutas limpias (`/colecciones`), el hosting debe redirigir todas las rutas a `index.html` (*SPA fallback*).

Consulta `PENDIENTES.md` para ver lo que falta antes del lanzamiento comercial.

## Publicación (GitHub Pages)

Cada cambio en `main` se publica solo en https://rolandogeko.github.io/lumea/ mediante `.github/workflows/pages.yml`.
Requisito único: en GitHub, Settings → Pages → Source: **GitHub Actions**.
