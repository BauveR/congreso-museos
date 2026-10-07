import { ChevronDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'
import { loadMotion } from '../app/motion'
import { site } from '../content/site'
import { useBreakpoint } from '../hooks/useBreakpoint'

interface ExpandableProps {
  /** Contenido siempre visible. */
  head: ReactNode
  /** Contenido que se despliega con «Leer más» (si no hay, no hay botón). */
  rest?: ReactNode
  /** En escritorio (lg) se muestra todo, sin botón. */
  expandOnDesktop?: boolean
  /** Textos del botón (por defecto «Leer más» / «Leer menos»). */
  moreLabel?: string
  lessLabel?: string
  /** Color del botón (por defecto acento; cambiarlo sobre fondos de color). */
  buttonClassName?: string
  className?: string
}

/**
 * Contenido desplegable (mobile first): «Leer más» despliega el resto y la
 * sección crece según lo necesario.
 * - Transición de altura con grid-rows 0fr → 1fr (sin medir en JS); sin
 *   animación con reduced motion.
 * - Lo plegado es `inert`: fuera del orden de tabulación y de los lectores.
 * - Al terminar el cambio de altura se recalculan los ScrollTrigger, para que
 *   los efectos de las secciones siguientes no queden desplazados.
 */
export function Expandable({
  head,
  rest,
  expandOnDesktop = true,
  moreLabel = site.ui.readMore,
  lessLabel = site.ui.readLess,
  buttonClassName = 'text-acento-texto',
  className = '',
}: ExpandableProps) {
  const id = useId()
  const desktop = useBreakpoint() === 'desktop'
  const [open, setOpen] = useState(false)
  const collapsible = Boolean(rest) && !(expandOnDesktop && desktop)
  const expanded = !collapsible || open

  const refreshTriggers = () => void loadMotion().then(({ ScrollTrigger }) => ScrollTrigger.refresh())

  return (
    <div className={`flex flex-col ${className}`}>
      {head}

      {rest && (
        <div
          id={id}
          inert={!expanded}
          onTransitionEnd={(e) => e.target === e.currentTarget && refreshTriggers()}
          className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="min-h-0 overflow-hidden">{rest}</div>
        </div>
      )}

      {collapsible && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => {
            setOpen((o) => !o)
            // Sin transición (reduced motion) no hay transitionend: recalcular igualmente.
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) refreshTriggers()
          }}
          className={`mt-4 inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold tracking-wide uppercase ${buttonClassName}`}
        >
          {open ? lessLabel : moreLabel}
          <ChevronDown aria-hidden className={`size-4 transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  )
}

/** Párrafos desplegables: los `visible` primeros siempre a la vista. */
export function ExpandableText({ paragraphs, visible = 1, ...props }: { paragraphs: string[]; visible?: number } & Omit<ExpandableProps, 'head' | 'rest'>) {
  const list = (items: string[], spaced: boolean) => (
    <div className={`flex flex-col gap-4 ${spaced ? 'pt-4' : ''}`}>
      {items.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </div>
  )
  const rest = paragraphs.slice(visible)
  return <Expandable head={list(paragraphs.slice(0, visible), false)} rest={rest.length ? list(rest, true) : undefined} {...props} />
}
