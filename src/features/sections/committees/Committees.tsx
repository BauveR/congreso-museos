import { DisplayHeading } from '../../../components/DisplayHeading'
import { Expandable } from '../../../components/ExpandableText'
import { ScrollLit } from '../../../components/ScrollLitText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import type { CommitteeMember } from '../../../content/types'

/** Miembros visibles en móvil antes de «Leer más». */
const SCIENTIFIC_VISIBLE = 3
const ORGANIZING_GROUPS_VISIBLE = 2

function MemberList({ members, className = '' }: { members: CommitteeMember[]; className?: string }) {
  return (
    <ul className={`flex flex-col gap-4 ${className}`}>
      {members.map((m) => (
        <li key={m.name + m.affiliation}>
          <span className="block font-semibold text-texto">{m.name}</span>
          <span className="block text-sm leading-snug text-texto-suave">{m.affiliation}</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Presentación: comités científico y organizador. Dos columnas en
 * escritorio; en móvil, una tras otra con las listas largas desplegables.
 * Sin desvanecido al salir: son bloques altos y se leen mientras suben.
 */
export function Committees() {
  const { scientific, organizing } = site.committees
  const groups = (list: typeof organizing.groups, spaced: boolean) => (
    <div className={`flex flex-col gap-8 ${spaced ? 'pt-8' : ''}`}>
      {list.map((group) => (
        <div key={group.role}>
          <h3 className="mb-3 text-xs font-bold tracking-wide text-texto-suave uppercase">{group.role}</h3>
          <MemberList members={group.members} />
        </div>
      ))}
    </div>
  )
  const restGroups = organizing.groups.slice(ORGANIZING_GROUPS_VISIBLE)
  const restMembers = scientific.members.slice(SCIENTIFIC_VISIBLE)

  return (
    <Section id="presentacion" className="py-24 sm:py-32">
      <div className="wrap grid gap-16 lg:grid-cols-2 lg:gap-20">
        <article className="max-w-prose">
          <DisplayHeading>{scientific.title}</DisplayHeading>
          <ScrollLit className="mt-6">
            <p className="leading-relaxed text-pretty text-texto">{scientific.intro}</p>
          </ScrollLit>
          <Expandable
            className="mt-8"
            head={<MemberList members={scientific.members.slice(0, SCIENTIFIC_VISIBLE)} />}
            rest={restMembers.length ? <MemberList members={restMembers} className="pt-4" /> : undefined}
          />
        </article>

        <article className="max-w-prose">
          <DisplayHeading>{organizing.title}</DisplayHeading>
          <Expandable
            className="mt-8"
            head={groups(organizing.groups.slice(0, ORGANIZING_GROUPS_VISIBLE), false)}
            rest={restGroups.length ? groups(restGroups, true) : undefined}
          />
        </article>
      </div>
    </Section>
  )
}
