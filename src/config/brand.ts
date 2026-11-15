/**
 * CONFIGURACIÓN CENTRAL DE MARCA Y CONTACTO
 * ------------------------------------------------------------
 * Edita este archivo para cambiar nombre, lema, logo y canales. Colores y tipografías: src/index.css.
 * No hace falta tocar componentes.
 */

export const brand = {
  /** Nombre comercial. Se usa en el header, footer, títulos y mensajes. */
  name: 'Floryarte',
  /** Versión sin tildes ni mayúsculas, útil para claves internas. */
  slug: 'floryarte',
  tagline: 'Flores con la forma de alguien',
  shortDescription:
    'Estudio de homenajes florales en Lima. Diseñamos cada pieza a partir de cómo era una persona.',
  city: 'Lima Metropolitana, Perú',

  /**
   * Logo: deja `logoSrc` vacío para usar el logotipo tipográfico.
   * Si tienes un archivo, colócalo en /public (por ejemplo /public/logo.svg) y escribe '/logo.svg'.
   */
  logoSrc: '',

  /**
   * WhatsApp en formato internacional SIN '+', espacios ni guiones. Ej.: '51987654321'.
   * Si se deja vacío, la web NO abre WhatsApp: ofrece copiar el mensaje.
   */
  whatsappNumber: '',

  /** Correo de contacto. Vacío = no se muestra. */
  contactEmail: '',

  /** Redes sociales. Vacías = no se muestran. */
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },

  /** Modo demostración: muestra avisos y evita cualquier envío real. */
  demoMode: true,
  demoNotice:
    'Sitio de demostración. Precios referenciales; no se procesan pedidos, pagos ni entregas reales.',

} as const

export type Brand = typeof brand

