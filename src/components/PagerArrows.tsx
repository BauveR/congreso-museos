import { ArrowLeft, ArrowRight } from 'lucide-react'

const arrow =
  'grid size-11 place-items-center rounded-full border border-borde transition-colors hover:border-texto disabled:opacity-30 disabled:hover:border-borde'

interface PagerArrowsProps {
  edges: { start: boolean; end: boolean }
  page: (dir: 1 | -1) => void
  prevLabel: string
  nextLabel: string
  className?: string
}

/** Flechas «anterior / siguiente» de una fila deslizable (ver useScrollPager). Solo escritorio. */
export function PagerArrows({ edges, page, prevLabel, nextLabel, className = '' }: PagerArrowsProps) {
  return (
    <div className={`hidden gap-2 lg:flex ${className}`}>
      <button type="button" className={arrow} onClick={() => page(-1)} disabled={edges.start} aria-label={prevLabel}>
        <ArrowLeft aria-hidden className="size-5" />
      </button>
      <button type="button" className={arrow} onClick={() => page(1)} disabled={edges.end} aria-label={nextLabel}>
        <ArrowRight aria-hidden className="size-5" />
      </button>
    </div>
  )
}
