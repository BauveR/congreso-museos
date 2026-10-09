import { ButtonLink } from '../../../components/ButtonLink'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { HeroWordmark } from './HeroWordmark'
import { ScrollHint } from './ScrollHint'

/**
 * Hero con la composición de lenis.dev: wordmark a todo el ancho arriba,
 * lugar y fecha a la izquierda (la presentación va en su propia sección,
 * debajo), y fila inferior con
 * indicador de scroll y botones. El 3D queda detrás, abajo.
 */
export function Hero() {
  const { hero } = site
  return (
    <Section id="hero" className="flex min-h-svh flex-col pt-20 pb-8">
      <div className="edge @container">
        {/* Logo del congreso sobre el lema. Decorativo: el h1 ya anuncia el nombre.
            WebP sin pérdida (10,7 KB frente a 28,8 KB del PNG original). */}
        <img
          data-hero-after=""
          src="/media/logo-congreso.webp"
          alt=""
          width={1176}
          height={484}
          className="mb-6 h-auto w-[min(48vw,16rem)] lg:mb-8 lg:w-[19.2rem]"
        />
        <HeroWordmark edition={hero.edition} name={hero.eventName} headline={hero.headline} />
        <div className="mt-[5svh] flex flex-col gap-6">
          <p data-hero-after="" className="font-display text-[clamp(1rem,1.6vw,1.75rem)] leading-tight font-bold uppercase">
            {hero.location}, <time dateTime={hero.dateTime}>{hero.dateLabel}</time>
          </p>
        </div>
      </div>

      <div className="edge mt-auto grid gap-6 pt-12 lg:grid-cols-[auto_auto] lg:items-end lg:justify-between lg:gap-16">
        <div data-hero-after="" className="order-last lg:order-none">
          <ScrollHint lines={hero.scrollHint} />
        </div>
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
