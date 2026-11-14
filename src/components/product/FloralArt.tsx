import { useId, useMemo } from 'react'
import type { CollectionId } from '../../data/catalog'
import type { ContainerId, FormatId, PaletteId, SizeId } from '../../data/options'
import { byId, palettes } from '../../data/options'
import { seededRandom } from '../../lib/random'

/**
 * Ilustración botánica abstracta generada en SVG.
 * NO es una fotografía ni una representación exacta del arreglo final:
 * sirve como referencia visual de forma, paleta y presentación.
 */
interface Props {
  seed: string
  collection: CollectionId
  paletteId: PaletteId
  format: FormatId
  containerId?: ContainerId | ''
  sizeId?: SizeId | ''
  view?: 'frontal' | 'detalle' | 'contexto'
  className?: string
  title?: string
}

type BloomKind = 'round' | 'daisy' | 'cala' | 'cluster' | 'spike'

const styleByCollection: Record<CollectionId, { count: number; kinds: BloomKind[]; spread: number; height: number }> = {
  esencia: { count: 5, kinds: ['cala', 'cala', 'round', 'spike'], spread: 60, height: 210 },
  vida: { count: 15, kinds: ['daisy', 'round', 'daisy', 'cluster', 'round'], spread: 125, height: 150 },
  legado: { count: 10, kinds: ['round', 'cluster', 'round', 'daisy'], spread: 100, height: 120 },
  unica: { count: 12, kinds: ['spike', 'round', 'cluster', 'cala', 'daisy'], spread: 115, height: 170 },
}

const sizeScale: Record<SizeId, number> = { intimo: 0.78, mediano: 0.9, amplio: 1, monumental: 1.08 }

const defaultContainer: Record<FormatId, ContainerId> = {
  pie: 'base-pie',
  mesa: 'vidrio',
  recipiente: 'ceramica',
  escultorico: 'madera',
}

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16)
  const clamp = (v: number) => Math.max(0, Math.min(255, v))
  const r = clamp((n >> 16) + amount)
  const g = clamp(((n >> 8) & 0xff) + amount)
  const b = clamp((n & 0xff) + amount)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export default function FloralArt({
  seed,
  collection,
  paletteId,
  format,
  containerId,
  sizeId,
  view = 'frontal',
  className = '',
  title,
}: Props) {
  const uidRaw = useId()
  const gid = uidRaw.replace(/:/g, '')
  const palette = byId(palettes, paletteId) ?? palettes[0]
  const [c1, c2, c3, leaf] = palette.colors
  const container = containerId || defaultContainer[format]
  const scale = sizeId ? sizeScale[sizeId] : 1

  const art = useMemo(() => {
    const rand = seededRandom(`${seed}-${collection}`)
    const style = styleByCollection[collection]
    const baseX = 200
    const baseY = container === 'base-pie' ? 300 : container === 'sin-recipiente' ? 330 : 345
    const blooms: { x: number; y: number; r: number; kind: BloomKind; color: string; rot: number }[] = []
    const leaves: { x: number; y: number; rx: number; ry: number; rot: number; dark: boolean }[] = []
    const colors = [c1, c2, c3, c1, c2]

    for (let i = 0; i < style.count; i++) {
      const t = style.count === 1 ? 0.5 : i / (style.count - 1)
      const angle = (-0.5 + t) * Math.PI * (collection === 'esencia' ? 0.35 : 0.9) + (rand() - 0.5) * 0.3
      const dist = style.height * (0.55 + rand() * 0.5)
      const x = baseX + Math.sin(angle) * style.spread * (0.6 + rand() * 0.6)
      const y = baseY - Math.cos(angle) * dist * (collection === 'esencia' ? 1 : 0.8)
      const kind = style.kinds[Math.floor(rand() * style.kinds.length)]
      const r = (collection === 'esencia' ? 16 : 20) + rand() * (collection === 'vida' ? 16 : 12)
      blooms.push({ x, y, r, kind, color: colors[Math.floor(rand() * colors.length)], rot: (rand() - 0.5) * 50 })
    }
    blooms.sort((a, b) => a.y - b.y)

    const leafCount = collection === 'esencia' ? 6 : 12
    for (let i = 0; i < leafCount; i++) {
      const angle = (rand() - 0.5) * Math.PI * 0.95
      const dist = 50 + rand() * (style.height * 0.8)
      leaves.push({
        x: baseX + Math.sin(angle) * dist * 0.9,
        y: baseY - Math.cos(angle) * dist * 0.7,
        rx: 7 + rand() * 6,
        ry: 18 + rand() * 18,
        rot: (angle * 180) / Math.PI + (rand() - 0.5) * 40,
        dark: rand() > 0.5,
      })
    }
    return { blooms, leaves, baseX, baseY }
  }, [seed, collection, container, c1, c2, c3])

  const { blooms, leaves, baseX, baseY } = art

  const transform =
    view === 'detalle'
      ? `translate(200 230) scale(1.75) translate(-200 ${-(baseY - 110)})`
      : view === 'contexto'
        ? `translate(200 300) scale(${0.62 * scale}) translate(-200 -300)`
        : `translate(200 ${baseY}) scale(${scale}) translate(-200 ${-baseY})`

  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label={title ?? `Ilustración de referencia en paleta ${palette.name}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`bg-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBF8F3" />
          <stop offset="100%" stopColor={view === 'contexto' ? '#E4D8C4' : '#EFE6D8'} />
        </linearGradient>
        <radialGradient id={`halo-${gid}`} cx="0.5" cy="0.45" r="0.5">
          <stop offset="0%" stopColor={c2} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c2} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="500" fill={`url(#bg-${gid})`} />
      {view === 'contexto' && (
        <g>
          <rect x="0" y="0" width="400" height="360" fill="#F3EDE3" />
          <rect x="250" y="40" width="110" height="150" rx="4" fill="#fff" opacity="0.55" />
          <line x1="305" y1="40" x2="305" y2="190" stroke="#E2D7C5" strokeWidth="2" />
          <rect x="0" y="360" width="400" height="140" fill="#E7DCCB" />
          <ellipse cx="200" cy="368" rx="95" ry="10" fill="#000" opacity="0.06" />
        </g>
      )}
      <circle cx="200" cy="200" r="190" fill={`url(#halo-${gid})`} />

      <g transform={transform}>
        {/* Tallos */}
        {blooms.map((b, i) => (
          <path
            key={`s${i}`}
            d={`M ${baseX + (b.x - baseX) * 0.15} ${baseY + 10} Q ${baseX + (b.x - baseX) * 0.4} ${(b.y + baseY) / 2} ${b.x} ${b.y}`}
            stroke={shade(leaf, -25)}
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
        ))}
        {/* Hojas */}
        {leaves.map((l, i) => (
          <ellipse
            key={`l${i}`}
            cx={l.x}
            cy={l.y}
            rx={l.rx}
            ry={l.ry}
            transform={`rotate(${l.rot} ${l.x} ${l.y})`}
            fill={l.dark ? shade(leaf, -18) : leaf}
            opacity="0.92"
          />
        ))}
        {/* Flores */}
        {blooms.map((b, i) => (
          <Bloom key={`b${i}`} {...b} />
        ))}
        <ContainerShape kind={container} baseX={baseX} baseY={baseY} accent={c3} />
      </g>
    </svg>
  )
}

function Bloom({ x, y, r, kind, color, rot }: { x: number; y: number; r: number; kind: BloomKind; color: string; rot: number }) {
  const dark = shade(color, -30)
  switch (kind) {
    case 'daisy':
      return (
        <g transform={`translate(${x} ${y}) rotate(${rot})`}>
          {Array.from({ length: 10 }).map((_, i) => (
            <ellipse key={i} cx="0" cy={-r * 0.6} rx={r * 0.22} ry={r * 0.55} fill={color} transform={`rotate(${i * 36})`} />
          ))}
          <circle r={r * 0.32} fill={shade(color, -60)} />
        </g>
      )
    case 'cala':
      return (
        <g transform={`translate(${x} ${y}) rotate(${rot * 0.6})`}>
          <path d={`M 0 ${r * 0.9} C ${-r} ${r * 0.2}, ${-r * 0.6} ${-r * 1.3}, 0 ${-r * 1.5} C ${r * 0.5} ${-r * 1.1}, ${r * 0.9} ${r * 0.1}, 0 ${r * 0.9} Z`} fill={color} stroke={dark} strokeOpacity="0.25" />
          <path d={`M 0 ${r * 0.6} L 0 ${-r * 0.5}`} stroke={shade(color, -70)} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </g>
      )
    case 'cluster':
      return (
        <g transform={`translate(${x} ${y})`}>
          {Array.from({ length: 9 }).map((_, i) => {
            const a = (i / 9) * Math.PI * 2
            const d = i === 0 ? 0 : r * 0.55
            return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={r * 0.38} fill={i % 2 ? color : shade(color, 12)} />
          })}
        </g>
      )
    case 'spike':
      return (
        <g transform={`translate(${x} ${y}) rotate(${rot * 0.3})`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <circle key={i} cx={(i % 2 ? 1 : -1) * r * 0.18} cy={-i * r * 0.42} r={r * (0.42 - i * 0.04)} fill={i % 2 ? color : shade(color, -15)} />
          ))}
        </g>
      )
    default:
      return (
        <g transform={`translate(${x} ${y}) rotate(${rot})`}>
          <circle r={r} fill={color} />
          <circle r={r * 0.72} fill={shade(color, -14)} />
          <circle r={r * 0.45} fill={shade(color, -26)} />
          <path d={`M ${-r * 0.2} 0 a ${r * 0.2} ${r * 0.2} 0 1 1 ${r * 0.3} ${r * 0.1}`} stroke={dark} fill="none" strokeWidth="1.5" opacity="0.5" />
        </g>
      )
  }
}

function ContainerShape({ kind, baseX, baseY, accent }: { kind: ContainerId; baseX: number; baseY: number; accent: string }) {
  switch (kind) {
    case 'base-pie':
      return (
        <g stroke="#8B8378" strokeWidth="4" strokeLinecap="round">
          <ellipse cx={baseX} cy={baseY + 8} rx="46" ry="12" fill="#B8AE9F" stroke="none" />
          <line x1={baseX - 20} y1={baseY + 14} x2={baseX - 55} y2={baseY + 175} />
          <line x1={baseX + 20} y1={baseY + 14} x2={baseX + 55} y2={baseY + 175} />
          <line x1={baseX} y1={baseY + 16} x2={baseX} y2={baseY + 178} />
        </g>
      )
    case 'ceramica':
      return (
        <g>
          <path d={`M ${baseX - 58} ${baseY} Q ${baseX - 72} ${baseY + 70} ${baseX - 40} ${baseY + 110} L ${baseX + 40} ${baseY + 110} Q ${baseX + 72} ${baseY + 70} ${baseX + 58} ${baseY} Z`} fill="#C28A6B" />
          <path d={`M ${baseX - 60} ${baseY + 40} Q ${baseX} ${baseY + 52} ${baseX + 60} ${baseY + 40}`} stroke={shade(accent, 30)} strokeWidth="5" fill="none" opacity="0.7" />
          <ellipse cx={baseX} cy={baseY} rx="58" ry="10" fill="#A9705308" stroke="#A97053" strokeWidth="2" />
        </g>
      )
    case 'vidrio':
      return (
        <g>
          <path d={`M ${baseX - 38} ${baseY - 5} L ${baseX - 44} ${baseY + 115} L ${baseX + 44} ${baseY + 115} L ${baseX + 38} ${baseY - 5} Z`} fill="#DDE7E4" opacity="0.65" stroke="#B9C9C4" strokeWidth="2" />
          <rect x={baseX - 41} y={baseY + 60} width="82" height="53" fill="#C8DAD5" opacity="0.5" />
          <line x1={baseX - 25} y1={baseY + 5} x2={baseX - 28} y2={baseY + 100} stroke="#fff" strokeWidth="4" opacity="0.6" />
        </g>
      )
    case 'canasta':
      return (
        <g>
          <path d={`M ${baseX - 75} ${baseY} L ${baseX - 58} ${baseY + 95} L ${baseX + 58} ${baseY + 95} L ${baseX + 75} ${baseY} Z`} fill="#C9A878" />
          {[18, 38, 58, 78].map((d) => (
            <line key={d} x1={baseX - 73 + d * 0.2} y1={baseY + d} x2={baseX + 73 - d * 0.2} y2={baseY + d} stroke="#A9895C" strokeWidth="3" />
          ))}
          {[-50, -25, 0, 25, 50].map((d) => (
            <line key={d} x1={baseX + d * 1.2} y1={baseY} x2={baseX + d} y2={baseY + 95} stroke="#B39367" strokeWidth="2" />
          ))}
        </g>
      )
    case 'madera':
      return (
        <g>
          <rect x={baseX - 95} y={baseY} width="190" height="70" rx="3" fill="#B08C68" />
          <rect x={baseX - 95} y={baseY} width="190" height="10" fill="#9A7754" />
          <line x1={baseX - 95} y1={baseY + 38} x2={baseX + 95} y2={baseY + 38} stroke="#9A7754" strokeWidth="2" opacity="0.6" />
        </g>
      )
    case 'sin-recipiente':
    default:
      return (
        <g>
          <path d={`M ${baseX - 70} ${baseY - 30} L ${baseX} ${baseY + 140} L ${baseX + 70} ${baseY - 30} Q ${baseX} ${baseY + 10} ${baseX - 70} ${baseY - 30} Z`} fill="#D9C4A3" />
          <path d={`M ${baseX - 22} ${baseY + 60} L ${baseX + 22} ${baseY + 60}`} stroke={accent} strokeWidth="6" strokeLinecap="round" />
        </g>
      )
  }
}
