import { useCallback, useState } from 'react'
import { DisplayHeading } from '../../../components/DisplayHeading'
import { ScrollLitText } from '../../../components/ScrollLitText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { useBreakpoint } from '../../../hooks/useBreakpoint'
import type { PlateTone } from './NamePlate'
import { ParticipantList } from './ParticipantList'
import { ParticipantSheet } from './ParticipantSheet'
import { ParticipantSlider } from './ParticipantSlider'

/** Color de las tarjetas por grupo (el resto, neutras). */
const groupTone: Record<string, PlateTone> = { conferencias: 'salvia', posteres: 'ocre' }

interface Selected {
  group: number
  index: number
}

/**
 * Participantes por tipo (conferencias, comunicaciones, pósteres).
 * - Escritorio: una fila deslizable por tipo; la tarjeta se despliega en la fila.
 * - Móvil: pestañas por tipo y lista vertical (ParticipantList); el texto se
 *   lee en una hoja inferior.
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
        <ScrollLitText paragraphs={[participants.intro]} className="mt-6 text-texto" />
      </header>

      <div className="mt-14 lg:mt-20">
        {!inline && <ParticipantList toneOf={(id) => groupTone[id] ?? 'neutro'} onOpen={(group, index) => setSelected({ group, index })} />}
        {inline && participants.groups.map((group, g) => (
          <ParticipantSlider
            key={group.id}
            group={group}
            tone={groupTone[group.id] ?? 'neutro'}
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
