import { useCallback, useState } from 'react'
import { DisplayHeading } from '../../../components/DisplayHeading'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { useBreakpoint } from '../../../hooks/useBreakpoint'
import { ParticipantSheet } from './ParticipantSheet'
import { ParticipantSlider } from './ParticipantSlider'

interface Selected {
  group: number
  index: number
}

/**
 * Participantes: una fila deslizable por tipo (conferencias, comunicaciones,
 * pósteres). Una sola tarjeta abierta a la vez: en escritorio se despliega
 * en la fila; en móvil se lee en una hoja inferior.
 */
export function Participants() {
  const { participants } = site
  const inline = useBreakpoint() === 'desktop'
  const [selected, setSelected] = useState<Selected | null>(null)
  const close = useCallback(() => setSelected(null), [])

  const sheetItem = !inline && selected ? (participants.groups[selected.group]?.items[selected.index] ?? null) : null

  return (
    <Section
      id="ponentes"
      className="py-24 [--card:16rem] [--card-open:min(calc(var(--card)*5_+_4rem),calc(100vw_-_2*var(--wrap-inset)))] sm:py-32 sm:[--card:17rem]"
    >
      <header className="wrap">
        <DisplayHeading>{participants.title}</DisplayHeading>
        <p className="mt-6 max-w-prose leading-relaxed text-pretty">{participants.intro}</p>
      </header>

      <div className="mt-14 lg:mt-20">
        {participants.groups.map((group, g) => (
          <ParticipantSlider
            key={group.id}
            group={group}
            accent={g === 0}
            inline={inline}
            openIndex={selected?.group === g ? selected.index : null}
            onOpen={(index) => setSelected({ group: g, index })}
            onClose={close}
          />
        ))}
      </div>

      <ParticipantSheet item={sheetItem} onClose={close} />
    </Section>
  )
}
