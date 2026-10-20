import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { scrollToTarget } from '../../../app/scrollTo'
import { DisplayHeading } from '../../../components/DisplayHeading'
import { ExpandButton } from '../../../components/ExpandButton'
import { Expandable } from '../../../components/ExpandableText'
import { ReadingSheet } from '../../../components/ReadingSheet'
import { Section } from '../../../components/Section'
import { StackedDeck, type DeckCardState, type StackedDeckHandle } from '../../../components/StackedDeck'
import { site } from '../../../content/site'
import type { ImageAsset, ParallelActivity } from '../../../content/types'
import { activityAnchor, activityFromPath, activityPath, onOpenActivity } from './openActivity'
import { scheduleOf } from './schedule'
import { ShareButton } from './ShareButton'
import { showInProgram } from '../program/showInProgram'

/*
 * Actividades paralelas: tarjetas grandes apiladas con el scroll, como las de
 * Previos (StackedDeck), en color piedra con texto oscuro (10:1). Cada una
 * lleva su texto y el hueco de sus dos fotos.
 * - Escritorio: «Leer más» despliega la tarjeta sobre la pila con todo el texto.
 * - Móvil: tarjetas una debajo de otra; el resto del texto, desplegable.
 * - Desde el programa («Ver más»): se abre en la hoja de lectura (en escritorio,
 *   ventana centrada), sin salir del programa, con anterior / siguiente y
 *   «Ver todas las actividades». (`deck.reveal` permite en su lugar llevar el
 *   scroll a la tarjeta y desplegarla.)
 * - Cada ficha tiene su dirección (/actividades/<id>) para compartirla; el
 *   build genera para cada una un HTML con su vista previa (vite.config.ts).
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

/** Día y hora en el programa, con enlace de vuelta a él (dentro del desplegable). */
function InProgram({ item }: { item: ParallelActivity }) {
  const { activities } = site
  const slots = scheduleOf(item.id)
  if (!slots.length) return null
  return (
    <aside className="flex flex-col gap-3 rounded-2xl bg-acento-contraste p-4 text-piedra sm:p-5">
      <p className="text-xs font-bold tracking-widest uppercase">{activities.inProgram}</p>
      <ul className="flex flex-col gap-1.5 text-sm font-semibold text-claro">
        {slots.map((slot) => (
          <li key={slot.date + slot.time} className="flex gap-2">
            <CalendarDays aria-hidden className="mt-px size-4 shrink-0 text-piedra" />
            {slot.day} · {slot.time}
          </li>
        ))}
      </ul>
      <a
        href="#agenda"
        onClick={(e) => {
          e.preventDefault()
          showInProgram(item.id)
        }}
        className="inline-flex w-fit items-center gap-1.5 rounded-full bg-piedra px-4 py-2 text-xs font-bold tracking-wide text-acento-contraste uppercase transition-colors hover:bg-claro"
      >
        {activities.seeInProgram}
        <ArrowRight aria-hidden className="size-3.5" />
      </a>
    </aside>
  )
}

function ActivityCard({ item, index, deck }: { item: ParallelActivity; index: number; deck: DeckCardState }) {
  const { ui } = site
  const { stacked, expanded, revealed } = deck
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
      <div className="flex shrink-0 flex-col items-end gap-3">
        <ShareButton item={item} compact />
        {expanded && toggle('')}
      </div>
    </header>
  )

  // Desplegada (escritorio): todo el texto a la vista, en columnas, con las fotos al principio.
  if (expanded) {
    return (
      <article id={activityAnchor(item.id)}>
        {header}
        <div className="mt-6 columns-[19rem] gap-10 text-justify text-sm leading-relaxed hyphens-auto [&>*]:mb-4 [&>*]:break-inside-avoid">
          {/* Juntas (sin partir entre columnas): las fotos siempre debajo de «En el programa». */}
          <div className="flex flex-col gap-4">
            <InProgram item={item} />
            <Photos item={item} />
          </div>
          <Blocks blocks={item.body} />
        </div>
      </article>
    )
  }

  return (
    <article id={activityAnchor(item.id)}>
      {header}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-12">
        <div className="text-justify leading-relaxed hyphens-auto">
          {stacked ? (
            <>
              <p className="line-clamp-6">{lead}</p>
              {toggle('mt-4')}
            </>
          ) : (
            <Expandable
              // Al llegar desde el programa, el texto ya desplegado.
              key={revealed ? 'revealed' : 'closed'}
              defaultOpen={revealed}
              head={<p>{lead}</p>}
              rest={
                <div className="flex flex-col gap-4 pt-4">
                  {more && <Blocks blocks={after} />}
                  <InProgram item={item} />
                </div>
              }
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
  const { items } = activities
  const deck = useRef<StackedDeckHandle>(null)
  /** Actividad abierta en la hoja de lectura (índice). */
  const [sheet, setSheet] = useState<number | null>(null)
  /** Al cerrar con «Ver todas las actividades»: ir a la sección. */
  const toSection = useRef(false)
  const current = sheet === null ? null : (items[sheet] ?? null)

  useEffect(() => {
    const open = (id: string | null) => {
      const index = items.findIndex((a) => a.id === id)
      if (index >= 0) setSheet(index)
    }
    // Llegada por el enlace de una actividad: la portada debajo y su ficha abierta
    // (la hoja vuelve a poner su dirección; «atrás» o cerrar dejan la portada).
    const linked = activityFromPath(window.location.pathname)
    if (linked) {
      history.replaceState(null, '', '/')
      open(linked)
    }
    return onOpenActivity(open)
  }, [items])

  const onClose = () => {
    setSheet(null)
    if (!toSection.current) return
    toSection.current = false
    const section = document.getElementById('actividades')
    // Tras cerrar la hoja (la página vuelve a desplazarse).
    if (section) requestAnimationFrame(() => scrollToTarget(section))
  }

  const step = (dir: 1 | -1) => sheet !== null && setSheet((sheet + dir + items.length) % items.length)
  const prev = sheet === null ? null : items[(sheet - 1 + items.length) % items.length]
  const next = sheet === null ? null : items[(sheet + 1) % items.length]

  return (
    <Section id="actividades" className="pt-10 pb-10 sm:py-32 lg:pb-0">
      <div className="wrap">
        <DisplayHeading>{activities.title}</DisplayHeading>
      </div>

      <StackedDeck
        ref={deck}
        items={items}
        getKey={(item) => item.title}
        cardClassName="bg-piedra text-acento-contraste"
        fitOpen
        className="mt-8 lg:mt-12"
        renderItem={(item, i, deck) => <ActivityCard item={item} index={i} deck={deck} />}
      />

      <ReadingSheet
        open={current !== null}
        url={current ? activityPath(current.id) : undefined}
        kicker={current ? [current.kind, current.dates].filter(Boolean).join(' · ') : undefined}
        before={current && <Photos item={current} />}
        title={current?.title}
        closeLabel={activities.close}
        onClose={onClose}
        actions={current && <ShareButton item={current} compact />}
      >
        {current && (
          <div className="flex flex-col gap-4 leading-relaxed">
            {current.place && <p className="text-sm text-texto-suave">{current.place}</p>}
            <Blocks blocks={current.body} />

            {/* Pasar de una actividad a otra sin cerrar la ficha. */}
            <nav aria-label={activities.navLabel} className="mt-6 grid grid-cols-2 gap-3 border-t border-borde pt-6">
              {[
                { dir: -1 as const, item: prev, label: activities.prev, Icon: ArrowLeft },
                { dir: 1 as const, item: next, label: activities.next, Icon: ArrowRight },
              ].map(({ dir, item, label, Icon }) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => step(dir)}
                  className={`flex flex-col gap-1 rounded-2xl border border-borde p-4 transition-colors hover:border-texto ${dir === 1 ? 'items-end text-right' : 'items-start text-left'}`}
                >
                  <span className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-texto-suave uppercase">
                    {dir === -1 && <Icon aria-hidden className="size-4" />}
                    {label}
                    {dir === 1 && <Icon aria-hidden className="size-4" />}
                  </span>
                  <span className="line-clamp-2 text-sm leading-snug font-semibold text-balance">{item?.title}</span>
                </button>
              ))}
            </nav>
            <a
              href="#actividades"
              onClick={(e) => {
                e.preventDefault()
                toSection.current = true
                // Cierra como «atrás» (quita la dirección de la ficha) y luego va a la sección.
                history.back()
              }}
              className="w-fit font-semibold text-acento-texto underline underline-offset-4"
            >
              {activities.seeAll}
            </a>
          </div>
        )}
      </ReadingSheet>
    </Section>
  )
}
