import { site } from '../../../content/site'
import type { Participant } from '../../../content/types'
import { plateFontSize, visibleNames } from './plate'

interface NamePlateProps {
  item: Participant
  /** Tarjeta destacada (conferencias): fondo salvia. */
  accent?: boolean
  className?: string
}

/** Zona «foto» de la tarjeta: el nombre en Kola llenando el área 3:4. */
export function NamePlate({ item, accent = false, className = '' }: NamePlateProps) {
  const { participants } = site
  const { names, hidden } = visibleNames(item)
  const shown = names.length ? names : [participants.pending]

  return (
    <div
      aria-hidden
      className={`aspect-3/4 rounded-2xl p-5 ${accent ? 'bg-salvia text-acento-contraste' : 'bg-superficie text-texto'} ${className}`}
    >
      <div className="flex size-full flex-col justify-end gap-[0.35em] [container-type:size]">
        <div className="flex flex-col gap-[0.3em] font-wordmark leading-none" style={{ fontSize: plateFontSize(shown) }}>
          {shown.map((name) => (
            <span key={name} className="block">
              {name}
            </span>
          ))}
        </div>
        {hidden > 0 && <span className="text-sm font-bold tracking-wide uppercase">{participants.moreAuthors(hidden)}</span>}
      </div>
    </div>
  )
}
