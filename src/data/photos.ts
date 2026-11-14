/**
 * FOTOGRAFÍAS DE REFERENCIA
 * ------------------------------------------------------------
 * Fotos de Unsplash bajo la Licencia Unsplash (uso gratuito, comercial incluido;
 * la atribución no es obligatoria pero la incluimos por respeto a los autores).
 * https://unsplash.com/license
 *
 * Criterio de selección (manual de dirección fotográfica):
 *  · luz natural y suave, fondos neutros con textura
 *  · flores sencillas (clavel, crisantemo, margarita, astromelia, lluvia)
 *  · recipientes de cerámica, vidrio o piedra · nada funerario
 *
 * IMPORTANTE: son referencias de estilo, NO arreglos elaborados por la marca.
 * Reemplázalas por fotografías propias antes del lanzamiento comercial.
 * Archivos optimizados en /public/fotos (WebP, máx. 1600 px).
 */

export interface Photo {
  src: string
  alt: string
  author: string
  url: string
}

const u = (slug: string) => `https://unsplash.com/photos/${slug}`

export const photos = {
  'crisantemo-arana': { src: '/fotos/crisantemo-arana.webp', alt: 'Dos crisantemos araña, uno blanco y uno rosado, en un pequeño florero de cerámica sobre una repisa', author: 'Klaus G', url: u('spider-chrysanthemums-in-ceramic-vase-5ZTGUs5zS64') },
  'clavel-sombra': { src: '/fotos/clavel-sombra.webp', alt: 'Un clavel fucsia en un vaso de vidrio, con su sombra sobre un muro gris', author: 'Ritz', url: u('a-single-pink-flower-in-a-glass-vase-JjLnSjfUP8c') },
  'margaritas-mesa': { src: '/fotos/margaritas-mesa.webp', alt: 'Ramo suelto de margaritas pequeñas sobre una mesa de madera con luz de ventana', author: 'Sixteen Miles Out', url: u('a-bouquet-of-small-white-daisies-on-a-wooden-background-3IaMqM_lxj4') },
  'dalias-ceramica': { src: '/fotos/dalias-ceramica.webp', alt: 'Dalias granate y margaritas en un florero de cerámica gris sobre fondo durazno', author: 'Earl Wilcox', url: u('pink-and-yellow-flowers-in-blue-ceramic-vase-b9_KBLT64SI') },
  'amarillos-pedestal': { src: '/fotos/amarillos-pedestal.webp', alt: 'Flores amarillas y blancas en un florero de cerámica blanca sobre un pedestal', author: 'Marina Podrez', url: u('a-white-vase-with-yellow-and-white-flowers-in-it-uGU9UblmvUM') },
  'seca-florero': { src: '/fotos/seca-florero.webp', alt: 'Flores secas y eucalipto en un florero blanco alto', author: 'Peter Amende', url: u('a-vase-filled-with-lots-of-flowers-on-top-of-a-table-DdTp2FvLTzE') },
  'lluvia-rama': { src: '/fotos/lluvia-rama.webp', alt: 'Lluvia (gypsophila) y follaje en un pequeño florero, con tela de lino al fondo', author: 'Anita Rocheva', url: u('delicate-white-flowers-in-a-small-vase-with-greenery-lIAXKHikG1I') },
  'lluvia-vaso': { src: '/fotos/lluvia-vaso.webp', alt: 'Una rama de lluvia en una botella de vidrio sobre una mesa blanca, con sombras de ventana', author: 'chang min', url: u('clear-glass-vase-caLZjNiAHrU') },
  'astromelia-blanca': { src: '/fotos/astromelia-blanca.webp', alt: 'Tallo de astromelia blanca sobre fondo rosa pálido', author: 'Natalie Kinnear', url: u('a-white-flower-with-green-leaves-in-a-vase--EFoMgX3N-Y') },
  'crisantemo-vidrio': { src: '/fotos/crisantemo-vidrio.webp', alt: 'Un crisantemo blanco en un vaso de vidrio, fondo claro', author: 'Maria Lupan', url: u('white-chrysanthemum-in-a-clear-glass-vase-Q5-9b8ABL9k') },
  'claveles-azul': { src: '/fotos/claveles-azul.webp', alt: 'Claveles blancos en un florero de cerámica azul sobre lino', author: 'Natalie Kinnear', url: u('a-blue-vase-filled-with-white-flowers-on-top-of-a-bed-8meK0SfPZYw') },
  'campanulas-ventana': { src: '/fotos/campanulas-ventana.webp', alt: 'Campánulas azules en un florero de cerámica gris junto a una ventana', author: 'Samuel Bryngelsson', url: u('purple-and-white-flower-in-white-vase-JPbq6Y_HOUw') },
  'crisantemos-amarillos': { src: '/fotos/crisantemos-amarillos.webp', alt: 'Crisantemos amarillos en un florero de cerámica azul esmaltada', author: 'Vijayalakshmi Nidugondi', url: u('a-bouquet-of-bright-yellow-chrysanthemums-in-a-blue-vase-uLeNVWTwzYY') },
  'espigas-ceramica': { src: '/fotos/espigas-ceramica.webp', alt: 'Espigas secas en un florero de cerámica blanca con relieve, sobre lino', author: 'Serafima Lazarenko', url: u('brown-flowers-in-white-ceramic-vase-BXt9w83lKKU') },
  'seca-sombra': { src: '/fotos/seca-sombra.webp', alt: 'Flores secas en un jarrón de barro con sombras largas de luz de tarde', author: 'Anton Sukhinov', url: u('brown-ceramic-vase-on-white-and-black-table-cloth-4GvsTa3Y-5I') },
  'claveles-ventana': { src: '/fotos/claveles-ventana.webp', alt: 'Claveles rojo coral junto a una ventana', author: 'Roman Hnydin', url: u('a-vase-filled-with-pink-flowers-sitting-on-top-of-a-window-sill-R2z64EtTKGI') },
  bahati: { src: '/fotos/bahati.webp', alt: 'Crisantemo blanco de rama en un florero alto de vidrio, con sombras de persiana', author: 'Imani Bahati', url: u('white-petaled-flower-centerpiece-ZhoSk8W4lt8') },
  linhle: { src: '/fotos/linhle.webp', alt: 'Rama de eucalipto en un florero blanco de cerámica', author: 'Linh Le', url: u('a0rE64YJDA4') },
} satisfies Record<string, Photo>

export type PhotoKey = keyof typeof photos

export const allPhotos: Photo[] = Object.values(photos)
