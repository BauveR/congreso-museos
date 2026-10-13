import { useRef } from 'react'
import { useMotionEffect } from '../../../app/motion'
import { site } from '../../../content/site'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import { imagekitPicture, withTransform } from '../../../services/imagekit'

/**
 * Nubes desde ImageKit en PNG forzado: con su grano suave, el PNG que
 * optimiza ImageKit pesa menos que el WebP que daría f-auto (12 y 24 KB
 * frente a 35 y 45). En móvil, versión de 300 px (4 KB).
 */
const cloudSrcSet = (url: string, nativeWidth: number) =>
  `${withTransform(url, 'w-300,f-png')} 300w, ${withTransform(url, 'f-png')} ${nativeWidth}w`
/**
 * Paisaje desde ImageKit (original de 4542×1141). Anchos escalonados para
 * no descargar de más; tope en 2560 (decorativo: en 4K se amplía sin que se
 * note). Calidad 45 en AVIF: sin diferencia visible con el grano del dibujo.
 */
const LANDSCAPE_WIDTHS = [640, 960, 1280, 1920, 2560] as const
const LANDSCAPE_QUALITY = 45
/** En escritorio la ilustración ocupa el 70 % del ancho (lg:inset-x-[15%]): se pide la imagen a ese tamaño. */
const DESKTOP_SCALE = 0.7
const LANDSCAPE_SIZES = `(min-width: 64rem) ${DESKTOP_SCALE * 100}vw, 100vw`

/**
 * Posición de cada nube en el lienzo original de 1600×800 (en %), su
 * duración de deriva y hacia dónde se va al hacer scroll.
 */
const CLOUDS = [
  { left: '4.69%', top: '35%', width: '31.56%', px: 505, duration: '46s', delay: '-12s', exit: -1 },
  { left: '61.25%', top: '20.63%', width: '36.25%', px: 580, duration: '38s', delay: '-25s', exit: 1 },
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
  const picture = imagekitPicture(landscape, LANDSCAPE_WIDTHS, LANDSCAPE_QUALITY)
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
    <div ref={root} data-hero-after="" aria-hidden className="pointer-events-none absolute inset-x-0 bottom-full z-0 aspect-2/1 lg:inset-x-[15%]">
      {CLOUDS.map((c, i) => (
        // Capa exterior: la mueve el scroll (data-cloud = hacia qué lado sale); imagen interior: la deriva continua.
        <div key={c.left} data-cloud={c.exit} className="absolute" style={{ left: c.left, top: c.top, width: c.width }}>
          <img
            src={withTransform(clouds[i] ?? '', 'f-png')}
            srcSet={cloudSrcSet(clouds[i] ?? '', c.px)}
            sizes={`(min-width: 64rem) calc(${c.width.replace('%', 'vw')} * ${DESKTOP_SCALE}), ${c.width.replace('%', 'vw')}`}
            alt=""
            decoding="async"
            className="block w-full animate-cloud motion-reduce:animate-none"
            style={{ animationDuration: c.duration, animationDelay: c.delay }}
          />
        </div>
      ))}
      <picture>
        <source type="image/avif" srcSet={picture.avif} sizes={LANDSCAPE_SIZES} />
        <img
          src={picture.src}
          srcSet={picture.webp}
          sizes={LANDSCAPE_SIZES}
          width={4542}
          height={1141}
          alt=""
          decoding="async"
          className="absolute inset-x-0 bottom-0 block h-auto w-full"
        />
      </picture>
    </div>
  )
}
