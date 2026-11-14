import { brand } from '../config/brand'
import { commerce, formatPrice } from '../config/commerce'
import { getCollection, getProduct } from '../data/catalog'
import { budgets, byId, containers, inspirations, palettes, sizes } from '../data/options'
import { estimateUnitPrice } from './pricing'
import type { CartItem } from './types'

export interface QuoteContact {
  name: string
  phone: string
  email: string
  notes: string
  /** Si es false, NO se incluye la descripción de la persona homenajeada */
  includePersonalStory: boolean
}

const line = (label: string, value: string | undefined | null) => (value && value.trim() ? `• ${label}: ${value.trim()}` : null)

function formatDate(iso: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

/** Construye un mensaje legible y estructurado para WhatsApp */
export function buildQuoteMessage(items: CartItem[], contact: QuoteContact): string {
  const parts: string[] = []
  parts.push(`Hola, ${brand.name}. Quisiera solicitar una cotización de homenaje floral.`)
  parts.push('')

  let total = 0
  let hasUnknown = false

  items.forEach((item, idx) => {
    const c = item.config
    const product = getProduct(c.productId)
    if (!product) return
    const unit = estimateUnitPrice(c)
    if (unit === null) hasUnknown = true
    else total += unit * item.quantity

    const insp = byId(inspirations, c.inspirationId)
    const inspirationText = c.inspirationId === 'otra' ? c.inspirationOther : insp?.name

    const rows = [
      `*${idx + 1}. ${product.name}* (colección ${getCollection(product.collection)?.name}) × ${item.quantity}`,
      line('Para', c.destination === 'velatorio' ? 'Velatorio' : c.destination === 'hogar' ? 'Hogar de la familia' : ''),
      line('Paleta', byId(palettes, c.paletteId)?.name),
      line('Tamaño', byId(sizes, c.sizeId)?.name),
      line('Presentación', byId(containers, c.containerId)?.name),
      line('Flores favoritas', c.favoriteFlowers.join(', ')),
      line('Flores a evitar', c.avoidFlowers.join(', ')),
      line('Notas sobre flores', c.flowerNotes),
      line('Inspiración', inspirationText),
      line('Presupuesto', byId(budgets, c.budgetId)?.name),
      line('Referencia unitaria', unit !== null ? `${formatPrice(unit)} (ilustrativa)` : 'Por cotizar'),
      c.dedication.trim() ? `• Dedicatoria: "${c.dedication.trim()}"${c.signature.trim() ? ` — ${c.signature.trim()}` : ''}` : null,
      contact.includePersonalStory ? line('Sobre la persona homenajeada', c.aboutPerson) : null,
      line('Distrito', c.district),
      line('Fecha deseada', formatDate(c.date)),
      line('Horario', c.time),
      line('Lugar de entrega', c.place),
    ].filter(Boolean)
    parts.push(rows.join('\n'))
    parts.push('')
  })

  if (commerce.showPrices) {
    parts.push(
      hasUnknown
        ? `Subtotal referencial: ${total > 0 ? `${formatPrice(total)} + ítems por cotizar` : 'por cotizar'}`
        : `Subtotal referencial: ${formatPrice(total)}`,
    )
    parts.push('(Entiendo que es un monto ilustrativo y que el precio final se confirma tras validar disponibilidad.)')
    parts.push('')
  }

  const contactRows = [line('Nombre', contact.name), line('Teléfono', contact.phone), line('Correo', contact.email), line('Comentarios', contact.notes)].filter(Boolean)
  if (contactRows.length) {
    parts.push('*Mis datos de contacto*')
    parts.push(contactRows.join('\n'))
    parts.push('')
  }

  parts.push('Quedo atento(a) a la confirmación de diseño, disponibilidad y entrega. Gracias.')
  return parts.join('\n')
}

export function hasWhatsapp() {
  return /^\d{8,15}$/.test(brand.whatsappNumber)
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}
