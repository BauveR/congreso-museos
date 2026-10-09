import { PagerArrows } from '../../../components/PagerArrows'
import { site } from '../../../content/site'
import { useScrollPager } from '../../../hooks/useScrollPager'
import { responsiveImage } from '../../../services/imagekit'

/**
 * Slider de fotos (scroll horizontal nativo con snap, como Participantes):
 * se arrastra con el dedo o el trackpad y nunca se mueve solo; en
 * escritorio, flechas. Imágenes responsive y con carga diferida (salvo la
 * primera); su origen —local o ImageKit— lo decide services/imagekit.ts.
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
        {images.map((image, i) => (
          <li key={image.file} className="w-[85vw] shrink-0 snap-start sm:w-[60vw] lg:w-[min(46rem,55vw)]">
            <img
              {...responsiveImage(image.file)}
              sizes="(min-width: 1024px) min(46rem, 55vw), (min-width: 640px) 60vw, 85vw"
              alt={image.alt}
              width={1600}
              height={1067}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              className="aspect-3/2 w-full rounded-2xl bg-superficie object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
