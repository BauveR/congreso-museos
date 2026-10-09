import type { ReactNode } from 'react'
import { dayColor } from '../../shared/event'

/**
 * Píldora de color de un día del congreso, para distinguir los días de un
 * vistazo. `index`: posición del día (0, 1, 2…). Colores en shared/event.ts
 * (los mismos del correo de confirmación).
 */
export function DayPill({ index, children, className = '' }: { index: number; children: ReactNode; className?: string }) {
  const { bg, text } = dayColor(index)
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${className}`} style={{ backgroundColor: bg, color: text }}>
      {children}
    </span>
  )
}
