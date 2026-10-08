import { useState } from 'react'
import { DisplayHeading } from '../../../components/DisplayHeading'
import { ExpandButton } from '../../../components/ExpandButton'
import { ReadingSheet } from '../../../components/ReadingSheet'
import { ScrollLitText } from '../../../components/ScrollLitText'
import { Section } from '../../../components/Section'
import { StackedDeck, type DeckCardState } from '../../../components/StackedDeck'
import { site } from '../../../content/site'
import type { DebateTopic } from '../../../content/types'

const label = 'text-xs font-bold tracking-widest uppercase'

/** Tarjeta salvia (texto oscuro, 5,97:1): título, preguntas o temas, avance. */
function TopicCard({ topic, deck, onRead }: { topic: DebateTopic; deck: DeckCardState; onRead: (topic: DebateTopic) => void }) {
  const { moreInfo, ui } = site
  const { stacked, expanded } = deck
  const preview = topic.blocks[0]?.paragraphs[0]
  const headings = topic.blocks.map((b) => b.heading).filter((h): h is string => Boolean(h))
  const button = (className: string) => (
    // Escritorio (pila): se despliega sobre la pila; móvil: hoja de lectura.
    <ExpandButton
      expanded={expanded}
      opensDialog={!stacked}
      label={moreInfo.readMore}
      expandedLabel={ui.readLess}
      srContext={topic.title}
      onClick={stacked ? deck.toggle : () => onRead(topic)}
      className={className}
    />
  )
  const heading = (
    <header>
      <p className={label}>{topic.kicker}</p>
      <h3 className="mt-2 font-display text-2xl leading-tight text-balance uppercase lg:text-4xl">{topic.title}</h3>
    </header>
  )

  // Desplegada: todo el texto a la vista, en columnas (sin scroll interno).
  if (expanded) {
    return (
      <article>
        <div className="flex items-start justify-between gap-8">
          {heading}
          {button('shrink-0')}
        </div>
        <div className="mt-8 columns-[19rem] gap-10 border-t border-current/30 pt-8">
          <TopicDetails topic={topic} flow />
        </div>
      </article>
    )
  }

  const items = topic.questions ?? headings
  return (
    <article className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
      {heading}
      <div>
        <p className={label}>{topic.questions ? moreInfo.questionsLabel : moreInfo.topicsLabel}</p>
        <ul className="mt-3 flex flex-col gap-3">
          {items.map((q) => (
            <li key={q} className="border-l-2 border-acento-contraste/40 pl-4 text-lg leading-snug font-medium">
              {q}
            </li>
          ))}
        </ul>
        {preview && <p className="mt-5 line-clamp-3 leading-relaxed">{preview}</p>}
        {button('mt-5')}
      </div>
    </article>
  )
}

/**
 * Texto completo: preguntas (si se piden) y bloques. Hereda el color del
 * contenedor (hoja de lectura o tarjeta salvia desplegada).
 */
function TopicDetails({ topic, flow = false }: { topic: DebateTopic; flow?: boolean }) {
  const { moreInfo } = site
  return (
    // `flow`: bloques normales (se reparten entre columnas); si no, columna de lectura.
    <div className={flow ? 'space-y-6 text-[0.9375rem] leading-relaxed [&_p]:mt-3' : 'flex max-w-prose flex-col gap-8 text-base leading-relaxed'}>
      {topic.questions && (
        <section className="break-inside-avoid">
          <h3 className={`mb-3 ${label}`}>{moreInfo.questionsLabel}</h3>
          <ul className="flex flex-col gap-3">
            {topic.questions.map((q) => (
              <li key={q} className="border-l-2 border-current/40 pl-4 font-semibold">
                {q}
              </li>
            ))}
          </ul>
        </section>
      )}
      {topic.blocks.map((block, i) => (
        <section key={block.heading ?? i} className={flow ? '' : 'flex flex-col gap-4'}>
          {block.heading && <h3 className="font-display text-lg leading-snug text-balance">{block.heading}</h3>}
          {block.paragraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </section>
      ))}
    </div>
  )
}

/**
 * Para saber más: misma fórmula que Previos (título, texto que se enciende y
 * tarjetas apiladas), con dos pilas en salvia: mesas plenarias y alegatorios.
 * El texto extenso de cada uno se lee en la hoja de lectura.
 */
export function MoreInfo() {
  const { moreInfo } = site
  const [topic, setTopic] = useState<DebateTopic | null>(null)

  const deck = (items: DebateTopic[]) => (
    <StackedDeck
      items={items}
      getKey={(t) => t.kicker}
      cardClassName="bg-salvia text-acento-contraste"
      className="mt-8"
      renderItem={(t, _i, deck) => <TopicCard topic={t} deck={deck} onRead={setTopic} />}
    />
  )

  return (
    <Section id="saber-mas" className="py-24 sm:py-32 lg:pb-0">
      <div className="wrap">
        <DisplayHeading>{moreInfo.title}</DisplayHeading>
        <ScrollLitText paragraphs={moreInfo.body} className="mt-8" />
        <h3 className="mt-12 text-sm font-bold tracking-widest uppercase">{moreInfo.plenaryLabel}</h3>
      </div>
      {deck(moreInfo.plenary)}

      {/* Alegatorios: mismo estilo que la cabecera de la sección (título en Kola y
          texto que se enciende con el scroll). */}
      <div className="wrap mt-24">
        <DisplayHeading as="h3">{moreInfo.sideLabel}</DisplayHeading>
        <ScrollLitText paragraphs={[moreInfo.sideLead]} className="mt-8" />
      </div>
      {deck(moreInfo.side)}

      <ReadingSheet
        open={topic !== null}
        kicker={topic?.kicker}
        title={topic?.title}
        closeLabel={moreInfo.close}
        onClose={() => setTopic(null)}
      >
        {topic && <TopicDetails topic={topic} />}
      </ReadingSheet>
    </Section>
  )
}
