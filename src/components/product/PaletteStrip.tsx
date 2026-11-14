import { byId, palettes } from '../../data/options'
import type { PaletteId } from '../../data/options'

/** Franja de colores de una paleta: representación honesta del color elegido. */
export default function PaletteStrip({ id, className = '', label = true }: { id: PaletteId | ''; className?: string; label?: boolean }) {
  const p = byId(palettes, id)
  if (!p) return null
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="flex h-3 w-24 overflow-hidden" aria-hidden="true">
        {p.colors.map((c, i) => (
          <span key={i} className="h-full flex-1" style={{ background: c }} />
        ))}
      </span>
      {label && <span className="ficha">{p.name}</span>}
    </div>
  )
}
