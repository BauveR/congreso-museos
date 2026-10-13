import { ButtonLink } from '../../../components/ButtonLink'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { HeroBackdrop } from './HeroBackdrop'
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
    <Section id="hero" className="flex min-h-[calc(var(--svh)*100)] flex-col pt-20 pb-8">
      <div className="edge relative z-10 @container">
        {/* Logo del congreso sobre el lema. Decorativo: el h1 ya anuncia el nombre.
            WebP sin pérdida (10,7 KB frente a 28,8 KB del PNG original). */}
        <img
          data-hero-after=""
          src="/media/logo-congreso.webp"
          alt=""
          width={1176}
          height={484}
          className="mb-6 h-auto w-[min(48vw,16rem)] lg:mb-6 lg:w-[min(19.2rem,calc(var(--svh)*30))]"
        />
        <HeroWordmark edition={hero.edition} name={hero.eventName} headline={hero.headline} />
        <div className="mt-[calc(var(--svh)*5)] flex flex-col gap-6">
          <p data-hero-after="" className="font-display text-[clamp(0.875rem,1.2vw,1.3rem)] leading-tight font-bold uppercase">
            {hero.location}, <time dateTime={hero.dateTime}>{hero.dateLabel}</time>
          </p>
        </div>
      </div>

      <div className="mt-auto pt-8">
        {/* Paisaje con nubes, apoyado justo encima de los botones: delante de la esfera y detrás del texto (z-10). */}
        <div className="relative">
          <HeroBackdrop />
          <div className="edge relative z-10 grid gap-6 lg:grid-cols-[auto_auto] lg:items-end lg:justify-between lg:gap-16">
            <div data-hero-after="" className="order-last lg:order-none">
              <ScrollHint lines={hero.scrollHint} />
            </div>
            <div data-hero-after="" className="flex flex-col gap-3 sm:flex-row">
              {hero.ctas.map((cta, i) => (
                <ButtonLink key={cta.href} href={cta.href} variant={i === 0 ? 'primary' : 'secondary'} className="xl:min-w-72">
                  {cta.label}
                </ButtonLink>
              ))}
            </div>
          </div>
          {/* Instituciones: línea de logos bajo los botones. */}
          <ul data-hero-after="" aria-label={hero.logosLabel} className="edge relative z-10 mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 lg:mt-6 lg:gap-x-10">
            {hero.logos.map((logo) => (
              <li key={logo.src}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  loading="lazy"
                  decoding="async"
                  className={`w-auto ${logo.size === 'lg' ? 'h-[3.3rem] lg:h-[3.6rem]' : 'h-[1.8rem] lg:h-[2.1rem]'}`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
