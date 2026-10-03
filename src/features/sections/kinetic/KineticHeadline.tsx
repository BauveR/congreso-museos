import { useRef } from 'react'
import { useMotionEffect } from '../../../app/motion'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/** Desplazamiento inicial de cada fragmento, en fracción del ancho de ventana. */
const OFFSET = 0.35

/**
 * Los fragmentos se alternan a izquierda y derecha y entran desde su lado,
 * en sentidos opuestos, ligados al scroll (scrub).
 */
export function KineticHeadline() {
  const { kinetic } = site
  const ref = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    ({ gsap }) => {
      const el = ref.current
      if (!el) return
      gsap.utils.toArray<HTMLElement>(el.children).forEach((fragment, i) => {
        const direction = i % 2 === 0 ? -1 : 1
        gsap.fromTo(
          fragment,
          { x: () => direction * window.innerWidth * OFFSET, opacity: 0.12 },
          {
            x: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: fragment,
              start: 'top bottom',
              end: 'top 45%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    },
    [],
    !reducedMotion,
  )

  return (
    <Section id="cinetico" className="overflow-x-clip py-24 sm:py-32">
      <h2
        ref={ref}
        className="wrap text-[clamp(2.25rem,8vw,6.5rem)] leading-[0.95] font-black tracking-tight uppercase"
      >
        {kinetic.fragments.map((fragment, i) => (
          <span key={i} className="block even:text-right even:text-acento-texto">
            {fragment}{' '}
          </span>
        ))}
      </h2>
    </Section>
  )
}
