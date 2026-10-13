import { DisplayHeading } from '../../../components/DisplayHeading'
import { EnterFromSide } from '../../../components/EnterFromSide'
import { Expandable, ExpandableText } from '../../../components/ExpandableText'
import { RichText } from '../../../components/RichText'
import { ScrollLit } from '../../../components/ScrollLitText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import type { OrganizationCard, RichBlock } from '../../../content/types'
import { imagekitPicture } from '../../../services/imagekit'

function Card({ card }: { card: OrganizationCard }) {
  return (
    <article className="rounded-2xl border border-borde bg-superficie p-6 sm:p-8">
      {card.kicker && <p className="mb-2 text-xs font-bold tracking-wide text-salvia-texto uppercase">{card.kicker}</p>}
      <h4 className="text-2xl leading-tight font-bold text-balance">{card.title}</h4>
      {card.lead && <p className="mt-3 leading-relaxed font-semibold text-pretty">{card.lead}</p>}
      {card.body && (
        <div className="mt-4 flex flex-col gap-4 leading-relaxed text-pretty text-texto-suave">
          {card.body.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      )}
      {card.groups && (
        <div className="mt-6 flex flex-col gap-6">
          {card.groups.map((group) => (
            <div key={group.title}>
              <h5 className="leading-snug font-semibold text-pretty">{group.title}</h5>
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 leading-relaxed text-texto-suave marker:text-salvia">
                {group.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </article>
  )
}

/**
 * Ilustración de la cabecera: en escritorio, en el hueco a la derecha del
 * texto; en móvil, centrada bajo él y más pequeña.
 * Al llegar a la sección entra deslizándose desde fuera de la página (por la
 * derecha) hasta su sitio, una vez. Con reduced
 * motion, quieta. Oculta para lectores de pantalla (decorativa).
 */
function Art() {
  const { art } = site.organization
  // A su tamaño real: ampliarla en ImageKit pesa más sin ganar detalle.
  const picture = imagekitPicture(art.src, [art.width], 60)
  return (
    <EnterFromSide className="mx-auto mt-6 w-[min(70vw,18rem)] lg:mx-0 lg:mt-0 lg:w-full lg:max-w-[26rem] lg:justify-self-end">
      <picture aria-hidden>
        <source type="image/avif" srcSet={picture.avif} />
        <img src={picture.src} srcSet={picture.webp} alt="" width={art.width} height={art.height} loading="lazy" decoding="async" className="h-auto w-full" />
      </picture>
    </EnterFromSide>
  )
}

/** Texto del tramo: en móvil, el primer bloque visible y el resto con «Leer más». */
function StepBody({ blocks }: { blocks: RichBlock[] }) {
  const [first, ...rest] = blocks
  if (!first) return null
  return (
    <Expandable
      head={<RichText blocks={[first]} />}
      rest={rest.length ? <RichText blocks={rest} className="pt-4" /> : undefined}
    />
  )
}

/**
 * ¿Cómo nos organizaremos? — cabecera y dos tramos (Contenidos, Mesas
 * plenarias). Cada tramo:
 * - Escritorio: texto fijo (sticky) a la izquierda mientras sus tarjetas
 *   suben a la derecha; al llegar el siguiente tramo, su texto empuja al
 *   anterior. Solo CSS: sin cálculos de scroll en JS.
 * - Móvil: una columna en orden natural; el título del tramo queda fijo bajo
 *   el nav mientras pasan sus tarjetas y lo sustituye el del siguiente.
 */
export function Organization() {
  const { organization } = site
  return (
    // overflow-x-clip: la ilustración entra desde fuera de la página sin crear scroll lateral (no rompe los sticky).
    <Section id="por-que" className="overflow-x-clip pt-10 pb-8 sm:pt-32 sm:pb-12">
      <div className="wrap">
        {/* Escritorio: cabecera a la izquierda y la ilustración en el hueco de la derecha. */}
        <div className="lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
          <header className="max-w-prose">
            <DisplayHeading>{organization.title}</DisplayHeading>
            <ScrollLit className="mt-6">
              <ExpandableText paragraphs={organization.intro} className="leading-relaxed text-pretty" />
            </ScrollLit>
          </header>
          <Art />
        </div>

        {/* Pausa de lectura tras la cabecera antes de que entren los tramos
            (en escritorio, relativa al alto de pantalla; en móvil, corta). */}
        <div className="mt-8 flex flex-col gap-24 lg:mt-[calc(var(--svh)*50)] lg:gap-32">
          {organization.steps.map((step) => (
            <div key={step.title} className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              {/* Móvil: `contents` hace que título y texto sean hijos del tramo, así el
                  título (sticky) queda fijo bajo el nav mientras pasan las tarjetas. */}
              <div className="contents lg:sticky lg:top-28 lg:block lg:self-start">
                <h3 className="sticky top-16 z-10 -mx-4 self-start bg-fondo/95 px-4 py-3 font-wordmark text-2xl font-normal text-salvia-texto sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:bg-transparent lg:p-0 lg:text-4xl">
                  {step.title}
                </h3>
                {/* Texto que se enciende con el scroll (como Previos o Para saber más). */}
                <ScrollLit className="lg:mt-6">
                  <StepBody blocks={step.body} />
                </ScrollLit>
              </div>
              <div className="flex flex-col gap-6 lg:gap-10">
                {step.cards.map((card) => (
                  <Card key={(card.kicker ?? '') + card.title} card={card} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
