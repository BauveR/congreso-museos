import 'lenis/dist/lenis.css'
import { useRef, type ReactNode } from 'react'
import { requestSnap } from '../../features/hero3d/scrollState'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useMotionEffect } from '../motion'

/** Distancia (en alturas de pantalla) a partir de la cual se navega con fundido. */
const FADE_DISTANCE = 1.5

/**
 * Scroll suave con un único reloj: Lenis avanza desde gsap.ticker y cada
 * scroll de Lenis actualiza ScrollTrigger. El táctil no se suaviza
 * (syncTouch: false). Con prefers-reduced-motion se usa el scroll nativo.
 *
 * Enlaces a secciones (#ancla): si la sección está cerca, scroll suave; si
 * está lejos, la pantalla se funde al color de fondo, salta por debajo y
 * reaparece en la sección (sin ver pasar todo el contenido a toda velocidad).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  const veil = useRef<HTMLDivElement>(null)

  useMotionEffect(
    ({ gsap, Lenis, ScrollTrigger }) => {
      const lenis = new Lenis({ autoRaf: false, syncTouch: false })
      lenis.on('scroll', ScrollTrigger.update)

      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      let navigating = false

      const arrive = (target: HTMLElement, hash: string) => {
        history.pushState(null, '', hash)
        // Foco en la sección para teclado y lectores de pantalla.
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      }

      const onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
        const hash = link?.getAttribute('href')
        if (!hash || hash.length < 2 || navigating) return
        const target = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (!target) return
        event.preventDefault()

        const distance = Math.abs(target.getBoundingClientRect().top)
        if (distance < window.innerHeight * FADE_DISTANCE || !veil.current) {
          // Lenis respeta el scroll-padding-top del CSS (altura del nav).
          lenis.scrollTo(target, { onComplete: () => arrive(target, hash) })
          return
        }

        navigating = true
        gsap
          .timeline({ onComplete: () => void (navigating = false) })
          .to(veil.current, { autoAlpha: 1, duration: 0.25, ease: 'power1.in' })
          .add(() => {
            lenis.scrollTo(target, { immediate: true, force: true })
            ScrollTrigger.update()
            requestSnap()
            arrive(target, hash)
          })
          .to(veil.current, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' }, '+=0.05')
      }
      document.addEventListener('click', onClick)

      return () => {
        document.removeEventListener('click', onClick)
        gsap.ticker.remove(tick)
        lenis.destroy()
      }
    },
    [],
    !reducedMotion,
  )

  return (
    <>
      {children}
      {/* Velo del fundido: color de fondo del tema, bajo el nav (z 50). */}
      <div ref={veil} aria-hidden className="pointer-events-none invisible fixed inset-0 z-[45] bg-fondo opacity-0" />
    </>
  )
}
