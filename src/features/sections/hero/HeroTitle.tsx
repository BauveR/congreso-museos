import { useRef } from 'react'
import { useMotionEffect, type Motion } from '../../../app/motion'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/** Retardo (ms) del fallback CSS de la cortina (.hero-intro en index.css). */
const CURTAIN_FALLBACK_DELAY = 2500

/** Pseudoaleatorio estable por índice (misma dispersión en cada carga). */
const noise = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

interface Parts {
  title: HTMLElement
  section: Element
  edition: HTMLElement
  chars: Element[]
}

/**
 * Intro estilo lenis.dev:
 * 1. Pantalla lima (cortina de index.html) y la edición ("V") gigante se
 *    revela de abajo arriba. El título va por encima de la cortina con
 *    `mix-blend-mode: difference`: lima sobre lima se ve oscuro.
 * 2. La cortina se retira hacia arriba y la V queda en su sitio, pasando a
 *    lima sobre el fondo oscuro, mientras se asienta a su tamaño final.
 * 3. Entra el nombre letra a letra y después la fecha y el indicador de scroll.
 */
function playIntro({ gsap }: Motion, { title, section, edition, chars }: Parts, curtain: HTMLElement, onDone: () => void) {
  curtain.style.animation = 'none'
  gsap.set(title, { position: 'relative', zIndex: 80, mixBlendMode: 'difference' })

  return gsap
    .timeline({
      onComplete: () => {
        gsap.set(title, { clearProps: 'position,zIndex,mixBlendMode' })
        curtain.style.visibility = 'hidden'
        onDone()
      },
    })
    .from(edition, { yPercent: 100, duration: 1, ease: 'power3.out' }, 0)
    .from(edition, { scale: 1.3, transformOrigin: '0% 100%', duration: 1.1, ease: 'power3.inOut' }, 1.2)
    .fromTo(
      curtain,
      { clipPath: 'inset(0% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'power4.inOut' },
      0.9,
    )
    .from(chars, { yPercent: 100, duration: 0.7, ease: 'power3.out', stagger: 0.025 }, 1.6)
    .from(
      section.querySelectorAll('[data-hero-after]'),
      { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', stagger: 0.1 },
      2.3,
    )
}

/** Con el scroll, la V sube y desaparece y las letras del nombre se dispersan. */
function scatterOnScroll({ gsap }: Motion, { section, edition, chars }: Parts) {
  const scroll = { trigger: section, start: 'top top', end: 'bottom top', scrub: true }
  gsap.to(edition, {
    y: () => -0.6 * window.innerHeight,
    opacity: 0,
    ease: 'power1.in',
    scrollTrigger: { ...scroll, invalidateOnRefresh: true },
  })
  gsap.to(chars, {
    y: (i: number) => -(0.3 + noise(i) * 0.7) * window.innerHeight,
    rotate: (i: number) => (noise(i + 99) - 0.5) * 40,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { ...scroll, invalidateOnRefresh: true },
  })
}

interface HeroTitleProps {
  edition: string
  name: string
}

/**
 * Título del hero: la edición en tamaño gigante (Chillax) y el nombre del
 * congreso al lado. El h1 se lee completo ("V Congreso de…"); las piezas
 * visuales van ocultas a lectores de pantalla.
 */
export function HeroTitle({ edition, name }: HeroTitleProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const editionRef = useRef<HTMLSpanElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    (motion) => {
      const title = titleRef.current
      const editionEl = editionRef.current
      const nameEl = nameRef.current
      const section = title?.closest('section')
      if (!title || !editionEl || !nameEl || !section) return

      const split = motion.SplitText.create(nameEl, { type: 'words,chars', mask: 'chars', aria: 'none' })
      const parts: Parts = { title, section, edition: editionEl, chars: split.chars }
      // Las máscaras solo sirven para la entrada: luego la dispersión debe poder salir de ellas.
      const releaseMasks = () => {
        split.masks.forEach((m) => ((m as HTMLElement).style.overflow = 'visible'))
        if (editionEl.parentElement) editionEl.parentElement.style.overflow = 'visible'
      }

      // Si GSAP llega antes de que arranque el fallback CSS, la intro la lleva JS.
      const curtain = document.querySelector<HTMLElement>('.hero-intro')
      const cssCurtain = curtain?.getAnimations()[0]
      const curtainPending = Number(cssCurtain?.currentTime ?? Infinity) < CURTAIN_FALLBACK_DELAY

      if (curtain && curtainPending) {
        playIntro(motion, parts, curtain, releaseMasks)
      } else {
        motion.gsap
          .timeline({ onComplete: releaseMasks })
          .from(editionEl, { yPercent: 100, duration: 0.9, ease: 'power3.out' })
          .from(split.chars, { yPercent: 100, duration: 0.7, ease: 'power3.out', stagger: 0.025 }, 0.3)
      }

      scatterOnScroll(motion, parts)
    },
    [],
    !reducedMotion,
  )

  return (
    <h1
      ref={titleRef}
      data-reveal=""
      aria-label={`${edition} ${name}`}
      className="flex flex-col gap-2 font-display font-bold lg:flex-row lg:items-end lg:gap-10"
    >
      {/* Máscara de la V: se revela de abajo arriba. */}
      <span aria-hidden className="block overflow-hidden">
        <span
          ref={editionRef}
          className="block text-[clamp(9rem,38svh,28rem)] leading-[0.78] text-acento"
        >
          {edition}
        </span>
      </span>
      <span
        ref={nameRef}
        aria-hidden
        className="block max-w-[13ch] text-[clamp(2.25rem,5vw,4.75rem)] leading-[0.95] text-balance text-texto lg:pb-[0.08em]"
      >
        {name}
      </span>
    </h1>
  )
}
