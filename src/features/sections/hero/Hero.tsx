import { ArrowDown } from 'lucide-react'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'

export function Hero() {
  const { hero } = site
  return (
    <Section id="hero" className="flex min-h-svh flex-col">
      {/* En móvil el texto va abajo para dejar el centro libre al objeto 3D. */}
      <div className="wrap flex flex-1 flex-col justify-end pt-24 pb-28 sm:justify-center sm:pb-24">
        <h1 className="text-5xl leading-none font-bold tracking-tight text-balance sm:text-7xl lg:text-8xl">
          {hero.eventName}
        </h1>
        <p className="mt-6 text-lg text-texto-suave sm:text-xl">
          <time dateTime={hero.dateTime}>{hero.dateLabel}</time>
          <span aria-hidden> · </span>
          {hero.location}
        </p>
      </div>
      <p className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-sm text-texto-suave">
        {hero.scrollHint}
        <ArrowDown aria-hidden className="size-4" />
      </p>
    </Section>
  )
}
