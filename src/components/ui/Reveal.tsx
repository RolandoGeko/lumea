import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/** Aparición suave, una sola vez, al entrar en pantalla. Respeta "reducir movimiento" (ver index.css). */
export default function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reveal ${shown ? 'revealed' : ''} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  )
}
