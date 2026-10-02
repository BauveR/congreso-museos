import { useRef, type CSSProperties } from 'react'
import { RevealText } from '../../../components/RevealText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { useCanHover } from '../../../hooks/useCanHover'
import { useInView } from '../../../hooks/useInView'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { CarouselCard } from './CarouselCard'

/** Segundos que tarda cada tarjeta en recorrer su ancho. */
const SECONDS_PER_ITEM = 5

/**
 * Carrusel infinito con animación CSS (solo transform, en el compositor).
 * La lista se duplica para que el bucle no tenga costura; la copia es
 * inerte y oculta a lectores de pantalla. Se pausa al hover/foco y fuera
 * del viewport. Con reduced motion es una lista con scroll horizontal.
 */
export function Carousel() {
  const { carousel } = site
  const track = useRef<HTMLDivElement>(null)
  const inView = useInView(track)
  const reducedMotion = useReducedMotion()
  const playVideo = useCanHover() && !reducedMotion

  const list = (copy: boolean) => (
    <ul
      aria-label={copy ? undefined : carousel.ariaLabel}
      aria-hidden={copy || undefined}
      inert={copy}
      className="flex shrink-0 gap-4 pr-4 motion-reduce:pl-4 sm:motion-reduce:pl-6 lg:motion-reduce:pl-8"
    >
      {carousel.items.map((item) => (
        <li key={item.name}>
          <CarouselCard item={item} playVideo={playVideo} />
        </li>
      ))}
    </ul>
  )

  return (
    <Section id="ponentes" className="py-24 sm:py-32">
      <div className="wrap">
        <RevealText as="p" className="max-w-3xl text-2xl font-semibold text-balance sm:text-3xl">
          {carousel.bridge}
        </RevealText>
      </div>
      <div ref={track} className="mt-12 overflow-hidden motion-reduce:overflow-x-auto motion-reduce:pb-4">
        <div
          style={{ '--marquee-duration': `${carousel.items.length * SECONDS_PER_ITEM}s` } as CSSProperties}
          className={`flex w-max animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none ${inView ? '' : '[animation-play-state:paused]'}`}
        >
          {list(false)}
          {!reducedMotion && list(true)}
        </div>
      </div>
    </Section>
  )
}
