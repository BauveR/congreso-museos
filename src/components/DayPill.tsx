import type { ReactNode } from 'react'

/** Fondo y texto de cada día (tokens --color-dia-*): lima, verde medio y verde bosque. */
const TONES = ['bg-dia-1 text-acento-contraste', 'bg-dia-2 text-acento-contraste', 'bg-dia-3 text-dia-3-texto']

/**
 * Píldora de color de un día del congreso, para distinguir los días de un
 * vistazo. `index`: posición del día (0, 1, 2…); a partir del cuarto se repite.
 */
export function DayPill({ index, children, className = '' }: { index: number; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${TONES[index % TONES.length]} ${className}`}>
      {children}
    </span>
  )
}
