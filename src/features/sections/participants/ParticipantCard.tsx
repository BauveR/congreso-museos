import { useEffect, useId, useRef, type TransitionEvent } from 'react'
import { loadMotion } from '../../../app/motion'
import { ExpandButton } from '../../../components/ExpandButton'
import { site } from '../../../content/site'
import type { Participant } from '../../../content/types'
import { NamePlate, type PlateTone } from './NamePlate'
import { ParticipantDetails } from './ParticipantDetails'
import { hasDetails } from './plate'

interface ParticipantCardProps {
  item: Participant
  tone: PlateTone
  /** Escritorio: la tarjeta se despliega en línea; móvil: abre la hoja inferior. */
  inline: boolean
  expanded: boolean
  onOpen: () => void
  onClose: () => void
}

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

/**
 * Tarjeta de participante. Cerrada: nombre en Kola (zona de la foto), título y
 * dos líneas del resumen. En escritorio se despliega a lo ancho (unas cinco
 * tarjetas) mostrando el texto completo a la derecha del nombre; el panel
 * tiene ancho fijo y la tarjeta lo destapa al crecer (sin recolocar el texto).
 */
export function ParticipantCard({ item, tone, inline, expanded, onOpen, onClose }: ParticipantCardProps) {
  const { participants, ui } = site
  const card = useRef<HTMLLIElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const detailsId = useId()
  const open = inline && expanded
  const readable = hasDetails(item)
  const preview = item.abstract?.[0]

  // Llevar la tarjeta abierta al inicio de la fila.
  const align = () => card.current?.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest', inline: 'start' })

  useEffect(() => {
    if (open) align()
  }, [open])

  const onTransitionEnd = (e: TransitionEvent) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'width') return
    if (open) align()
    // La altura de la sección cambia: recolocar los efectos de las siguientes.
    void loadMotion().then(({ ScrollTrigger }) => ScrollTrigger.refresh())
  }

  const toggle = () => {
    if (open) onClose()
    else onOpen()
    // Sin transición (reduced motion) no hay transitionend.
    if (inline && scrollBehavior() === 'auto') void loadMotion().then(({ ScrollTrigger }) => ScrollTrigger.refresh())
  }

  return (
    <li
      ref={card}
      onTransitionEnd={onTransitionEnd}
      onKeyDown={(e) => {
        if (open && e.key === 'Escape') {
          onClose()
          button.current?.focus()
        }
      }}
      className={`shrink-0 snap-start transition-[width] duration-500 ease-out motion-reduce:transition-none ${open ? 'w-(--card-open)' : 'w-(--card)'}`}
    >
      <article className="relative flex gap-10 overflow-hidden">
        {/* Columna del nombre: entera es zona de clic, para abrir y para plegar. */}
        <div className="relative flex w-(--card) shrink-0 flex-col">
          <NamePlate item={item} tone={tone} />
          <p className="sr-only">{item.authors.map((a) => a.name).join(', ') || participants.pending}</p>

          <div className="mt-4 flex flex-col gap-2">
            {(item.kicker || item.org) && (
              <p className="text-xs font-bold tracking-widest text-texto-suave uppercase">
                {[item.kicker, item.org].filter(Boolean).join(' · ')}
              </p>
            )}
            {/* Recortado solo si «Leer más» lleva al título completo (los pósteres no tienen más texto). */}
            <h4 className={`font-display text-xl leading-snug text-balance ${readable && !open ? 'line-clamp-4' : ''}`}>
              {item.title ?? <span className="text-texto-suave">{participants.pending}</span>}
            </h4>
            {preview && !open && <p className="line-clamp-2 text-sm leading-relaxed text-texto-suave">{preview}</p>}

            {readable && (
              <ExpandButton
                ref={button}
                expanded={open}
                opensDialog={!inline}
                controls={detailsId}
                direction="right"
                label={ui.readMore}
                expandedLabel={ui.readLess}
                srContext={item.title}
                onClick={toggle}
                // Toda la columna del nombre es zona de clic (abierta, pliega).
                className="mt-1 text-acento-texto after:absolute after:inset-0 after:content-['']"
              />
            )}
          </div>
        </div>

        {open && (
          <div id={detailsId} className="w-[calc(var(--card-open)_-_var(--card)_-_2.5rem)] shrink-0 animate-fade-in pt-1 motion-reduce:animate-none">
            <ParticipantDetails item={item} columns />
          </div>
        )}
      </article>
    </li>
  )
}
