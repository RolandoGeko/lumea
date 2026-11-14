import type { ReactNode } from 'react'

export default function SectionHeading({
  eyebrow,
  title,
  children,
  align = 'left',
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: ReactNode
  children?: ReactNode
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
}) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p className={`ficha mb-5 flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="hairline" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <Tag className={Tag === 'h1' ? 'text-[52px] sm:text-[72px] lg:text-[88px]' : 'text-[40px] sm:text-[52px]'}>{title}</Tag>
      {children && <div className="mt-6 text-base leading-relaxed text-piedra sm:text-[17px]">{children}</div>}
    </div>
  )
}
