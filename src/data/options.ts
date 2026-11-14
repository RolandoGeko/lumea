/**
 * OPCIONES COMPARTIDAS DEL CATÁLOGO Y DEL CONFIGURADOR
 * Paletas, tamaños, presentaciones, presupuestos, inspiraciones, distritos y flores.
 * Editar aquí actualiza filtros, fichas de producto y configurador a la vez.
 */

export type PaletteId =
  | 'marfil-salvia'
  | 'blanco-sereno'
  | 'terracota-calida'
  | 'mar-pacifico'
  | 'jardin-vivo'
  | 'atardecer'
  | 'lavanda-bruma'
  | 'oro-otono'

export interface Palette {
  id: PaletteId
  name: string
  description: string
  /** [fondo de flor principal, secundaria, acento, follaje] */
  colors: [string, string, string, string]
}

export const palettes: Palette[] = [
  { id: 'marfil-salvia', name: 'Marfil y salvia', description: 'Blancos cálidos con follaje plateado. Calma y luz.', colors: ['#F4EEE2', '#E3D9C6', '#C9B99A', '#8A9A7B'] },
  { id: 'blanco-sereno', name: 'Blanco sereno', description: 'Tonos puros y verdes suaves. Silencio y paz.', colors: ['#FFFFFF', '#EEF0EA', '#D9DED2', '#7F9171'] },
  { id: 'terracota-calida', name: 'Terracota cálida', description: 'Arcilla, durazno y arena. Calidez y abrazo.', colors: ['#D99A7C', '#EBC3A8', '#B5654A', '#7D8C6E'] },
  { id: 'mar-pacifico', name: 'Mar Pacífico', description: 'Azules grisáceos, blancos y verdes marinos.', colors: ['#B9CBD3', '#E8EEF0', '#6F8FA0', '#7E9A8A'] },
  { id: 'jardin-vivo', name: 'Jardín vivo', description: 'Amarillos, corales y fucsias suaves. Celebración de una vida.', colors: ['#F2C14E', '#EE8E6B', '#D6698B', '#6E8B57'] },
  { id: 'atardecer', name: 'Atardecer limeño', description: 'Rosados empolvados y ámbar. Nostalgia luminosa.', colors: ['#EBB9A9', '#F3D6C4', '#CF8B6E', '#8C9878'] },
  { id: 'lavanda-bruma', name: 'Lavanda y bruma', description: 'Lilas, grises y blancos. Delicadeza y recogimiento.', colors: ['#C9BEDC', '#ECE7F2', '#9C8DB8', '#869483'] },
  { id: 'oro-otono', name: 'Oro de otoño', description: 'Ocres, mostazas y verdes secos. Gratitud y legado.', colors: ['#D9A441', '#E9CF95', '#A86F2C', '#7B7F54'] },
]

export type SizeId = 'intimo' | 'mediano' | 'amplio' | 'monumental'

export interface Size {
  id: SizeId
  name: string
  description: string
  /** Altura aproximada orientativa */
  approx: string
  /** Multiplicador sobre el precio base del producto */
  multiplier: number
}

export const sizes: Size[] = [
  { id: 'intimo', name: 'Íntimo', description: 'Ideal para una mesa o un rincón del hogar.', approx: '30–45 cm', multiplier: 1 },
  { id: 'mediano', name: 'Mediano', description: 'Presencia equilibrada en sala o velatorio.', approx: '50–70 cm', multiplier: 1.4 },
  { id: 'amplio', name: 'Amplio', description: 'Composición protagonista para velatorio.', approx: '80–110 cm', multiplier: 1.9 },
  { id: 'monumental', name: 'Monumental', description: 'Pieza de gran escala, por cotización.', approx: '120 cm o más', multiplier: 2.6 },
]

export type ContainerId = 'base-pie' | 'ceramica' | 'vidrio' | 'canasta' | 'madera' | 'sin-recipiente'

export interface Container {
  id: ContainerId
  name: string
  description: string
  /** Monto adicional referencial en soles */
  extra: number
  /** true si puede conservarse o reutilizarse */
  keepsake: boolean
}

export const containers: Container[] = [
  { id: 'base-pie', name: 'Base de pie', description: 'Estructura liviana para velatorio. Se retira después.', extra: 0, keepsake: false },
  { id: 'ceramica', name: 'Cerámica artesanal', description: 'Pieza peruana que la familia puede conservar.', extra: 60, keepsake: true },
  { id: 'vidrio', name: 'Florero de vidrio', description: 'Vidrio reciclado, reutilizable en casa.', extra: 35, keepsake: true },
  { id: 'canasta', name: 'Canasta tejida', description: 'Fibras naturales, cálida y reutilizable.', extra: 30, keepsake: true },
  { id: 'madera', name: 'Caja de madera', description: 'Madera reutilizable, puede volverse jardinera.', extra: 45, keepsake: true },
  { id: 'sin-recipiente', name: 'Ramo atado a mano', description: 'Sin recipiente, envuelto en papel natural.', extra: 0, keepsake: false },
]

/** Ocasión: para qué momento es el homenaje */
export type OccasionId = 'velatorio' | 'hogar' | 'memoria' | 'corporativo'

export const occasions: { id: OccasionId; name: string; description: string }[] = [
  { id: 'velatorio', name: 'Velatorio', description: 'Para acompañar la ceremonia de despedida.' },
  { id: 'hogar', name: 'Condolencias al hogar', description: 'Para la familia, en su casa.' },
  { id: 'memoria', name: 'Memoria y aniversario', description: 'Para recordar en fechas significativas.' },
  { id: 'corporativo', name: 'Homenaje corporativo', description: 'En nombre de un equipo o institución.' },
]

/** Formato: la forma física del arreglo */
export type FormatId = 'pie' | 'mesa' | 'recipiente' | 'escultorico'

export const formats: { id: FormatId; name: string }[] = [
  { id: 'pie', name: 'Composición de pie' },
  { id: 'mesa', name: 'Arreglo de mesa' },
  { id: 'recipiente', name: 'En recipiente conservable' },
  { id: 'escultorico', name: 'Pieza escultórica' },
]

export type BudgetId = 'hasta-250' | '250-450' | '450-700' | 'mas-700' | 'por-definir'

export interface Budget {
  id: BudgetId
  name: string
  min: number
  max: number
}

export const budgets: Budget[] = [
  { id: 'hasta-250', name: 'Hasta S/ 250', min: 0, max: 250 },
  { id: '250-450', name: 'S/ 250 – 450', min: 250, max: 450 },
  { id: '450-700', name: 'S/ 450 – 700', min: 450, max: 700 },
  { id: 'mas-700', name: 'Más de S/ 700', min: 700, max: Number.POSITIVE_INFINITY },
  { id: 'por-definir', name: 'Prefiero que me orienten', min: 0, max: Number.POSITIVE_INFINITY },
]

export type InspirationId = 'mar' | 'naturaleza' | 'alegria' | 'serenidad' | 'arte' | 'fe-luz' | 'otra'

export interface Inspiration {
  id: InspirationId
  name: string
  description: string
  palettes: PaletteId[]
  flowers: string[]
}

export const inspirations: Inspiration[] = [
  { id: 'mar', name: 'El mar', description: 'Vivía cerca del mar o siempre volvía a él.', palettes: ['mar-pacifico', 'blanco-sereno'], flowers: ['Campánulas', 'Claveles blancos', 'Limonium', 'Hierbas de costa'] },
  { id: 'naturaleza', name: 'Su jardín', description: 'Plantas, huerto, campo o cerros.', palettes: ['marfil-salvia', 'oro-otono'], flowers: ['Margaritas', 'Romero', 'Eucalipto', 'Espigas'] },
  { id: 'alegria', name: 'La fiesta', description: 'Música, baile, risa y la casa llena.', palettes: ['jardin-vivo', 'atardecer'], flowers: ['Crisantemos pompón', 'Astromelias', 'Claveles coral', 'Margaritas'] },
  { id: 'serenidad', name: 'La calma', description: 'Lectura, silencio, una presencia tranquila.', palettes: ['blanco-sereno', 'lavanda-bruma'], flowers: ['Crisantemo araña', 'Lluvia', 'Claveles blancos', 'Eucalipto'] },
  { id: 'arte', name: 'Sus manos', description: 'Un oficio, el arte, la cocina, hacer cosas.', palettes: ['terracota-calida', 'lavanda-bruma'], flowers: ['Flor seca', 'Ramas', 'Clavel fucsia', 'Espigas'] },
  { id: 'fe-luz', name: 'La luz', description: 'Su fe, su esperanza, una despedida luminosa.', palettes: ['marfil-salvia', 'atardecer'], flowers: ['Astromelias blancas', 'Lluvia', 'Margaritas', 'Claveles crema'] },
  { id: 'otra', name: 'Otra cosa', description: 'Cuéntanos con tus palabras.', palettes: [], flowers: [] },
]

/** Flores que se ofrecen como sugerencia. La disponibilidad real depende de la temporada. */
export const flowerOptions = [
  'Claveles', 'Crisantemos', 'Crisantemo araña', 'Margaritas', 'Astromelias', 'Lluvia (gypsophila)',
  'Manzanilla', 'Limonium', 'Campánulas', 'Espigas', 'Flor seca', 'Eucalipto', 'Romero',
  'Follaje de estación', 'Rosas', 'Hortensias',
]

/** Distritos sugeridos. La cobertura real se valida en cada solicitud. */
export const districts = [
  'Barranco', 'Breña', 'Chorrillos', 'Jesús María', 'La Molina', 'La Victoria', 'Lima Cercado',
  'Lince', 'Los Olivos', 'Magdalena del Mar', 'Miraflores', 'Pueblo Libre', 'Rímac', 'San Borja',
  'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores', 'San Miguel', 'Santiago de Surco',
  'Surquillo', 'Callao', 'Otro distrito (a validar)',
]

export const byId = <T extends { id: string }>(list: readonly T[], id: string | undefined | null) =>
  list.find((item) => item.id === id)
