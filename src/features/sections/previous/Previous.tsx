import { useState } from 'react'
import { DisplayHeading } from '../../../components/DisplayHeading'
import { ExpandButton } from '../../../components/ExpandButton'
import { Expandable } from '../../../components/ExpandableText'
import { ScrollLitText } from '../../../components/ScrollLitText'
import { Section } from '../../../components/Section'
import { StackedDeck, type DeckCardState } from '../../../components/StackedDeck'
import { site } from '../../../content/site'
import type { Participant, TechnicalTable } from '../../../content/types'
import { ParticipantDetails } from '../participants/ParticipantDetails'
import { ParticipantSheet } from '../participants/ParticipantSheet'

const pad = (n: number) => String(n).padStart(2, '0')

/** Entidades visibles en móvil antes de «Ver las N entidades». */
const VISIBLE_PARTICIPANTS = 4

interface TableCardProps {
  table: TechnicalTable
  index: number
  deck: DeckCardState
  onReadPaper: (item: Participant) => void
}

function TableCard({ table, index, deck, onReadPaper }: TableCardProps) {
  const { previous, ui } = site
  const { stacked, expanded } = deck
  const paper = table.paper
  const paperButton = (className: string) =>
    paper && (
      // Escritorio (pila): se despliega sobre la pila; móvil: hoja de lectura.
      <ExpandButton
        expanded={expanded}
        opensDialog={!stacked}
        label={previous.readPaper}
        expandedLabel={ui.readLess}
        srContext={paper.item.title}
        onClick={stacked ? deck.toggle : () => onReadPaper(paper.item)}
        className={`text-acento-texto [--expand-icon:var(--color-superficie)] ${className}`}
      />
    )
  const list = (items: string[]) => (
    <ul className={`text-sm leading-snug ${paper ? 'sm:columns-2' : 'sm:columns-2 lg:columns-3'} gap-8`}>
      {items.map((p) => (
        <li key={p} className="mb-2 break-inside-avoid border-l-2 border-salvia-texto/40 pl-3">
          {p}
        </li>
      ))}
    </ul>
  )

  const header = (
    <header className="flex items-start gap-5 border-b border-borde pb-5">
      <span aria-hidden className="font-wordmark text-5xl leading-none text-salvia-texto tabular-nums lg:text-6xl">
        {pad(index + 1)}
      </span>
      <div className="flex-1">
        <p className="text-xs font-bold tracking-widest text-texto-suave uppercase">{table.kicker}</p>
        <h3 className="mt-1 font-display text-xl leading-tight text-balance uppercase sm:text-2xl lg:text-3xl">{table.title}</h3>
        <p className="mt-2 text-sm text-texto-suave">
          {table.place} · <time dateTime={table.dateTime}>{table.date}</time>
        </p>
      </div>
      {expanded && paperButton('shrink-0')}
    </header>
  )

  // Desplegada: la comunicación completa a la vista, en columnas (sin scroll interno).
  if (expanded && paper) {
    return (
      <article>
        {header}
        <div className="mt-6 columns-[19rem] gap-10">
          <p className="text-sm text-texto-suave">{paper.intro}</p>
          <p className="mt-4 text-xs font-bold tracking-widest text-salvia-texto uppercase">{paper.item.kicker}</p>
          <p className="mt-2 font-wordmark text-2xl leading-tight text-salvia-texto">{paper.item.authors.map((a) => a.name).join(', ')}</p>
          <h4 className="mt-3 mb-6 font-display text-lg leading-snug text-balance">{paper.item.title}</h4>
          <ParticipantDetails item={paper.item} flow />
        </div>
      </article>
    )
  }

  return (
    <article className="flex flex-col">
      {header}
      <div className={`mt-6 grid gap-8 ${paper ? 'lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-12' : ''}`}>
        <section>
          <p className="mb-4 text-sm font-semibold">{table.participantsIntro}</p>
          {stacked || table.participants.length <= VISIBLE_PARTICIPANTS ? (
            list(table.participants)
          ) : (
            <Expandable
              head={list(table.participants.slice(0, VISIBLE_PARTICIPANTS))}
              rest={list(table.participants.slice(VISIBLE_PARTICIPANTS))}
              moreLabel={previous.showAll(table.participants.length)}
              lessLabel={previous.showLess}
            />
          )}
        </section>

        {paper && (
          <section className="rounded-2xl border border-borde p-5 lg:self-start">
            <p className="text-sm text-texto-suave">{paper.intro}</p>
            <p className="mt-4 text-xs font-bold tracking-widest text-salvia-texto uppercase">{paper.item.kicker}</p>
            <p className="mt-2 font-wordmark text-2xl leading-tight text-salvia-texto">{paper.item.authors.map((a) => a.name).join(', ')}</p>
            <h4 className="mt-3 font-display text-lg leading-snug text-balance">{paper.item.title}</h4>
            {paper.item.abstract?.[0] && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-texto-suave">{paper.item.abstract[0]}</p>}
            {paperButton('mt-4')}
          </section>
        )}
      </div>
    </article>
  )
}

/**
 * Previos: título, texto que se «enciende» con el scroll y las mesas técnicas
 * como tarjetas grandes apiladas (StackedDeck). En móvil la lista de
 * entidades es desplegable; la comunicación asociada se lee completa en la
 * hoja de lectura.
 */
export function Previous() {
  const { previous } = site
  const [paper, setPaper] = useState<Participant | null>(null)

  return (
    <Section id="previos" className="py-24 sm:py-32 lg:pb-0">
      <div className="wrap">
        <DisplayHeading>{previous.title}</DisplayHeading>
        <ScrollLitText paragraphs={previous.body} className="mt-8" />
        <p className="mt-8 max-w-prose text-lg leading-relaxed text-pretty">{previous.lead}</p>
      </div>

      <StackedDeck
        items={previous.tables}
        getKey={(table) => table.title}
        cardClassName="border border-borde bg-superficie"
        className="mt-8"
        renderItem={(table, i, deck) => <TableCard table={table} index={i} deck={deck} onReadPaper={setPaper} />}
      />

      <ParticipantSheet item={paper} onClose={() => setPaper(null)} />
    </Section>
  )
}
