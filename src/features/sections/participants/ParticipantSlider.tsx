import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { site } from '../../../content/site'
import type { ParticipantGroup } from '../../../content/types'
import type { PlateTone } from './NamePlate'
import { ParticipantCard } from './ParticipantCard'

interface ParticipantSliderProps {
  group: ParticipantGroup
  tone: PlateTone
  /** Escritorio: despliegue en línea. */
  inline: boolean
  /** Índice de la tarjeta abierta en esta fila (o null). */
  openIndex: number | null
  onOpen: (index: number) => void
  onClose: () => void
}

/**
 * Fila deslizable con scroll horizontal nativo y snap: se arrastra con el
 * dedo o el trackpad y nunca se mueve sola (se puede leer y pulsar). En
 * escritorio, flechas para avanzar de pantalla en pantalla.
 */
export function ParticipantSlider({ group, tone, inline, openIndex, onOpen, onClose }: ParticipantSliderProps) {
  const { participants } = site
  const headingId = useId()
  const scroller = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const measure = () => {
    const el = scroller.current
    if (!el) return
    const start = el.scrollLeft <= 4
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }))
  }

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const page = (dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: smooth ? 'smooth' : 'auto' })
  }

  const arrow = 'grid size-11 place-items-center rounded-full border border-borde transition-colors hover:border-texto disabled:opacity-30 disabled:hover:border-borde'

  return (
    <div className="mt-14 first:mt-0 lg:mt-20">
      <div className="wrap flex items-end justify-between gap-4">
        <h3 id={headingId} className="text-sm font-bold tracking-widest uppercase">
          {group.label} <span className="ml-1 font-normal text-texto-suave">{group.items.length}</span>
        </h3>
        <div className="hidden gap-2 lg:flex">
          <button type="button" className={arrow} onClick={() => page(-1)} disabled={edges.start} aria-label={`${participants.prev}: ${group.label}`}>
            <ArrowLeft aria-hidden className="size-5" />
          </button>
          <button type="button" className={arrow} onClick={() => page(1)} disabled={edges.end} aria-label={`${participants.next}: ${group.label}`}>
            <ArrowRight aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      <ul
        ref={scroller}
        aria-labelledby={headingId}
        onScroll={measure}
        className="mt-5 flex snap-x snap-mandatory scroll-px-(--wrap-gutter) items-start gap-4 overflow-x-auto overscroll-x-contain px-(--wrap-gutter) pb-4 [scrollbar-width:none] lg:snap-proximity lg:scroll-px-(--wrap-inset) lg:px-(--wrap-inset) [&::-webkit-scrollbar]:hidden"
      >
        {group.items.map((item, i) => (
          <ParticipantCard
            key={`${item.title ?? item.kicker}-${i}`}
            item={item}
            tone={tone}
            inline={inline}
            expanded={openIndex === i}
            onOpen={() => onOpen(i)}
            onClose={onClose}
          />
        ))}
      </ul>
    </div>
  )
}
