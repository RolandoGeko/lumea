import type { MouseEvent } from 'react'

/** Salta a una sección de la misma página sin tocar la URL (funciona con cualquier tipo de router). */
export const jumpTo = (id: string) => (e: MouseEvent) => {
  e.preventDefault()
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  if (el.tabIndex < 0) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}
