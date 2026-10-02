import { useRef } from 'react'
import { useMotionEffect } from '../../../app/motion'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/** Cada fragmento se ilumina en secuencia, ligado al scroll (scrub). */
export function KineticHeadline() {
  const { kinetic } = site
  const ref = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    ({ gsap }) => {
      const el = ref.current
      if (!el) return
      gsap.from(el.children, {
        opacity: 0.12,
        yPercent: 20,
        ease: 'none',
        stagger: 0.5,
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      })
    },
    [],
    !reducedMotion,
  )

  return (
    <Section id="cinetico" className="py-24 sm:py-32">
      <h2 ref={ref} className="wrap text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
        {kinetic.fragments.map((fragment, i) => (
          <span key={i} className="block">
            {fragment}{' '}
          </span>
        ))}
      </h2>
    </Section>
  )
}
