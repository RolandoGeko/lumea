import { brand } from '../../config/brand'

/** Logotipo tipográfico: el nombre en EB Garamond, sin ícono. */
export default function Logo({ className = '' }: { className?: string }) {
  if (brand.logoSrc) return <img src={brand.logoSrc} alt={brand.name} className={`h-8 w-auto ${className}`} />
  return <span className={`font-display text-[30px] leading-none tracking-[0.06em] text-tinta ${className}`}>{brand.name}</span>
}
