import { useRef } from 'react'
import { useMotionEffect, type Motion } from '../../../app/motion'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { IntroMark } from '../../../components/IntroMark'

/** Retardo (ms) del fallback CSS de la cortina (.hero-intro en index.css). */
const CURTAIN_FALLBACK_DELAY = 4000

/** Escritura del texto de presentación: pausa máx. entre palabras y duración total (s). */
const TYPE_STAGGER = 0.035
const TYPE_TOTAL = 2.5

/**
 * Posición de los símbolos gigantes de la intro (esquina superior izquierda),
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
 * 1. Cortina (index.html, color --color-intro) y cuatro símbolos del
 *    congreso gigantes en distintas posiciones (--color-intro-letra) se
 *    revelan de abajo arriba.
 * 2. La cortina se retira hacia arriba y descubre el hero oscuro.
 * 3. Las cuatro convergen hacia la primera letra del wordmark (FLIP) mientras
 *    pasan al color del wordmark; tres se desvanecen y la cuarta aterriza en
 *    su sitio. Entra el resto del texto y después la fecha y la fila inferior.
 */
function playIntro({ gsap }: Motion, { layer, title, chars, after }: Parts, curtain: HTMLElement, onDone: () => void) {
  const wrappers = [...layer.children] as HTMLElement[]
  const glyphs = wrappers.map((w) => w.firstElementChild as HTMLElement)
  const [first] = chars
  if (!first) return

  curtain.style.animation = 'none'

  const target = () => first.getBoundingClientRect()
  const titleColor = getComputedStyle(title).color
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
    // Pasan al color del wordmark para que la que aterriza no cambie de golpe.
    .to(glyphs, { color: titleColor, duration: 1.1, ease: 'power2.inOut' }, 1.9)
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
    // Tres se desvanecen por el camino; la última, al llegar, se funde con el titular que aparece.
    .to(wrappers.slice(1), { opacity: 0, duration: 0.6, ease: 'power1.in' }, 2.2)
    .to(wrappers[0]!, { opacity: 0, duration: 0.4, ease: 'power1.out' }, 2.85)
    .set(layer, { display: 'none' }, 3.25)
    .from(chars, { yPercent: 100, duration: 0.7, ease: 'power3.out', stagger: 0.012 }, 2.85)
    .from(after, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, 3.3)
}

/**
 * Con el scroll, cada letra del titular sube a su velocidad y desaparece; al
 * volver arriba reaparece. Se crea al terminar la entrada y con punto de
 * partida explícito, para que su inicio sea siempre "letra en su sitio y visible".
 */
function scatterOnScroll({ gsap }: Motion, { section, chars }: Parts) {
  gsap.fromTo(
    chars,
    { y: 0, rotate: 0, opacity: 1 },
    {
      y: (i: number) => -(0.3 + noise(i) * 0.7) * window.innerHeight,
      rotate: (i: number) => (noise(i + 99) - 0.5) * 40,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    },
  )
}

interface HeroWordmarkProps {
  /** Edición ("V"), para el nombre accesible del h1. */
  edition: string
  /** Nombre del congreso, para el nombre accesible del h1. */
  name: string
  headline: string
}

/**
 * Titular del hero (lema del congreso) en una sola línea desde md, al 70 %
 * del ancho; en móvil se parte en varias líneas. El tamaño usa `cqw` (el
 * contenedor padre debe tener `@container`): el lema mide 26,23 em en Kola
 * Regular mayúsculas, 26,6 deja margen. Recalcular si cambia el texto.
 * El h1 se anuncia como "V Congreso de Museos de Canarias. <lema>".
 */
export function HeroWordmark({ edition, name, headline }: HeroWordmarkProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    (motion) => {
      const title = titleRef.current
      const layer = layerRef.current
      const section = title?.closest('section')
      if (!title || !layer || !section) return

      const split = motion.SplitText.create(title, { type: 'words,chars', mask: 'chars', aria: 'hidden' })
      const parts: Parts = {
        section,
        layer,
        title,
        chars: split.chars as HTMLElement[],
        after: section.querySelectorAll('[data-hero-after]'),
      }
      // Texto de presentación: oculto palabra a palabra hasta que se «escribe».
      const typeWords = Array.from(section.querySelectorAll('[data-hero-type] p')).flatMap(
        (p) => motion.SplitText.create(p, { type: 'words' }).words,
      )
      motion.gsap.set(typeWords, { opacity: 0 })
      const typeIn = () =>
        motion.gsap.to(typeWords, {
          opacity: 1,
          duration: 0.2,
          ease: 'none',
          // Ritmo de escritura con un total acotado, sea cual sea la longitud.
          stagger: Math.min(TYPE_STAGGER, TYPE_TOTAL / Math.max(typeWords.length, 1)),
        })

      // Las máscaras solo sirven para la entrada: luego la dispersión debe poder salir de ellas.
      const releaseMasks = () => split.masks.forEach((m) => ((m as HTMLElement).style.overflow = 'visible'))

      // Si GSAP llega antes de que arranque el fallback CSS, la intro la lleva JS.
      const curtain = document.querySelector<HTMLElement>('.hero-intro')
      const curtainPending = Number(curtain?.getAnimations()[0]?.currentTime ?? Infinity) < CURTAIN_FALLBACK_DELAY

      // La dispersión se crea al terminar la entrada: así su estado inicial es
      // el definitivo (todas las letras visibles) y al volver arriba se recupera.
      const finish = () => {
        releaseMasks()
        scatterOnScroll(motion, parts)
        typeIn()
      }

      if (curtain && curtainPending) {
        playIntro(motion, parts, curtain, finish)
      } else {
        layer.style.display = 'none'
        motion.gsap
          .timeline({ onComplete: finish })
          .from(parts.chars, { yPercent: 100, duration: 0.7, ease: 'power3.out', stagger: 0.02 })
          .from(parts.after, { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, 0.3)
      }
    },
    [],
    !reducedMotion,
  )

  return (
    <>
      {/* Símbolos gigantes de la intro: capa fija sobre la cortina (z 70). El tamaño de
          fuente del span manda (la animación escala por la proporción de fuentes). */}
      <div
        ref={layerRef}
        aria-hidden
        data-reveal=""
        className="pointer-events-none fixed inset-0 z-[80] motion-reduce:hidden"
      >
        {INTRO_LETTERS.map((position) => (
          <span key={position.left} className="absolute block overflow-hidden" style={position}>
            <span className="block text-[min(42svh,30vw)] leading-none text-intro-letra">
              <IntroMark className="block h-[0.7em] w-auto" />
            </span>
          </span>
        ))}
      </div>

      <h1
        ref={titleRef}
        data-reveal=""
        aria-label={`${edition} ${name}. ${headline}`}
        className="font-wordmark text-[clamp(1.225rem,5.6vw,2.1rem)] leading-[0.95] font-normal tracking-[-0.02em] text-balance text-acento uppercase md:text-[calc(70cqw/26.6)] md:whitespace-nowrap"
      >
        {headline}
      </h1>
    </>
  )
}
