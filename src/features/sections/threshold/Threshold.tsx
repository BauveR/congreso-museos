import { useRef } from 'react'
import { useMotionEffect } from '../../../app/motion'
import { setTheme } from '../../../app/theme'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { notifyScroll, scrollState } from '../../hero3d/scrollState'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { strokeOrigin } from './strokeOrigin'

/** Parte inicial del recorrido (respecto al crecimiento) con la palabra quieta y completa. */
const HOLD = 0.15

/**
 * Transición: la palabra crece hasta llenar la pantalla mientras la esfera
 * pulsante del fondo crece desde el centro y la cubre de color claro; al
 * terminar, la página pasa a tema claro (y vuelve a oscuro al subir). Al
 * salir de la sección la esfera vuelve a su tamaño.
 * Sin esfera (GPU sin 3D) el círculo es un velo CSS. Con reduced motion solo
 * cambia el tema.
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
    ({ gsap, ScrollTrigger }) => {
      const el = word.current
      if (!el) return

      // Relleno de la esfera: crece en la timeline y se recoge al salir.
      const fill = { grow: 0, exit: 0 }
      const writeFill = () => {
        scrollState.fill = fill.grow * (1 - fill.exit)
        notifyScroll()
      }
      ScrollTrigger.create({
        trigger: section.current,
        start: 'bottom bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          fill.exit = self.progress
          writeFill()
        },
      })

      gsap
        .timeline({
          scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true },
        })
        // Pausa: la palabra se lee completa antes de empezar a crecer.
        .to({}, { duration: HOLD })
        .fromTo(el, { scale: 1 }, { scale: 30, ease: 'power2.in', duration: 1, transformOrigin: () => strokeOrigin(el) })
        .fromTo(
          veil.current,
          { clipPath: 'circle(0% at 50% 50%)' },
          { clipPath: 'circle(75% at 50% 50%)', ease: 'power1.in', duration: 0.45 },
          HOLD + 0.55,
        )
        .to(fill, { grow: 1, ease: 'power1.in', duration: 0.45, onUpdate: writeFill }, HOLD + 0.55)

      return () => {
        scrollState.fill = 0
        notifyScroll()
      }
    },
    [],
    !reducedMotion,
  )

  return (
    <Section id="umbral" ref={section} className="h-[260svh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:py-24">
        <p
          ref={word}
          aria-hidden
          className="px-(--wrap-gutter) font-wordmark text-[min(15vw,22svh)] leading-[1.15] font-normal whitespace-nowrap text-claro uppercase"
        >
          {threshold.word}
        </p>
        <div
          ref={veil}
          aria-hidden
          style={{ clipPath: 'circle(0% at 50% 50%)' }}
          className="absolute inset-0 bg-claro motion-reduce:hidden [html[data-sphere]_&]:hidden"
        />
      </div>
    </Section>
  )
}
