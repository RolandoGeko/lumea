import { faqs } from '../../content/faq'

export default function Faq({ limit }: { limit?: number }) {
  const list = limit ? faqs.slice(0, limit) : faqs
  return (
    <div className="border-t border-tinta/20">
      {list.map((f, i) => (
        <details key={f.q} className="group border-b border-tinta/15 py-5">
          <summary className="grid cursor-pointer list-none grid-cols-[40px_1fr_auto] items-baseline gap-4 text-tinta">
            <span className="ficha">{String(i + 1).padStart(2, '0')}</span>
            <span className="font-display text-[24px] leading-tight sm:text-[28px]">{f.q}</span>
            <span className="ficha !text-tinta group-open:hidden">Abrir</span>
            <span className="ficha hidden !text-tinta group-open:inline">Cerrar</span>
          </summary>
          <p className="mt-3 max-w-2xl pl-14 text-piedra">{f.a}</p>
        </details>
      ))}
    </div>
  )
}
