import { ButtonLink } from '../../../components/ButtonLink'
import { ExpandableText } from '../../../components/ExpandableText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { HeroWordmark } from './HeroWordmark'
import { ScrollHint } from './ScrollHint'

/**
 * Hero con la composición de lenis.dev: wordmark a todo el ancho arriba,
 * lugar, fecha y presentación a la izquierda, y fila inferior con
 * indicador de scroll, texto descriptivo y botones. El 3D queda detrás, abajo.
 */
export function Hero() {
  const { hero } = site
  return (
    <Section id="hero" className="flex min-h-svh flex-col pt-20 pb-8">
      <div className="edge @container">
        <HeroWordmark edition={hero.edition} name={hero.eventName} headline={hero.headline} />
        <div className="mt-[5svh] flex flex-col gap-6">
          <p data-hero-after="" className="font-display text-[clamp(1rem,1.6vw,1.75rem)] leading-tight font-bold uppercase">
            {hero.location}, <time dateTime={hero.dateTime}>{hero.dateLabel}</time>
          </p>
          {/* Presentación a la izquierda y a medida de lectura, sin caja. En
              móvil, primer párrafo + «Leer más»; en escritorio, completa.
              data-hero-type: se escribe palabra a palabra al acabar la intro (HeroWordmark). */}
          <div data-hero-type="" className="max-w-prose text-lg leading-relaxed text-pretty text-texto">
            <ExpandableText paragraphs={hero.intro} />
          </div>
        </div>
      </div>

      <div className="edge mt-auto grid gap-6 pt-12 lg:grid-cols-[auto_1fr_auto] lg:items-end lg:gap-16">
        <div data-hero-after="" className="order-last lg:order-none">
          <ScrollHint lines={hero.scrollHint} />
        </div>
        <p data-hero-after="" className="text-xs leading-tight font-bold tracking-wide text-texto-suave uppercase">
          {hero.descriptor[0]}
          <br />
          {hero.descriptor[1]}
        </p>
        <div data-hero-after="" className="flex flex-col gap-3 sm:flex-row">
          {hero.ctas.map((cta, i) => (
            <ButtonLink
              key={cta.href}
              href={cta.href}
              icon={cta.icon}
              variant={i === 0 ? 'primary' : 'secondary'}
              className="xl:min-w-72"
            >
              {cta.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </Section>
  )
}
