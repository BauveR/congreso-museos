import { site } from '../../../content/site'
import type { Participant } from '../../../content/types'
import { plateFontSize, visibleNames } from './plate'

/** Fondo de la tarjeta según el grupo. */
export type PlateTone = 'salvia' | 'ocre' | 'neutro'

const toneClass: Record<PlateTone, string> = {
  salvia: 'bg-salvia text-acento-contraste',
  ocre: 'bg-ocre text-acento-contraste',
  neutro: 'bg-superficie text-texto',
}

/** Nombre destacado en las tarjetas de varios autores (comunicaciones y pósteres). */
const highlightClass: Partial<Record<PlateTone, string>> = {
  neutro: 'text-lima',
  ocre: 'text-salvia',
}

/** Dos nombres: el primero; tres: el del medio; más: intercalados desde el primero. */
const isHighlighted = (i: number, count: number): boolean =>
  count === 3 ? i === 1 : count >= 2 && i % 2 === 0

interface NamePlateProps {
  item: Participant
  /** Conferencias en salvia, pósteres en ocre, comunicaciones neutras. */
  tone?: PlateTone
  className?: string
}

/** Zona «foto» de la tarjeta: el nombre en Kola llenando el área 3:4. */
export function NamePlate({ item, tone = 'neutro', className = '' }: NamePlateProps) {
  const { participants } = site
  const { names, hidden } = visibleNames(item)
  const shown = names.length ? names : [participants.pending]

  return (
    <div
      aria-hidden
      className={`aspect-3/4 rounded-2xl p-5 ${toneClass[tone]} ${className}`}
    >
      <div className="flex size-full flex-col justify-end gap-[0.35em] [container-type:size]">
        <div className="flex flex-col gap-[0.3em] font-wordmark leading-none" style={{ fontSize: plateFontSize(shown) }}>
          {shown.map((name, i) => (
            <span key={name} className={`block ${isHighlighted(i, shown.length) ? (highlightClass[tone] ?? '') : ''}`}>
              {name}
            </span>
          ))}
        </div>
        {hidden > 0 && <span className="text-sm font-bold tracking-wide uppercase">{participants.moreAuthors(hidden)}</span>}
      </div>
    </div>
  )
}
