import { useRef } from 'react'
import { useMotionEffect, type Motion } from '../../../app/motion'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/** Retardo (ms) del fallback CSS de la cortina (.hero-intro en index.css). */
const CURTAIN_FALLBACK_DELAY = 2500
/** Cuánto se separan las letras del centro al inicio de la intro. */
const SPREAD = { mobile: 0.15, desktop: 0.35 }

/** Pseudoaleatorio estable por índice (misma dispersión en cada carga). */
const noise = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/**
 * Intro estilo lenis.dev con una sola copia del título:
 * 1. Pantalla lima (cortina de index.html) y las letras, separadas, se
 *    revelan de abajo arriba. El título va por encima de la cortina con
 *    `mix-blend-mode: difference`: lima sobre lima se ve oscuro.
 * 2. La cortina se retira hacia arriba y las letras quedan en su sitio,
 *    pasando a lima sobre el fondo oscuro.
 * 3. Las letras se juntan, aparece el resto del hero y se limpia el blend.
 */
function playIntro(
  { gsap }: Motion,
  el: HTMLElement,
  section: Element,
  curtain: HTMLElement,
  { chars, masks }: { chars: Element[]; masks: Element[] },
  onDone: () => void,
) {
  const box = el.getBoundingClientRect()
  const centerX = box.left + box.width / 2
  const spread = window.innerWidth < 1024 ? SPREAD.mobile : SPREAD.desktop
  const after = section.querySelectorAll('[data-hero-after]')

  curtain.style.animation = 'none'
  gsap.set(el, { position: 'relative', zIndex: 80, mixBlendMode: 'difference' })

  return gsap
    .timeline({
      onComplete: () => {
        gsap.set(el, { clearProps: 'position,zIndex,mixBlendMode' })
        curtain.style.visibility = 'hidden'
        onDone()
      },
    })
    .from(
      masks,
      {
        x: (_: number, m: Element) => {
          const r = m.getBoundingClientRect()
          return (r.left + r.width / 2 - centerX) * spread
        },
        scale: 1.15,
        duration: 1,
        ease: 'power3.inOut',
      },
      1.6,
    )
    .from(chars, { yPercent: 100, duration: 0.8, ease: 'power3.out', stagger: 0.04 }, 0)
    .fromTo(
      curtain,
      { clipPath: 'inset(0% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'power4.inOut' },
      0.9,
    )
    .from(after, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', stagger: 0.1 }, 2.2)
}

/**
 * Título del hero: intro con cortina (ver playIntro) y, con el scroll, las
 * letras se dispersan hacia arriba cada una a su velocidad. Solo
 * "words,chars": no depende del ancho, no hace falta re-partir al redimensionar.
 */
export function ScatterTitle({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    (motion) => {
      const { gsap, SplitText } = motion
      const el = ref.current
      const section = el?.closest('section')
      if (!el || !section) return
      const split = SplitText.create(el, { type: 'words,chars', mask: 'chars' })
      const { chars } = split
      // Las máscaras solo sirven para la entrada: luego la dispersión debe poder salir de ellas.
      const releaseMasks = () => split.masks.forEach((m) => ((m as HTMLElement).style.overflow = 'visible'))

      // Si GSAP llega antes de que arranque el fallback CSS, la intro la lleva JS.
      const curtain = document.querySelector<HTMLElement>('.hero-intro')
      const cssCurtain = curtain?.getAnimations()[0]
      const curtainPending = Number(cssCurtain?.currentTime ?? Infinity) < CURTAIN_FALLBACK_DELAY

      if (curtain && curtainPending) {
        playIntro(motion, el, section, curtain, split, releaseMasks)
      } else {
        gsap.from(chars, {
          yPercent: 100,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.03,
          onComplete: releaseMasks,
        })
      }

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
