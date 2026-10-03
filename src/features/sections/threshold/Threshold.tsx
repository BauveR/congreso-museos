import { useRef } from 'react'
import { useMotionEffect } from '../../../app/motion'
import { setTheme } from '../../../app/theme'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/**
 * Transición: la palabra crece hasta llenar la pantalla mientras un velo del
 * color claro se abre desde el centro; al terminar, la página pasa a tema
 * claro (y vuelve a oscuro al subir). Con reduced motion solo cambia el tema.
 */
export function Threshold() {
  const { threshold } = site
  const section = useRef<HTMLElement>(null)
  const word = useRef<HTMLParagraphElement>(null)
  const veil = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  // Cambio de tema: siempre, también con reduced motion.
  useMotionEffect(({ ScrollTrigger }) => {
    ScrollTrigger.create({
      trigger: section.current,
      start: 'bottom bottom',
      onEnter: () => setTheme('light'),
      onLeaveBack: () => setTheme('dark'),
    })
    return () => setTheme('dark')
  }, [])

  useMotionEffect(
    ({ gsap }) => {
      gsap
        .timeline({
          scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true },
        })
        .fromTo(word.current, { scale: 1 }, { scale: 30, ease: 'power2.in', duration: 1 })
        .fromTo(
          veil.current,
          { clipPath: 'circle(0% at 50% 50%)' },
          { clipPath: 'circle(75% at 50% 50%)', ease: 'power1.in', duration: 0.45 },
          0.55,
        )
    },
    [],
    !reducedMotion,
  )

  return (
    <Section id="umbral" ref={section} className="h-[300svh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <p
          ref={word}
          aria-hidden
          className="text-[24vw] leading-none font-black tracking-tighter text-texto uppercase"
        >
          {threshold.word}
        </p>
        <div
          ref={veil}
          aria-hidden
          style={{ clipPath: 'circle(0% at 50% 50%)' }}
          className="absolute inset-0 bg-claro motion-reduce:hidden"
        />
      </div>
    </Section>
  )
}
