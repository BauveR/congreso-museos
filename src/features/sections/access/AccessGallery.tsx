import { PagerArrows } from '../../../components/PagerArrows'
import { site } from '../../../content/site'
import { useScrollPager } from '../../../hooks/useScrollPager'
import { imagekitPicture } from '../../../services/imagekit'

/** Anchos pedidos a ImageKit: la columna mide como mucho ~36rem (retina incluida). AVIF a calidad 60, como la galería. */
const WIDTHS = [480, 720, 960, 1200] as const
const QUALITY = 60
const SIZES = '(min-width: 1024px) min(36rem, 38vw), 100vw'

/**
 * Slider de fotos de los alegatorios en el hueco bajo el título de la
 * inscripción (solo escritorio): una foto cada vez, con scroll horizontal
 * nativo y snap y flechas, sin pie de foto. Mismo patrón
 * que la galería: se arrastra y nunca se mueve solo.
 */
export function AccessGallery() {
  const { label, prev, next, photos } = site.access.gallery
  const { ref, edges, measure, page } = useScrollPager<HTMLUListElement>()

  return (
    <div>
      <ul
        ref={ref}
        aria-label={label}
        onScroll={measure}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo) => {
          const picture = imagekitPicture(photo.src, WIDTHS, QUALITY)
          return (
            <li key={photo.src} className="w-full shrink-0 snap-start">
              <picture>
                <source type="image/avif" srcSet={picture.avif} sizes={SIZES} />
                <img
                  src={picture.src}
                  srcSet={picture.webp}
                  sizes={SIZES}
                  alt={photo.alt}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="aspect-4/3 w-full rounded-2xl bg-superficie object-cover"
                />
              </picture>
            </li>
          )
        })}
      </ul>
      <PagerArrows edges={edges} page={page} prevLabel={prev} nextLabel={next} className="mt-5" />
    </div>
  )
}
