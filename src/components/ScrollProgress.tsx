import { useRef } from 'react'
import { useMotionEffect } from '../app/motion'

/** Barra fina con el progreso de scroll de la página. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useMotionEffect(({ gsap }) => {
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } },
    )
  }, [])

  return (
    <div
      ref={bar}
      aria-hidden
      // transform inline (no la utilidad scale-x de Tailwind, que usa la propiedad `scale` y se sumaría a la de GSAP).
      style={{ transform: 'scaleX(0)' }}
      className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-acento"
    />
  )
}
