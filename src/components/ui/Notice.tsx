import type { ReactNode } from 'react'

/** Nota discreta: línea a la izquierda, sin íconos ni cajas de color. */
export default function Notice({ children, tone = 'info', className = '' }: { children: ReactNode; tone?: 'info' | 'warning'; className?: string }) {
  return (
    <p className={`border-l-2 py-1 pl-4 text-[14px] leading-relaxed ${tone === 'warning' ? 'border-terracota text-terracota-oscura' : 'border-tinta/25 text-piedra'} ${className}`}>
      {children}
    </p>
  )
}
