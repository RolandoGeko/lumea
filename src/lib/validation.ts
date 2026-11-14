export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
/** Teléfono peruano: celular de 9 dígitos que empieza en 9, o fijo con código. Acepta +51 y espacios. */
export const isPhone = (v: string) => {
  const digits = v.replace(/[\s\-()]/g, '').replace(/^\+?51/, '')
  return /^9\d{8}$/.test(digits) || /^0?1\d{7}$/.test(digits) || /^\d{7,9}$/.test(digits)
}
/** RUC: 11 dígitos que empiezan en 10, 15, 17 o 20 */
export const isRuc = (v: string) => /^(10|15|17|20)\d{9}$/.test(v.trim())

export const todayIso = () => {
  const d = new Date()
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}
