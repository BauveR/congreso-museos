import { DisplayHeading } from '../../../components/DisplayHeading'
import { ExpandButton } from '../../../components/ExpandButton'
import { Expandable } from '../../../components/ExpandableText'
import { Section } from '../../../components/Section'
import { StackedDeck, type DeckCardState } from '../../../components/StackedDeck'
import { site } from '../../../content/site'
import type { ImageAsset, ParallelActivity } from '../../../content/types'

/*
 * Actividades paralelas: tarjetas grandes apiladas con el scroll, como las de
 * Previos (StackedDeck), en color piedra con texto oscuro (10:1). Cada una
 * lleva su texto y el hueco de sus dos fotos.
 * - Escritorio: «Leer más» despliega la tarjeta sobre la pila con todo el texto.
 * - Móvil: tarjetas una debajo de otra; el resto del texto, desplegable.
 */

const pad = (n: number) => String(n).padStart(2, '0')

/** Texto secundario sobre la piedra (oscuro suavizado, 7:1). */
const MUTED = 'text-acento-contraste/75'

function Photo({ image }: { image?: ImageAsset }) {
  const frame = 'aspect-4/3 w-full rounded-2xl'
  // Hueco mientras no hay foto.
  if (!image) return <div aria-hidden className={`${frame} bg-acento-contraste/10`} />
  return (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading="lazy"
      decoding="async"
      className={`${frame} object-cover`}
    />
  )
}

function Photos({ item, className = '' }: { item: ParallelActivity; className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      <Photo image={item.images?.[0]} />
      <Photo image={item.images?.[1]} />
    </div>
  )
}

/** Bloques de texto (con subtítulo si lo tienen, p. ej. la compañía del concierto). */
function Blocks({ blocks }: { blocks: ParallelActivity['body'] }) {
  return blocks.map((block, b) => (
    <div key={b} className="flex flex-col gap-4">
      {block.heading && <h4 className="font-display text-lg font-semibold">{block.heading}</h4>}
      {block.paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  ))
}

function ActivityCard({ item, index, deck }: { item: ParallelActivity; index: number; deck: DeckCardState }) {
  const { ui } = site
  const { stacked, expanded } = deck
  const [first, ...rest] = item.body
  const lead = first?.paragraphs[0]
  const after: ParallelActivity['body'] = [...(first ? [{ ...first, paragraphs: first.paragraphs.slice(1) }] : []), ...rest]
  const more = after.some((b) => b.paragraphs.length > 0)

  const toggle = (className: string) =>
    more && (
      <ExpandButton
        expanded={expanded}
        label={ui.readMore}
        expandedLabel={ui.readLess}
        srContext={item.title}
        onClick={deck.toggle}
        className={`font-semibold ${className}`}
      />
    )

  const header = (
    <header className="flex items-start gap-5 border-b border-acento-contraste/20 pb-5">
      <span aria-hidden className="font-wordmark text-5xl leading-none tabular-nums lg:text-6xl">
        {pad(index + 1)}
      </span>
      <div className="flex-1">
        <p className={`text-xs font-bold tracking-widest uppercase ${MUTED}`}>{item.kind}</p>
        <h3 className="mt-1 font-display text-xl leading-tight text-balance uppercase sm:text-2xl lg:text-3xl">{item.title}</h3>
        {(item.place || item.dates) && <p className={`mt-2 text-sm ${MUTED}`}>{[item.place, item.dates].filter(Boolean).join(' · ')}</p>}
      </div>
      {expanded && toggle('shrink-0')}
    </header>
  )

  // Desplegada (escritorio): todo el texto a la vista, en columnas, con las fotos al principio.
  if (expanded) {
    return (
      <article>
        {header}
        <div className="mt-6 columns-[19rem] gap-10 text-sm leading-relaxed [&>*]:mb-4 [&>*]:break-inside-avoid">
          <Photos item={item} />
          <Blocks blocks={item.body} />
        </div>
      </article>
    )
  }

  return (
    <article>
      {header}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-12">
        <div className="leading-relaxed">
          {stacked ? (
            <>
              <p className="line-clamp-6">{lead}</p>
              {toggle('mt-4')}
            </>
          ) : (
            <Expandable
              head={<p>{lead}</p>}
              rest={more ? <div className="flex flex-col gap-4 pt-4"><Blocks blocks={after} /></div> : undefined}
              expandOnDesktop={false}
              buttonClassName="font-semibold"
            />
          )}
        </div>
        <Photos item={item} className="max-lg:-order-1 lg:self-start" />
      </div>
    </article>
  )
}

export function Activities() {
  const { activities } = site
  return (
    <Section id="actividades" className="pt-10 pb-10 sm:py-32 lg:pb-0">
      <div className="wrap">
        <DisplayHeading>{activities.title}</DisplayHeading>
      </div>

      <StackedDeck
        items={activities.items}
        getKey={(item) => item.title}
        cardClassName="bg-piedra text-acento-contraste"
        fitOpen
        className="mt-8 lg:mt-12"
        renderItem={(item, i, deck) => <ActivityCard item={item} index={i} deck={deck} />}
      />
    </Section>
  )
}
