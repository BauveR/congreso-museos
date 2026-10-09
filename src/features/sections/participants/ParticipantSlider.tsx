import { useId } from 'react'
import { PagerArrows } from '../../../components/PagerArrows'
import { site } from '../../../content/site'
import { useScrollPager } from '../../../hooks/useScrollPager'
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
  const { ref: scroller, edges, measure, page } = useScrollPager<HTMLUListElement>()

  return (
    <div className="mt-14 first:mt-0 lg:mt-20">
      <div className="wrap flex items-end justify-between gap-4">
        <h3 id={headingId} className="text-sm font-bold tracking-widest uppercase">
          {group.label} <span className="ml-1 font-normal text-texto-suave">{group.items.length}</span>
        </h3>
        <PagerArrows edges={edges} page={page} prevLabel={`${participants.prev}: ${group.label}`} nextLabel={`${participants.next}: ${group.label}`} />
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
