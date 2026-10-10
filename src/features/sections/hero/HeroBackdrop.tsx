import { useRef } from 'react'
import { useMotionEffect } from '../../../app/motion'
import { site } from '../../../content/site'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { imageUrl, responsiveImage } from '../../../services/imagekit'

/** Ancho generado de cada nube (su tamaño real en la ilustración). */
const CLOUD_WIDTH = 600
/** Paisaje: original de 3840 px (franja recortada de 3840×680); el navegador elige el ancho. */
const LANDSCAPE_WIDTHS = [800, 1600, 2400, 3840] as const

/**
 * Posición de cada nube en el lienzo original de 1600×800 (en %), su
 * duración de deriva y hacia dónde se va al hacer scroll.
 */
const CLOUDS = [
  { left: '4.69%', top: '35%', width: '31.56%', duration: '46s', delay: '-12s', exit: -1 },
  { left: '61.25%', top: '20.63%', width: '36.25%', duration: '38s', delay: '-25s', exit: 1 },
] as const

/**
 * Paisaje del hero: imagen fija al pie (sin nubes) y, encima, las dos nubes
 * de la ilustración, que derivan despacio con CSS (animate-cloud) y, al
 * hacer scroll, se apartan hacia los lados y se desvanecen (GSAP, el mismo
 * motor que el resto de la web). Va delante de la esfera y detrás del texto.
 * Con reduced motion: todo quieto.
 */
export function HeroBackdrop() {
  const { landscape, clouds } = site.hero.backdrop
  const root = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    ({ gsap }) => {
      const section = root.current?.closest('section')
      const layers = root.current?.querySelectorAll<HTMLElement>('[data-cloud]')
      if (!section || !layers?.length) return
      layers.forEach((layer) => {
        gsap.to(layer, {
          xPercent: 40 * Number(layer.dataset.cloud),
          yPercent: -30,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
    },
    [],
    !reducedMotion,
  )

  return (
    <div ref={root} data-hero-after="" aria-hidden className="pointer-events-none absolute inset-x-0 bottom-full z-0 aspect-2/1">
      {CLOUDS.map((c, i) => (
        // Capa exterior: la mueve el scroll (data-cloud = hacia qué lado sale); imagen interior: la deriva continua.
        <div key={c.left} data-cloud={c.exit} className="absolute" style={{ left: c.left, top: c.top, width: c.width }}>
          <img
            src={imageUrl(clouds[i] ?? '', CLOUD_WIDTH)}
            alt=""
            decoding="async"
            className="block w-full animate-cloud motion-reduce:animate-none"
            style={{ animationDuration: c.duration, animationDelay: c.delay }}
          />
        </div>
      ))}
      <img
        {...responsiveImage(landscape, LANDSCAPE_WIDTHS)}
        sizes="100vw"
        width={3840}
        height={680}
        alt=""
        decoding="async"
        className="absolute inset-x-0 bottom-0 block h-auto w-full"
      />
    </div>
  )
}
