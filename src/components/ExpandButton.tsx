import { Plus } from 'lucide-react'

interface ExpandButtonProps {
  /** Desplegado en el sitio (aria-expanded); sin definir si abre un diálogo. */
  expanded?: boolean
  /** Abre la hoja de lectura en lugar de desplegar. */
  opensDialog?: boolean
  label: string
  expandedLabel: string
  /** Contexto para lectores de pantalla (p. ej. el título). */
  srContext?: string
  onClick: () => void
  className?: string
}

/**
 * Botón de «leer completo» visible: píldora con borde y un + que gira a ×
 * al desplegar (patrón habitual de acordeón). Hereda el color del contenedor.
 */
export function ExpandButton({ expanded = false, opensDialog = false, label, expandedLabel, srContext, onClick, className = '' }: ExpandButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={opensDialog ? undefined : expanded}
      aria-haspopup={opensDialog ? 'dialog' : undefined}
      className={`group inline-flex h-11 items-center gap-2 rounded-full border-2 border-current pr-5 pl-3 text-sm font-bold tracking-wide uppercase transition-colors hover:bg-current/10 ${className}`}
    >
      <span className="grid size-6 place-items-center rounded-full bg-current">
        <Plus aria-hidden className={`size-4 text-[var(--expand-icon,white)] transition-transform duration-300 motion-reduce:transition-none ${expanded ? 'rotate-45' : 'group-hover:rotate-90'}`} />
      </span>
      {expanded ? expandedLabel : label}
      {srContext && <span className="sr-only">: {srContext}</span>}
    </button>
  )
}
