import { ButtonLink } from '../../../components/ButtonLink'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { HeroWordmark } from './HeroWordmark'
import { ScrollHint } from './ScrollHint'

/**
 * Hero con la composición de lenis.dev: wordmark a todo el ancho arriba,
 * línea grande alineada a la derecha y fila inferior con indicador de
 * scroll, texto descriptivo y botones. El 3D queda detrás, abajo.
 */
export function Hero() {
  const { hero } = site
  return (
    <Section id="hero" className="flex min-h-svh flex-col pt-20 pb-8">
      <div className="edge @container">
        <HeroWordmark edition={hero.edition} name={hero.eventName} lines={hero.eventNameLines} />
        <p
          data-hero-after=""
          className="mt-[6svh] text-right font-display text-[clamp(1rem,2vw,2.25rem)] leading-none font-bold uppercase"
        >
          <time dateTime={hero.dateTime}>{hero.dateLabel}</time>
          <span aria-hidden> · </span>
          {hero.location}
        </p>
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
