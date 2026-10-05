import { useRef, type CSSProperties } from 'react'
import { useMotionEffect } from '../../app/motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * Capas de bruma. `parallax`: desplazamiento vertical (fracción de su tamaño)
 * a lo largo de toda la página; `layer`: multiplicador de opacidad.
 * La tercera capa solo en escritorio (menos memoria de capas en móvil).
 */
const LAYERS = [
  { position: '-bottom-[45vmax] -left-[30vmax] size-[110vmax]', drift: 'motion-safe:animate-haze-a', parallax: -0.25, layer: 1 },
  { position: 'top-[5vh] -right-[40vmax] size-[95vmax]', drift: 'motion-safe:animate-haze-b', parallax: 0.2, layer: 0.8 },
  { position: '-top-[35vmax] left-[15vw] hidden size-[85vmax] lg:block', drift: 'motion-safe:animate-haze-c', parallax: -0.35, layer: 0.6 },
]

/**
 * Bruma gris-blanca en toda la página: capas fijas detrás del contenido y por
 * encima del 3D (el objeto queda "dentro" de la niebla). Deriva lenta en CSS
 * y parallax suave con el scroll. Con reduced motion queda estática.
 */
export function Haze() {
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    ({ gsap }) => {
      root.current?.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.parallax) * 100,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: true },
        })
      })
    },
    [],
    !reducedMotion,
  )

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {LAYERS.map((l) => (
        // El parallax (GSAP) va en el contenedor y la deriva (CSS) en el hijo: no se pisan los transform.
        <div key={l.position} data-parallax={l.parallax} className={`absolute ${l.position}`}>
          <div className={`haze-blob size-full ${l.drift}`} style={{ '--layer': l.layer } as CSSProperties} />
        </div>
      ))}
      <div className="haze-grain absolute inset-0" />
    </div>
  )
}
