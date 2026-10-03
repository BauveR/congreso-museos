import { useRef, type CSSProperties } from 'react'
import { useMotionEffect } from '../../../app/motion'
import { RevealText } from '../../../components/RevealText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { useCanHover } from '../../../hooks/useCanHover'
import { useEnhancedMotion } from '../../../hooks/useEnhancedMotion'
import { useInView } from '../../../hooks/useInView'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { CarouselCard } from './CarouselCard'

/** Segundos que tarda cada tarjeta en recorrer su ancho (modo bucle). */
const SECONDS_PER_ITEM = 5

/**
 * Tres modos según dispositivo:
 * - Escritorio: la sección se fija y el scroll vertical desplaza la fila en horizontal.
 * - Móvil: bucle infinito con animación CSS (lista duplicada e inerte), pausa en hover/foco/fuera de vista.
 * - Reduced motion: lista con scroll horizontal nativo.
 */
export function Carousel() {
  const { carousel } = site
  const stage = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const inView = useInView(track)
  const reducedMotion = useReducedMotion()
  const pinned = useEnhancedMotion()
  const playVideo = useCanHover() && !reducedMotion

  useMotionEffect(
    ({ gsap, ScrollTrigger }) => {
      const stageEl = stage.current
      const trackEl = track.current
      if (!stageEl || !trackEl) return
      const distance = () => Math.max(0, trackEl.scrollWidth - stageEl.clientWidth)
      gsap.to(trackEl, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: stageEl,
          pin: true,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      // El pin añade altura: recolocar el resto de triggers en orden de página.
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    },
    [pinned],
    pinned,
  )

  const list = (copy: boolean) => (
    <ul
      aria-label={copy ? undefined : carousel.ariaLabel}
      aria-hidden={copy || undefined}
      inert={copy}
      className="flex shrink-0 gap-4 pr-4 motion-reduce:pl-4 sm:motion-reduce:pl-6 lg:pr-8 lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]"
    >
      {carousel.items.map((item) => (
        <li key={item.name}>
          <CarouselCard item={item} playVideo={playVideo} />
        </li>
      ))}
    </ul>
  )

  const marquee = !pinned && !reducedMotion

  return (
    <Section id="ponentes" className={pinned ? '' : 'py-24 sm:py-32'}>
      <div ref={stage} className={pinned ? 'flex h-svh flex-col justify-center overflow-hidden' : ''}>
        <div className="wrap">
          <RevealText as="p" className="max-w-3xl text-2xl font-semibold text-balance sm:text-3xl">
            {carousel.bridge}
          </RevealText>
        </div>
        <div className="mt-12 overflow-hidden motion-reduce:overflow-x-auto motion-reduce:pb-4">
          <div
            ref={track}
            style={
              marquee
                ? ({ '--marquee-duration': `${carousel.items.length * SECONDS_PER_ITEM}s` } as CSSProperties)
                : undefined
            }
            className={`flex w-max ${marquee ? `animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] ${inView ? '' : '[animation-play-state:paused]'}` : ''}`}
          >
            {list(false)}
            {marquee && list(true)}
          </div>
        </div>
      </div>
    </Section>
  )
}
