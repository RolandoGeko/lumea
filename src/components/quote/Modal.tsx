import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus()
    }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/40 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border-t-2 border-terracota bg-marfil p-6 focus:outline-none sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-[36px]">{title}</h2>
          <button type="button" onClick={onClose} className="ficha !text-tinta underline underline-offset-4" aria-label="Cerrar">
            Cerrar
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
