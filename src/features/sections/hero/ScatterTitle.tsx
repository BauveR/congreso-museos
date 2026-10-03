import { useRef } from 'react'
import { useMotionEffect } from '../../../app/motion'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/** Segundo (desde la carga) en que la cortina lima del hero ya casi ha salido. */
const INTRO_END = 1.1

/** Pseudoaleatorio estable por índice (misma dispersión en cada carga). */
const noise = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Título partido en letras: entran al cargar y, con el scroll, se dispersan
 * hacia arriba cada una a su velocidad. Solo "words,chars": no depende del
 * ancho, así que no hace falta re-partir al redimensionar.
 */
export function ScatterTitle({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    ({ gsap, SplitText }) => {
      const el = ref.current
      const section = el?.closest('section')
      if (!el || !section) return
      const { chars } = SplitText.create(el, { type: 'words,chars' })

      // Entrada sincronizada con la cortina lima de index.html (termina a ~1,4 s
      // de la carga); si GSAP llega más tarde, entra sin esperar.
      gsap.from(chars, {
        yPercent: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.03,
        delay: Math.max(0, INTRO_END - performance.now() / 1000),
      })

      const scroll = { trigger: section, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to(chars, {
        y: (i: number) => -(0.3 + noise(i) * 0.7) * window.innerHeight,
        rotate: (i: number) => (noise(i + 99) - 0.5) * 40,
        ease: 'none',
        scrollTrigger: { ...scroll, invalidateOnRefresh: true },
      })
      // La opacidad va en el contenedor para no pisar la de la entrada.
      gsap.to(el, { opacity: 0, ease: 'power1.in', scrollTrigger: scroll })
    },
    [],
    !reducedMotion,
  )

  return (
    <h1 ref={ref} data-reveal="" className={className}>
      {children}
    </h1>
  )
}
