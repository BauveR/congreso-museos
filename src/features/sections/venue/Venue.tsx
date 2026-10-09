import { MapPin } from 'lucide-react'
import { ButtonLink } from '../../../components/ButtonLink'
import { DisplayHeading } from '../../../components/DisplayHeading'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { mapsUrl } from '../../../../shared/event'

/**
 * Sede: una tarjeta con la foto (WebP en dos tamaños, carga diferida), la
 * dirección, «Cómo llegar» (Google Maps) y la web del hotel, ambos en otra pestaña. Escritorio: foto a
 * la izquierda y texto a la derecha; móvil: una columna.
 */
export function Venue() {
  const { title, name, address, link, directions, image } = site.venue
  const directionsUrl = mapsUrl(directions.mapsQuery)
  return (
    <Section id="sede" className="py-24 sm:py-32">
      <div className="wrap">
        <DisplayHeading>{title}</DisplayHeading>

        <article className="mt-10 grid overflow-hidden rounded-3xl border border-borde bg-superficie lg:mt-14 lg:grid-cols-2">
          <img
            src={image.src}
            srcSet={`${image.srcSmall} ${image.widthSmall}w, ${image.src} ${image.width}w`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
            className="aspect-3/2 size-full object-cover"
          />
          <div className="flex flex-col justify-center gap-6 p-6 sm:p-10">
            <div>
              <h3 className="font-display text-3xl leading-tight font-semibold lg:text-4xl">{name}</h3>
              <address className="mt-4 flex gap-2 leading-relaxed text-texto-suave not-italic">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-acento-texto" />
                <span>
                  {address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </address>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={directionsUrl} target="_blank" rel="noopener noreferrer" icon="map">
                {directions.label}
                <span className="sr-only"> (Google Maps, se abre en otra pestaña)</span>
              </ButtonLink>
              <ButtonLink href={link.href} target="_blank" rel="noopener noreferrer" icon="arrow" variant="secondary">
                {link.label}
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </ButtonLink>
            </div>
          </div>
        </article>
      </div>
    </Section>
  )
}
