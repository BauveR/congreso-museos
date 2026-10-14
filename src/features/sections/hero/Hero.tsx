import { ButtonLink } from '../../../components/ButtonLink'
import { InstitutionLogos } from '../../../components/InstitutionLogos'
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
          className="mb-4 h-auto w-[min(40vw,16rem)] sm:mb-6 lg:w-[min(19.2rem,calc(var(--svh)*30))]"
        />
        <HeroWordmark edition={hero.edition} name={hero.eventName} headline={hero.headline} />
        <div className="mt-[calc(var(--svh)*5)] flex flex-col gap-6">
          <p data-hero-after="" className="font-display text-[clamp(0.875rem,1.2vw,1.3rem)] leading-tight font-bold uppercase">
            <span className="block">{hero.location}</span>
            <time dateTime={hero.dateTime} className="block">
              {hero.dateLabel}
            </time>
          </p>
        </div>
      </div>

      <div className="mt-auto pt-8">
        {/* Paisaje con nubes, apoyado justo encima de los botones: delante de la esfera y detrás del texto (z-10). */}
        <div className="relative">
          <HeroBackdrop />
          <div className="edge relative z-10 grid gap-6 lg:grid-cols-[auto_auto] lg:items-end lg:justify-between lg:gap-16">
            {/* En móvil sin «Desliza para explorar»: el gesto es natural y así los logos caben en la primera pantalla. */}
            <div data-hero-after="" className="order-last hidden sm:block lg:order-none">
              <ScrollHint lines={hero.scrollHint} />
            </div>
            {/* Móvil: los dos botones en una fila (mitad y mitad, sin ancho mínimo); desde sm, como antes. */}
            <div data-hero-after="" className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
              {hero.ctas.map((cta, i) => (
                <ButtonLink
                  key={cta.href}
                  href={cta.href}
                  variant={i === 0 ? 'primary' : 'secondary'}
                  className="max-sm:min-w-0 max-sm:px-3 xl:min-w-72"
                >
                  {cta.label}
                </ButtonLink>
              ))}
            </div>
          </div>
          {/* Instituciones: línea de logos bajo los botones. */}
          <InstitutionLogos oneRowMobile data-hero-after="" className="edge relative z-10 mt-5 sm:mt-6" />
        </div>
      </div>
    </Section>
  )
}
