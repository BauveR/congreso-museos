import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { HeroTitle } from './HeroTitle'
import { ScrollHint } from './ScrollHint'

export function Hero() {
  const { hero } = site
  return (
    <Section id="hero" className="flex min-h-svh flex-col">
      {/* Hasta lg (mismo breakpoint que el 3D, useBreakpoint) el texto va abajo
          para dejar libre la parte superior al objeto centrado. */}
      <div className="wrap flex flex-1 flex-col justify-end pt-24 pb-28 lg:justify-center lg:pb-24">
        <HeroTitle edition={hero.edition} name={hero.eventName} />
        <p data-hero-after="" className="mt-6 text-lg text-texto-suave sm:text-xl">
          <time dateTime={hero.dateTime}>{hero.dateLabel}</time>
          <span aria-hidden> · </span>
          {hero.location}
        </p>
      </div>
      <div data-hero-after="" className="absolute inset-x-0 bottom-8">
        <div className="wrap">
          <ScrollHint lines={hero.scrollHint} />
        </div>
      </div>
    </Section>
  )
}
