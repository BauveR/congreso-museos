import type { HTMLAttributes } from 'react'
import { site } from '../content/site'

/** Alto de cada logo según su tamaño (los de la organización, un punto mayores); en móvil, algo menores para que quepan en la primera pantalla. */
const LOGO_HEIGHTS = {
  sm: 'h-[1.5rem] sm:h-[1.8rem] lg:h-[2.1rem]',
  md: 'h-[1.8rem] sm:h-[2.1rem] lg:h-[2.4rem]',
  lg: 'h-[2.8rem] sm:h-[3.3rem] lg:h-[3.6rem]',
  xl: 'h-[3.2rem] sm:h-[3.8rem] lg:h-[4.15rem]',
  /** Logos apaisados (más anchos que altos): menos alto para que no se coman la línea. */
  wide: 'h-[2.2rem] sm:h-[2.6rem] lg:h-[3rem]',
} as const

/**
 * Línea de logos de las instituciones, por grupos («Organizan», «Colaboran»)
 * con su rótulo encima. Logos blancos: solo sobre fondo oscuro (hero y pie).
 */
export function InstitutionLogos({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { hero } = site
  return (
    <div role="group" aria-label={hero.logosLabel} className={`flex flex-wrap gap-x-12 gap-y-3 sm:gap-y-4 lg:gap-x-16 ${className}`} {...rest}>
      {hero.logoGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 text-xs font-bold tracking-widest text-texto-suave uppercase sm:mb-2">{group.label}:</p>
          <ul aria-label={group.label} className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8 lg:gap-x-10">
            {group.logos.map((logo) => (
              <li key={logo.src}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  loading="lazy"
                  decoding="async"
                  className={`w-auto ${LOGO_HEIGHTS[logo.size]}`}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
