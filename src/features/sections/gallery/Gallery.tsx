import { PagerArrows } from '../../../components/PagerArrows'
import { site } from '../../../content/site'
import { useScrollPager } from '../../../hooks/useScrollPager'
import { imagekitPicture } from '../../../services/imagekit'

/**
 * Anchos que se piden a ImageKit (móvil, tableta y escritorio/retina). AVIF a
 * calidad 60: la mitad que el WebP que da f-auto (p. ej. 46 KB frente a 131 KB
 * a 1600 px) sin diferencia visible; WebP de respaldo para navegadores sin AVIF.
 */
const WIDTHS = [640, 960, 1280, 1600] as const
const QUALITY = 60
const SIZES = '(min-width: 1024px) min(46rem, 55vw), (min-width: 640px) 60vw, 85vw'

/**
 * Slider de fotos (scroll horizontal nativo con snap, como Participantes):
 * se arrastra con el dedo o el trackpad y nunca se mueve solo; en
 * escritorio, flechas. Imágenes responsive y con carga diferida (salvo la
 * primera), servidas desde ImageKit al ancho justo.
 */
export function Gallery() {
  const { label, prev, next, images } = site.gallery
  const { ref, edges, measure, page } = useScrollPager<HTMLUListElement>()

  return (
    <div className="mt-16 lg:mt-24">
      <div className="wrap flex justify-end">
        <PagerArrows edges={edges} page={page} prevLabel={prev} nextLabel={next} />
      </div>
      <ul
        ref={ref}
        aria-label={label}
        onScroll={measure}
        className="mt-5 flex snap-x snap-mandatory scroll-px-(--wrap-gutter) gap-4 overflow-x-auto overscroll-x-contain px-(--wrap-gutter) pb-4 [scrollbar-width:none] lg:scroll-px-(--wrap-inset) lg:gap-6 lg:px-(--wrap-inset) [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, i) => {
          const picture = imagekitPicture(image.src, WIDTHS, QUALITY)
          return (
            <li key={image.src} className="w-[85vw] shrink-0 snap-start sm:w-[60vw] lg:w-[min(46rem,55vw)]">
              <picture>
                <source type="image/avif" srcSet={picture.avif} sizes={SIZES} />
                <img
                  src={picture.src}
                  srcSet={picture.webp}
                  sizes={SIZES}
                  alt={image.alt}
                  width={1600}
                  height={1067}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  className="aspect-3/2 w-full rounded-2xl bg-superficie object-cover"
                />
              </picture>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
