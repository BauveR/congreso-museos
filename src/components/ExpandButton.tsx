import { ChevronDown, ChevronRight } from 'lucide-react'
import type { Ref } from 'react'

interface ExpandButtonProps {
  /** Desplegado en el sitio (aria-expanded); se ignora si abre un diálogo. */
  expanded?: boolean
  /** Abre la hoja de lectura en lugar de desplegar. */
  opensDialog?: boolean
  /** Id del contenido que despliega (aria-controls). */
  controls?: string
  /** Hacia dónde crece el contenido: el chevron apunta ahí y gira al plegar. */
  direction?: 'down' | 'right'
  label: string
  expandedLabel: string
  /** Contexto para lectores de pantalla (p. ej. el título). */
  srContext?: string
  onClick: () => void
  /** Color y posición (sin color, hereda el del contenedor). */
  className?: string
  ref?: Ref<HTMLButtonElement>
}

/** Botón de «Leer más / Leer menos» de todo el sitio: texto y chevron, sin borde. */
export function ExpandButton({
  expanded = false,
  opensDialog = false,
  controls,
  direction = 'down',
  label,
  expandedLabel,
  srContext,
  onClick,
  className = '',
  ref,
}: ExpandButtonProps) {
  const Icon = direction === 'down' ? ChevronDown : ChevronRight
  const open = expanded && !opensDialog

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={opensDialog ? undefined : expanded}
      aria-controls={opensDialog ? undefined : controls}
      aria-haspopup={opensDialog ? 'dialog' : undefined}
      className={`inline-flex min-h-11 cursor-pointer items-center gap-1.5 self-start text-sm font-bold tracking-wide uppercase ${className}`}
    >
      {open ? expandedLabel : label}
      {srContext && <span className="sr-only">: {srContext}</span>}
      <Icon aria-hidden className={`size-4 transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} />
    </button>
  )
}
