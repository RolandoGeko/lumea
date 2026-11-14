/**
 * CATÁLOGO DEMOSTRATIVO
 * ------------------------------------------------------------
 * 12 productos ficticios en 4 colecciones. Los nombres, descripciones y precios
 * son ilustrativos. Para añadir un producto, copia un objeto y cambia su `id`.
 *
 * Imágenes: fotografías de referencia de estilo (Unsplash) definidas en ./photos.ts.
 * Donde no hay una foto que cumpla el manual de dirección fotográfica se usa
 * `pendiente()`: un marcador editorial visible ("Fotografía en producción").
 * Reemplázalas por fotos propias antes del lanzamiento.
 */
import type { ContainerId, FormatId, OccasionId, PaletteId, SizeId } from './options'
import { photos } from './photos'
import type { PhotoKey } from './photos'

export type CollectionId = 'esencia' | 'vida' | 'legado' | 'unica'

export interface Collection {
  id: CollectionId
  name: string
  tagline: string
  description: string
}

export const collections: Collection[] = [
  {
    id: 'esencia',
    name: 'Esencia',
    tagline: 'Para quien era de pocas palabras y mucha presencia',
    description: 'Un solo gesto vertical y mucho espacio vacío. Crisantemo araña o de rama, lluvia, una rama. Vidrio o cerámica mate.',
  },
  {
    id: 'vida',
    name: 'Vida',
    tagline: 'Para quien llenaba la mesa y la sobremesa',
    description: 'Piezas bajas y abundantes, de mesa. Margaritas, astromelias y claveles mezclados en jarras de barro.',
  },
  {
    id: 'legado',
    name: 'Legado',
    tagline: 'Para quien dejó algo que sigue creciendo',
    description: 'Piezas que la familia conserva o planta: recipientes artesanales, aromáticas, flor seca y fresca.',
  },
  {
    id: 'unica',
    name: 'Única',
    tagline: 'Para una historia concreta que nos cuentas',
    description: 'Diseñada a partir de un relato: un lugar, un oficio, una costumbre. Las flores y la forma las pide la historia.',
  },
]

export type ProductImage =
  | { kind: 'illustration'; view: 'frontal' | 'detalle' | 'contexto'; alt: string }
  | { kind: 'photo'; src: string; alt: string; credit?: string; creditUrl?: string }
  | { kind: 'pendiente'; alt: string }

export interface Product {
  id: string
  /** Número de lámina, como en un catálogo: "01", "02"… */
  number: string
  name: string
  collection: CollectionId
  /** A quién retrata: la frase que abre la ficha */
  portrait: string
  /** Frase corta para la lámina */
  tagline: string
  description: string
  images: ProductImage[]
  format: FormatId
  occasions: OccasionId[]
  sizes: SizeId[]
  palettes: PaletteId[]
  containers: ContainerId[]
  flowers: string[]
  /** Precio referencial "desde" (tamaño más pequeño). null = solo por cotización. */
  basePrice: number | null
  /** Opciones de personalización disponibles para este diseño */
  customizations: string[]
}

/** Fotografías de referencia de estilo (ver src/data/photos.ts). */
const pics = (...keys: PhotoKey[]): ProductImage[] =>
  keys.map((k) => ({ kind: 'photo', src: photos[k].src, alt: photos[k].alt, credit: photos[k].author, creditUrl: photos[k].url }))

/** Marcador editorial: aún no hay una foto que represente bien esta pieza. */
const pendiente = (alt: string): ProductImage => ({ kind: 'pendiente', alt })

export const products: Product[] = [
  // ——— ESENCIA ———
  {
    id: 'es-01',
    number: '01',
    name: 'Trazo',
    collection: 'esencia',
    portrait: 'Para quien hablaba poco y, aun así, se hacía notar.',
    tagline: 'Un crisantemo araña y una rama, en vertical',
    description:
      'Un solo gesto: dos o tres crisantemos araña de tallo largo y una rama que acompaña, en una pieza de cerámica mate. Casi todo es aire, y por eso se ve desde lejos.',
    images: pics('crisantemo-arana', 'crisantemo-vidrio'),
    format: 'pie',
    occasions: ['velatorio', 'hogar'],
    sizes: ['mediano', 'amplio', 'monumental'],
    palettes: ['blanco-sereno', 'marfil-salvia', 'lavanda-bruma'],
    containers: ['ceramica', 'base-pie'],
    flowers: ['Crisantemo araña', 'Rama de olivo', 'Hoja de aspidistra'],
    basePrice: 290,
    customizations: ['Color del crisantemo', 'Tarjeta escrita a mano', 'Cinta con nombre'],
  },
  {
    id: 'es-02',
    number: '02',
    name: 'Bruma',
    collection: 'esencia',
    portrait: 'Para quien tenía paciencia para todo y para todos.',
    tagline: 'Lluvia suelta, como la garúa de invierno',
    description:
      'Lluvia (gypsophila) trabajada en volumen suelto, con un poco de eucalipto. Una nube baja y liviana para la mesa de la familia. Una flor humilde que, junta, se vuelve otra cosa.',
    images: pics('lluvia-rama', 'lluvia-vaso'),
    format: 'mesa',
    occasions: ['hogar', 'memoria'],
    sizes: ['intimo', 'mediano'],
    palettes: ['blanco-sereno', 'marfil-salvia'],
    containers: ['vidrio', 'ceramica', 'sin-recipiente'],
    flowers: ['Lluvia (gypsophila)', 'Eucalipto', 'Clavel blanco'],
    basePrice: 160,
    customizations: ['Tarjeta escrita a mano', 'Recipiente a elección'],
  },
  {
    id: 'es-03',
    number: '03',
    name: 'Línea',
    collection: 'esencia',
    portrait: 'Para quien tenía un orden propio y un gusto exacto.',
    tagline: 'Crisantemo blanco de rama, en un solo tono',
    description:
      'Crisantemo blanco de rama, sin mezcla, con un poco de eucalipto en vidrio alto. La gracia está en la proporción y en la altura de cada tallo, no en la cantidad.',
    images: pics('bahati', 'linhle'),
    format: 'escultorico',
    occasions: ['velatorio', 'corporativo'],
    sizes: ['mediano', 'amplio'],
    palettes: ['blanco-sereno', 'marfil-salvia'],
    containers: ['vidrio', 'ceramica', 'base-pie'],
    flowers: ['Crisantemo de rama', 'Eucalipto'],
    basePrice: 240,
    customizations: ['Tono del crisantemo', 'Cinta con nombre', 'Tarjeta escrita a mano'],
  },

  // ——— VIDA ———
  {
    id: 'vi-01',
    number: '04',
    name: 'Sobremesa',
    collection: 'vida',
    portrait: 'Para quien juntaba a la familia los domingos.',
    tagline: 'Margaritas y astromelias, sueltas como en el campo',
    description:
      'Margaritas pequeñas, manzanilla y astromelias en una jarra de barro, armadas sin rigidez, como si alguien las hubiera traído del jardín. Para poner al centro de la mesa.',
    images: pics('margaritas-mesa', 'amarillos-pedestal'),
    format: 'mesa',
    occasions: ['hogar', 'memoria'],
    sizes: ['intimo', 'mediano', 'amplio'],
    palettes: ['jardin-vivo', 'marfil-salvia', 'oro-otono'],
    containers: ['ceramica', 'canasta', 'sin-recipiente'],
    flowers: ['Margaritas', 'Manzanilla', 'Astromelias'],
    basePrice: 170,
    customizations: ['Flor favorita como protagonista', 'Tarjeta escrita a mano'],
  },
  {
    id: 'vi-02',
    number: '05',
    name: 'Bolero',
    collection: 'vida',
    portrait: 'Para quien cantaba boleros mientras cocinaba.',
    tagline: 'Claveles coral y vino, con follaje oscuro',
    description:
      'Claveles en tonos coral, vino y fucsia, con follaje oscuro. Una pieza con temperamento, de colores que no piden permiso.',
    images: pics('claveles-ventana', 'clavel-sombra'),
    format: 'pie',
    occasions: ['velatorio', 'memoria'],
    sizes: ['mediano', 'amplio', 'monumental'],
    palettes: ['atardecer', 'terracota-calida', 'jardin-vivo'],
    containers: ['base-pie', 'ceramica'],
    flowers: ['Claveles coral', 'Clavel fucsia', 'Follaje oscuro'],
    basePrice: 260,
    customizations: ['Colores favoritos', 'Cinta con nombre', 'Tarjeta escrita a mano'],
  },
  {
    id: 'vi-03',
    number: '06',
    name: 'Mediodía',
    collection: 'vida',
    portrait: 'Para quien saludaba a todo el barrio por su nombre.',
    tagline: 'Crisantemos pompón amarillos en cerámica azul',
    description:
      'Crisantemos pompón amarillos, apretados y redondos, en una cerámica esmaltada. Luz de mediodía en una flor que casi todos conocen y casi nadie mira dos veces.',
    images: pics('crisantemos-amarillos', 'dalias-ceramica'),
    format: 'recipiente',
    occasions: ['hogar', 'corporativo'],
    sizes: ['intimo', 'mediano'],
    palettes: ['oro-otono', 'jardin-vivo'],
    containers: ['ceramica', 'canasta'],
    flowers: ['Crisantemos pompón', 'Margaritas', 'Astromelias'],
    basePrice: 190,
    customizations: ['Tarjeta escrita a mano', 'Recipiente a elección', 'Mensaje corporativo'],
  },

  // ——— LEGADO ———
  {
    id: 'le-01',
    number: '07',
    name: 'Raíz',
    collection: 'legado',
    portrait: 'Para quien dejó una casa llena de cosas hechas a mano.',
    tagline: 'Flor seca y espigas en cerámica que se queda',
    description:
      'Flor seca de estación, espigas y eucalipto en una pieza de cerámica artesanal. No se marchita en una semana: se queda en casa, y la cerámica también.',
    images: pics('seca-sombra', 'espigas-ceramica'),
    format: 'recipiente',
    occasions: ['hogar', 'memoria'],
    sizes: ['intimo', 'mediano'],
    palettes: ['terracota-calida', 'oro-otono', 'marfil-salvia'],
    containers: ['ceramica'],
    flowers: ['Flor seca de estación', 'Espigas', 'Eucalipto'],
    basePrice: 230,
    customizations: ['Tarjeta escrita a mano', 'Grabado en la base (a validar)'],
  },
  {
    id: 'le-02',
    number: '08',
    name: 'Semilla',
    collection: 'legado',
    portrait: 'Para quien cuidaba sus plantas como a personas.',
    tagline: 'Flor de corte y una aromática que sigue viva',
    description:
      'Flores de corte junto a una planta aromática (romero o hierbabuena) en maceta de barro. Cuando las flores terminan, la planta sigue.',
    images: [pendiente('Pieza Semilla: flores de corte y planta aromática en maceta de barro'), ...pics('seca-florero')],
    format: 'recipiente',
    occasions: ['hogar', 'memoria', 'corporativo'],
    sizes: ['intimo', 'mediano'],
    palettes: ['marfil-salvia', 'jardin-vivo'],
    containers: ['ceramica', 'madera'],
    flowers: ['Margaritas', 'Romero', 'Planta aromática en maceta'],
    basePrice: 210,
    customizations: ['Tarjeta escrita a mano', 'Tipo de planta (a validar)'],
  },
  {
    id: 'le-03',
    number: '09',
    name: 'Herencia',
    collection: 'legado',
    portrait: 'Para quien dejó una receta, un oficio o una costumbre.',
    tagline: 'En la ceremonia y después en casa',
    description:
      'Una pieza de dos tiempos: luce de pie durante la ceremonia y luego se desarma en dos arreglos de mesa en jarras de barro, uno para cada rama de la familia.',
    images: [pendiente('Pieza Herencia: composición que se divide en dos jarras de barro')],
    format: 'pie',
    occasions: ['velatorio', 'hogar'],
    sizes: ['mediano', 'amplio'],
    palettes: ['marfil-salvia', 'terracota-calida', 'atardecer'],
    containers: ['ceramica', 'vidrio'],
    flowers: ['Astromelias', 'Lluvia (gypsophila)', 'Follaje de estación'],
    basePrice: 380,
    customizations: ['Cinta con nombre', 'Tarjeta escrita a mano', 'Número de jarras'],
  },

  // ——— ÚNICA ———
  {
    id: 'un-01',
    number: '10',
    name: 'Mar adentro',
    collection: 'unica',
    portrait: 'Para quien vivía frente al mar.',
    tagline: 'Azul gris y blanco, con hierbas de costa',
    description:
      'Campánulas, claveles blancos y limonium en una cerámica gris, con hierbas que recuerdan los acantilados. Un ejemplo de pieza diseñada a partir de un lugar.',
    images: pics('campanulas-ventana', 'claveles-azul'),
    format: 'escultorico',
    occasions: ['velatorio', 'hogar'],
    sizes: ['mediano', 'amplio', 'monumental'],
    palettes: ['mar-pacifico', 'blanco-sereno'],
    containers: ['ceramica', 'madera', 'base-pie'],
    flowers: ['Campánulas', 'Claveles blancos', 'Limonium', 'Hierbas de costa'],
    basePrice: 320,
    customizations: ['Elementos naturales (a validar)', 'Cinta con nombre', 'Tarjeta escrita a mano'],
  },
  {
    id: 'un-02',
    number: '11',
    name: 'Su jardín',
    collection: 'unica',
    portrait: 'Para quien tenía un jardín, aunque fuera una maceta.',
    tagline: 'Las flores que cultivaba, reunidas',
    description:
      'Creamos la pieza a partir de lo que crecía en su casa o de lo que le gustaba regalar. Cuéntanos qué flores eran y buscamos las de temporada que más se parezcan.',
    images: [...pics('astromelia-blanca'), pendiente('Pieza Su jardín: se diseña a partir de las flores de cada historia')],
    format: 'mesa',
    occasions: ['hogar', 'memoria', 'velatorio'],
    sizes: ['intimo', 'mediano', 'amplio'],
    palettes: ['jardin-vivo', 'marfil-salvia', 'atardecer', 'oro-otono'],
    containers: ['canasta', 'ceramica', 'sin-recipiente'],
    flowers: ['Según su historia'],
    basePrice: null,
    customizations: ['Flores favoritas', 'Colores favoritos', 'Tarjeta escrita a mano'],
  },
  {
    id: 'un-03',
    number: '12',
    name: 'Obra',
    collection: 'unica',
    portrait: 'Para quien hacía cosas con las manos: artistas, maestros, artesanos.',
    tagline: 'Una pieza de gran formato, conversada',
    description:
      'Pieza de gran formato diseñada junto a la familia o la institución, a partir de una conversación. Se cotiza según la idea.',
    images: [pendiente('Pieza Obra: gran formato, diseñada en conversación con la familia')],
    format: 'escultorico',
    occasions: ['velatorio', 'corporativo'],
    sizes: ['amplio', 'monumental'],
    palettes: ['terracota-calida', 'lavanda-bruma', 'oro-otono', 'jardin-vivo'],
    containers: ['base-pie', 'madera'],
    flowers: ['Según la conversación'],
    basePrice: null,
    customizations: ['Diseño conversado', 'Cinta con nombre', 'Mensaje institucional'],
  },
]

export const getProduct = (id: string | undefined | null) => products.find((p) => p.id === id)
export const getCollection = (id: string | undefined | null) => collections.find((c) => c.id === id)
