import { useRef } from 'react'
import { useMotionEffect, type Motion } from '../../../app/motion'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/** Retardo (ms) del fallback CSS de la cortina (.hero-intro en index.css). */
const CURTAIN_FALLBACK_DELAY = 4000

/**
 * Posición de las letras gigantes de la intro (esquina superior izquierda),
 * en dos filas desplazadas como en lenis.dev.
 */
const INTRO_LETTERS = [
  { left: '5vw', top: '14svh' },
  { left: '52vw', top: '9svh' },
  { left: '24vw', top: '52svh' },
  { left: '70vw', top: '47svh' },
]

/** Pseudoaleatorio estable por índice (misma dispersión en cada carga). */
const noise = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

interface Parts {
  section: Element
  layer: HTMLElement
  title: HTMLElement
  chars: HTMLElement[]
  after: NodeListOf<Element>
}

/**
 * Intro estilo lenis.dev:
 * 1. Pantalla lima (cortina de index.html) y cuatro letras gigantes en
 *    distintas posiciones se revelan de abajo arriba. La capa usa
 *    `mix-blend-mode: difference`: lima sobre lima se ve oscuro.
 * 2. La cortina se retira y las letras pasan a lima sobre el fondo oscuro.
 * 3. Las cuatro convergen hacia la primera letra del wordmark (FLIP); tres se
 *    desvanecen y la cuarta aterriza en su sitio. Entra el resto del texto y
 *    después la línea de fecha y la fila inferior.
 */
function playIntro({ gsap }: Motion, { layer, title, chars, after }: Parts, curtain: HTMLElement, onDone: () => void) {
  const wrappers = [...layer.children] as HTMLElement[]
  const glyphs = wrappers.map((w) => w.firstElementChild as HTMLElement)
  const [first, ...rest] = chars
  if (!first) return

  curtain.style.animation = 'none'
  gsap.set(first, { opacity: 0 })

  const target = () => first.getBoundingClientRect()
  const ratio = () => parseFloat(getComputedStyle(title).fontSize) / parseFloat(getComputedStyle(glyphs[0]!).fontSize)

  gsap
    .timeline({
      onComplete: () => {
        curtain.style.visibility = 'hidden'
        onDone()
      },
    })
    .from(glyphs, { yPercent: 100, duration: 1, ease: 'power3.out', stagger: 0.12 }, 0)
    .fromTo(
      curtain,
      { clipPath: 'inset(0% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'power4.inOut' },
      1,
    )
    // Sin cortina ya no hace falta el blend (así el color final es el lima exacto).
    .set(layer, { mixBlendMode: 'normal' }, 1.9)
    .to(
      wrappers,
      {
        x: (_: number, el: HTMLElement) => target().left - el.getBoundingClientRect().left,
        y: (_: number, el: HTMLElement) => target().top - el.getBoundingClientRect().top,
        scale: ratio,
        transformOrigin: '0 0',
        duration: 1.1,
        ease: 'power3.inOut',
      },
      1.9,
    )
    .to(wrappers.slice(1), { opacity: 0, duration: 0.6, ease: 'power1.in' }, 2.2)
    .set(first, { opacity: 1 }, 3)
    .set(layer, { display: 'none' }, 3)
    .from(rest, { yPercent: 100, duration: 0.7, ease: 'power3.out', stagger: 0.02 }, 2.95)
    .from(after, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, 3.3)
}

/** Con el scroll, cada letra del wordmark sube a su velocidad y desaparece. */
function scatterOnScroll({ gsap }: Motion, { section, chars }: Parts) {
  gsap.to(chars, {
    y: (i: number) => -(0.3 + noise(i) * 0.7) * window.innerHeight,
    rotate: (i: number) => (noise(i + 99) - 0.5) * 40,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
  })
}

interface HeroWordmarkProps {
  edition: string
  name: string
}

/**
 * Wordmark del hero en una sola línea a todo el ancho (desde md; en móvil se
 * parte en varias líneas). El tamaño usa `cqw`: el contenedor padre debe
 * tener `@container`. 19,7 ≈ ancho del texto en mayúsculas en em con Chillax Bold (19,56) más
 * margen de seguridad; recalcular si cambia el texto.
 */
export function HeroWordmark({ edition, name }: HeroWordmarkProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    (motion) => {
      const title = titleRef.current
      const layer = layerRef.current
      const section = title?.closest('section')
      if (!title || !layer || !section) return

      const split = motion.SplitText.create(title, { type: 'words,chars', mask: 'chars' })
      const parts: Parts = {
        section,
        layer,
        title,
        chars: split.chars as HTMLElement[],
        after: section.querySelectorAll('[data-hero-after]'),
      }
      // Las máscaras solo sirven para la entrada: luego la dispersión debe poder salir de ellas.
      const releaseMasks = () => split.masks.forEach((m) => ((m as HTMLElement).style.overflow = 'visible'))

      // Si GSAP llega antes de que arranque el fallback CSS, la intro la lleva JS.
      const curtain = document.querySelector<HTMLElement>('.hero-intro')
      const curtainPending = Number(curtain?.getAnimations()[0]?.currentTime ?? Infinity) < CURTAIN_FALLBACK_DELAY

      if (curtain && curtainPending) {
        playIntro(motion, parts, curtain, releaseMasks)
      } else {
        layer.style.display = 'none'
        motion.gsap
          .timeline({ onComplete: releaseMasks })
          .from(parts.chars, { yPercent: 100, duration: 0.7, ease: 'power3.out', stagger: 0.02 })
          .from(parts.after, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, 0.3)
      }

      scatterOnScroll(motion, parts)
    },
    [],
    !reducedMotion,
  )

  return (
    <>
      {/* Letras gigantes de la intro: capa fija sobre la cortina (z 70). */}
      <div
        ref={layerRef}
        aria-hidden
        data-reveal=""
        className="pointer-events-none fixed inset-0 z-[80] mix-blend-difference motion-reduce:hidden"
      >
        {INTRO_LETTERS.map((position) => (
          <span key={position.left} className="absolute block overflow-hidden" style={position}>
            <span className="block font-display text-[min(42svh,30vw)] leading-[0.9] font-bold tracking-[-0.02em] text-acento">
              {edition}
            </span>
          </span>
        ))}
      </div>

      <h1
        ref={titleRef}
        data-reveal=""
        className="font-display text-[clamp(2.25rem,11vw,5rem)] leading-[0.9] font-bold tracking-[-0.02em] text-balance text-acento uppercase md:text-[calc(100cqw/19.7)] md:whitespace-nowrap"
      >
        {edition} {name}
      </h1>
    </>
  )
}
