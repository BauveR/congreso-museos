import { ReadingSheet } from '../../../components/ReadingSheet'
import { site } from '../../../content/site'
import type { Participant } from '../../../content/types'
import { ParticipantDetails } from './ParticipantDetails'

interface ParticipantSheetProps {
  item: Participant | null
  onClose: () => void
}

/** Texto completo de un participante (o comunicación) en la hoja de lectura. */
export function ParticipantSheet({ item, onClose }: ParticipantSheetProps) {
  const { participants } = site
  const names = item?.authors.map((a) => a.name) ?? []
  return (
    <ReadingSheet
      open={item !== null}
      kicker={item ? [item.kicker, item.org].filter(Boolean).join(' · ') : undefined}
      before={<p className="font-wordmark text-3xl leading-tight text-salvia-texto">{names.join(', ') || participants.pending}</p>}
      title={item?.title ?? participants.pending}
      closeLabel={participants.close}
      onClose={onClose}
    >
      {item && <ParticipantDetails item={item} />}
    </ReadingSheet>
  )
}
