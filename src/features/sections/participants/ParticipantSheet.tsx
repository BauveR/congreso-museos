import { X } from 'lucide-react'
import { useEffect, useRef, type PointerEvent } from 'react'
import { site } from '../../../content/site'
import type { Participant } from '../../../content/types'
import { ParticipantDetails } from './ParticipantDetails'

/** Distancia (px) de arrastre hacia abajo que cierra la hoja. */
const DRAG_CLOSE = 90
/** Marca en el historial: «atrás» cierra la hoja en lugar de salir de la página. */
const HISTORY_KEY = 'participantSheet'

interface ParticipantSheetProps {
  item: Participant | null
  onClose: () => void
}

/**
 * Hoja inferior (bottom sheet) para leer el texto completo en móvil, el patrón
 * de Google Maps, Apple Maps o Airbnb para fichas largas. Sobre <dialog>
 * modal nativo: foco atrapado, Escape y semántica de diálogo.
 * - Se cierra con la X, tocando fuera, arrastrando el asa o con «atrás».
 * - Scroll propio (data-lenis-prevent) y la página bloqueada detrás.
 */
export function ParticipantSheet({ item, onClose }: ParticipantSheetProps) {
  const { participants } = site
  const dialog = useRef<HTMLDialogElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const drag = useRef<{ y: number; dy: number } | null>(null)
  const open = item !== null
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (!open) {
      if (el.open) el.close()
      return
    }
    if (!el.open) el.showModal()
    body.current?.scrollTo(0, 0)
    history.pushState({ [HISTORY_KEY]: true }, '')
    const onPop = () => onCloseRef.current()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [open])

  /** Cerrar quitando también la entrada del historial (que dispara onClose). */
  const close = () => {
    if ((history.state as Record<string, unknown> | null)?.[HISTORY_KEY]) history.back()
    else onClose()
  }

  const setOffset = (dy: number) => {
    if (panel.current) panel.current.style.transform = dy > 0 ? `translateY(${dy}px)` : ''
  }

  const onPointerDown = (e: PointerEvent) => {
    drag.current = { y: e.clientY, dy: 0 }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: PointerEvent) => {
    if (!drag.current) return
    drag.current.dy = Math.max(0, e.clientY - drag.current.y)
    setOffset(drag.current.dy)
  }
  const onPointerUp = () => {
    const dy = drag.current?.dy ?? 0
    drag.current = null
    setOffset(0)
    if (dy > DRAG_CLOSE) close()
  }

  const names = item?.authors.map((a) => a.name) ?? []

  return (
    <dialog
      ref={dialog}
      data-scroll-lock
      data-lenis-prevent
      aria-labelledby="participant-sheet-title"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      // Clic en el fondo (fuera del panel): el objetivo es el propio <dialog>.
      onClick={(e) => e.target === e.currentTarget && close()}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none bg-transparent p-0 text-texto"
    >
      {item && (
        <div
          ref={panel}
          className="absolute inset-x-0 bottom-0 flex max-h-[92svh] animate-sheet-in flex-col rounded-t-3xl bg-fondo shadow-2xl motion-reduce:animate-none"
        >
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="flex shrink-0 touch-none flex-col border-b border-borde px-5 pt-3 pb-4"
          >
            <span aria-hidden className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-borde" />
            <div className="flex items-start justify-between gap-4">
              <p className="pt-2 text-xs font-bold tracking-widest text-texto-suave uppercase">
                {[item.kicker, item.org].filter(Boolean).join(' · ')}
              </p>
              <button
                type="button"
                onClick={close}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label={participants.close}
                className="-mt-1 -mr-2 grid size-11 shrink-0 place-items-center rounded-full"
              >
                <X aria-hidden className="size-6" />
              </button>
            </div>
          </div>

          <div ref={body} className="overflow-y-auto overscroll-contain px-5 pt-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <p className="font-wordmark text-3xl leading-tight text-salvia-texto">{names.join(', ') || participants.pending}</p>
            <h2 id="participant-sheet-title" className="mt-4 font-display text-xl leading-snug text-balance">
              {item.title ?? participants.pending}
            </h2>
            <div className="mt-8">
              <ParticipantDetails item={item} />
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
