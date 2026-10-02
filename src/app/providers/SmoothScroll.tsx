import 'lenis/dist/lenis.css'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useMotionEffect } from '../motion'

/**
 * Scroll suave con un único reloj: Lenis avanza desde gsap.ticker y cada
 * scroll de Lenis actualiza ScrollTrigger. El táctil no se suaviza
 * (syncTouch: false). Con prefers-reduced-motion se usa el scroll nativo.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    ({ gsap, Lenis, ScrollTrigger }) => {
      // anchors: Lenis ya respeta el scroll-padding-top del CSS (altura del nav).
      const lenis = new Lenis({ autoRaf: false, syncTouch: false, anchors: true })
      lenis.on('scroll', ScrollTrigger.update)

      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      return () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
      }
    },
    [],
    !reducedMotion,
  )

  return children
}
