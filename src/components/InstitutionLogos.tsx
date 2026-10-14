import type { HTMLAttributes } from 'react'
import { site } from '../content/site'

/** Alto de cada logo según su tamaño (los de la organización, un punto mayores); en móvil, algo menores para que quepan en la primera pantalla. */
const LOGO_HEIGHTS = {
  sm: 'h-[1.5rem] sm:h-[1.8rem] lg:h-[2.1rem]',
  md: 'h-[2.15rem] sm:h-[2.5rem] lg:h-[2.9rem]',
  lg: 'h-[2.8rem] sm:h-[3.3rem] lg:h-[3.6rem]',
  xl: 'h-[3.2rem] sm:h-[3.8rem] lg:h-[4.15rem]',
  /** Logos apaisados (más anchos que altos): menos alto para que no se coman la línea. */
  wide: 'h-[2.2rem] sm:h-[2.6rem] lg:h-[3rem]',
} as const

/**
 * Línea de logos de las instituciones, por grupos («Organizan», «Colaboran»)
 * con su rótulo encima. Logos blancos: solo sobre fondo oscuro (hero y pie).
 * `centerMobile`: por debajo de md, cada grupo centrado y su rótulo alineado
 * al borde izquierdo de sus logos (pie).
 * `oneRowMobile`: por debajo de sm, los grupos en una sola fila, a partes
 * iguales; los logos se encogen para caber (hero). Con la misma anchura
 * quedan en la proporción de escritorio, donde también miden casi lo mismo.
 */
export function InstitutionLogos({
  className = '',
  centerMobile = false,
  oneRowMobile = false,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { centerMobile?: boolean; oneRowMobile?: boolean }) {
  const { hero } = site
  const layout = `${centerMobile ? 'max-md:justify-center' : ''} ${oneRowMobile ? 'max-sm:flex-nowrap max-sm:gap-x-5' : ''}`
  return (
    <div role="group" aria-label={hero.logosLabel} className={`flex flex-wrap gap-x-12 gap-y-3 sm:gap-y-4 lg:gap-x-16 ${layout} ${className}`} {...rest}>
      {hero.logoGroups.map((group) => (
        <div key={group.label} className={oneRowMobile ? 'max-sm:min-w-0 max-sm:flex-1' : undefined}>
          <p className="mb-2.5 text-xs font-bold tracking-widest text-texto-suave uppercase sm:mb-3">{group.label}:</p>
          <ul aria-label={group.label} className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8 lg:gap-x-10">
            {group.logos.map((logo) => (
              <li key={logo.src} className={oneRowMobile ? 'max-sm:w-full max-sm:min-w-0' : undefined}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  loading="lazy"
                  decoding="async"
                  className={`w-auto ${LOGO_HEIGHTS[logo.size]} ${oneRowMobile ? 'max-sm:h-auto max-sm:w-full' : ''}`}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
