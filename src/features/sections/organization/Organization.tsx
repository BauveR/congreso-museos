import { DisplayHeading } from '../../../components/DisplayHeading'
import { Expandable, ExpandableText } from '../../../components/ExpandableText'
import { RichText } from '../../../components/RichText'
import { ScrollLit } from '../../../components/ScrollLitText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import type { OrganizationCard, RichBlock } from '../../../content/types'

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
    <Section id="por-que" className="py-24 sm:py-32">
      <div className="wrap">
        <header className="max-w-prose">
          <DisplayHeading>{organization.title}</DisplayHeading>
          <ScrollLit className="mt-6">
            <ExpandableText paragraphs={organization.intro} className="leading-relaxed text-pretty" />
          </ScrollLit>
        </header>

        {/* Pausa de lectura tras la cabecera antes de que entren los tramos
            (relativa al alto de pantalla: algo menos en móvil). */}
        <div className="mt-[30svh] flex flex-col gap-24 lg:mt-[50svh] lg:gap-32">
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
