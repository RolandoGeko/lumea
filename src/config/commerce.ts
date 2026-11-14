/**
 * CONFIGURACIÓN COMERCIAL (ilustrativa)
 * ------------------------------------------------------------
 * Todos los montos son referenciales para validar la propuesta.
 * No representan precios definitivos ni compromisos de venta.
 */

export const commerce = {
  currency: 'PEN',
  locale: 'es-PE',
  /** Si es false, se ocultan todos los precios y se muestra "Cotizar". */
  showPrices: true,
  priceDisclaimer:
    'Precios referenciales en soles. El monto final se confirma tras validar diseño, flores disponibles y entrega.',
  availabilityDisclaimer:
    'El diseño final está sujeto a validación y a la disponibilidad floral de temporada. Te confirmaremos cualquier ajuste antes de elaborarlo.',
  deliveryDisclaimer:
    'La cobertura, fecha y horario de entrega se validan caso por caso. Aún no garantizamos entregas.',
  /** Días mínimos de anticipación sugeridos para la fecha de entrega en el formulario. */
  minLeadDays: 0,
} as const

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(commerce.locale, {
    style: 'currency',
    currency: commerce.currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
