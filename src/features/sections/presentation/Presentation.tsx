import { CollapsibleCard } from '../../../components/CollapsibleCard'
import { ExpandableText } from '../../../components/ExpandableText'
import { ScrollLit } from '../../../components/ScrollLitText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import type { CommitteeMember } from '../../../content/types'

function MemberList({ members }: { members: CommitteeMember[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {members.map((m) => (
        <li key={m.name + m.affiliation}>
          <span className="block font-semibold text-texto">{m.name}</span>
          <span className="block text-sm leading-snug text-texto-suave">{m.affiliation}</span>
        </li>
      ))}
    </ul>
  )
}

const people = (n: number) => (n === 1 ? '1 persona' : `${n} personas`)

/**
 * Declaración de intenciones, justo debajo del hero (sin título visible).
 * Escritorio: texto (que se «enciende» con el scroll) a la izquierda, y a la derecha los
 * comités científico y organizador en tarjetas plegables. Móvil: una
 * columna; el texto muestra el primer párrafo + «Leer más».
 */
export function Presentation() {
  const { presentation, committees } = site
  const { scientific, organizing } = committees
  const organizers = organizing.groups.reduce((sum, g) => sum + g.members.length, 0)

  return (
    <Section id="presentacion" className="py-24 sm:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          {/* Sin título visible; se mantiene para lectores de pantalla. */}
          <h2 className="sr-only">{presentation.title}</h2>
          <ScrollLit className="max-w-prose text-lg leading-relaxed text-pretty text-texto lg:text-xl">
            <ExpandableText paragraphs={presentation.body} />
          </ScrollLit>
        </div>

        <div className="flex flex-col gap-4">
          <CollapsibleCard title={scientific.title} meta={people(scientific.members.length)}>
            <p className="mb-5 text-sm leading-relaxed text-pretty text-texto-suave">{scientific.intro}</p>
            <MemberList members={scientific.members} />
          </CollapsibleCard>

          <CollapsibleCard title={organizing.title} meta={people(organizers)}>
            <div className="flex flex-col gap-6">
              {organizing.groups.map((group) => (
                <div key={group.role}>
                  <h4 className="mb-3 text-xs font-bold tracking-wide text-texto-suave uppercase">{group.role}</h4>
                  <MemberList members={group.members} />
                </div>
              ))}
            </div>
          </CollapsibleCard>
        </div>
      </div>
    </Section>
  )
}
