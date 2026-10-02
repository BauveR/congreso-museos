import { RevealText } from '../../../components/RevealText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { imageUrl } from '../../../services/imagekit'

/** Fase 2: lista horizontal estática. El bucle infinito y el video al hover llegan en la fase 5. */
export function Carousel() {
  const { carousel } = site
  return (
    <Section id="ponentes" className="py-24 sm:py-32">
      <div className="wrap">
        <RevealText as="p" className="max-w-3xl text-2xl font-semibold text-balance sm:text-3xl">
          {carousel.bridge}
        </RevealText>
      </div>
      <div className="mt-12 overflow-x-auto pb-4">
        <ul aria-label={carousel.ariaLabel} className="flex w-max gap-4 px-4 sm:px-6 lg:px-8">
          {carousel.items.map((item) => (
            <li key={item.name} className="w-56 shrink-0 sm:w-64">
              <figure>
                <img
                  src={imageUrl(item.image.src)}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  loading="lazy"
                  decoding="async"
                  className="aspect-3/4 w-full rounded-2xl object-cover"
                />
                <figcaption className="mt-3">
                  <span className="block font-semibold">{item.name}</span>
                  <span className="block text-sm text-texto-suave">{item.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
