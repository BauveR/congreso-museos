import { useState } from 'react'
import { site } from '../../../content/site'
import type { Participant } from '../../../content/types'
import { NamePlate, type PlateTone } from './NamePlate'
import { hasDetails } from './plate'

/** Tarjetas visibles al cambiar de grupo; «Ver N más» muestra el resto. */
const FIRST = 6

const big = 'inline-flex h-12 w-full items-center justify-center rounded-lg text-sm font-bold tracking-wide uppercase'

interface ParticipantListProps {
  toneOf: (groupId: string) => PlateTone
  onOpen: (group: number, index: number) => void
}

function Row({ item, tone, onOpen }: { item: Participant; tone: PlateTone; onOpen: () => void }) {
  const { participants, ui } = site
  const readable = hasDetails(item)
  return (
    <li className="rounded-2xl border border-borde bg-superficie p-4">
      <div className="grid grid-cols-[5.5rem_1fr] gap-4">
        <NamePlate item={item} tone={tone} className="!rounded-xl !p-2.5" />
        <div className="flex min-w-0 flex-col gap-1.5">
          {(item.kicker || item.org) && (
            <p className="text-xs font-bold tracking-widest text-texto-suave uppercase">{[item.kicker, item.org].filter(Boolean).join(' · ')}</p>
          )}
          <p className="font-display text-lg leading-snug text-balance">{item.title ?? participants.pending}</p>
          <p className="text-sm text-texto-suave">{item.authors.map((a) => a.name).join(', ') || participants.pending}</p>
        </div>
      </div>
      {readable && (
        <button type="button" onClick={onOpen} aria-haspopup="dialog" className={`${big} mt-4 bg-acento text-acento-contraste`}>
          {ui.readMore}
          {item.title && <span className="sr-only">: {item.title}</span>}
        </button>
      )}
    </li>
  )
}

/**
 * Participantes en móvil (patrón de las apps de eventos): pestañas grandes
 * por grupo y lista vertical, sin deslizar de lado. Se muestran las
 * primeras y un botón a todo el ancho carga el resto. «Leer más» abre la
 * hoja de lectura (con su botón grande de cerrar).
 */
export function ParticipantList({ toneOf, onOpen }: ParticipantListProps) {
  const { participants } = site
  const [group, setGroup] = useState(0)
  const [visible, setVisible] = useState(FIRST)
  const current = participants.groups[group]
  if (!current) return null
  const rest = current.items.length - visible

  return (
    <div className="wrap">
      <div role="group" aria-label={participants.groupsLabel} className="grid grid-cols-3 gap-2">
        {participants.groups.map((g, i) => (
          <button
            key={g.id}
            type="button"
            aria-pressed={group === i}
            onClick={() => {
              setGroup(i)
              setVisible(FIRST)
            }}
            className="flex min-h-14 flex-col items-center justify-center rounded-xl border border-borde px-1 py-2 text-xs leading-tight font-bold uppercase aria-pressed:border-acento aria-pressed:bg-acento aria-pressed:text-acento-contraste"
          >
            {g.label}
            <span className="mt-0.5 font-normal tabular-nums">{g.items.length}</span>
          </button>
        ))}
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {current.items.slice(0, visible).map((item, i) => (
          <Row key={`${item.title ?? item.kicker}-${i}`} item={item} tone={toneOf(current.id)} onOpen={() => onOpen(group, i)} />
        ))}
      </ul>

      {rest > 0 && (
        <button type="button" onClick={() => setVisible(current.items.length)} className={`${big} mt-4 border border-acento-texto hover:bg-acento-texto/10`}>
          {participants.showMore(rest)}
        </button>
      )}
    </div>
  )
}
