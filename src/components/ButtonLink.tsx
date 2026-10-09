import { ArrowUpRight, CalendarDays, Mail, MapPin, Ticket, type LucideIcon } from 'lucide-react'
import type { AnchorHTMLAttributes } from 'react'
import type { LinkIcon } from '../content/types'

type Variant = 'primary' | 'secondary'

const icons: Record<LinkIcon, LucideIcon> = {
  arrow: ArrowUpRight,
  ticket: Ticket,
  calendar: CalendarDays,
  mail: Mail,
  map: MapPin,
}

/** Botón (fondo + borde) y caja del icono, por variante. */
const variants: Record<Variant, { button: string; box: string }> = {
  primary: {
    button: 'border-acento bg-acento text-acento-contraste hover:bg-acento/85',
    box: 'bg-acento-contraste text-acento',
  },
  secondary: {
    button: 'border-acento-texto text-texto hover:bg-acento-texto/10',
    box: 'bg-acento text-acento-contraste',
  },
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  icon?: LinkIcon
}

/**
 * Botón con el icono en una caja a la izquierda y la etiqueta en
 * mayúsculas centrada. Al hover, el icono se desplaza levemente.
 */
export function ButtonLink({ variant = 'primary', icon = 'arrow', className = '', children, ...rest }: ButtonLinkProps) {
  const Icon = icons[icon]
  const style = variants[variant]
  return (
    <a
      className={`group inline-flex h-12 min-w-60 items-center gap-4 rounded-lg border p-1 pr-6 text-sm font-bold tracking-wide uppercase transition-colors ${style.button} ${className}`}
      {...rest}
    >
      <span aria-hidden className={`grid size-10 shrink-0 place-items-center rounded-md ${style.box}`}>
        <Icon className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
      <span className="flex-1 text-center">{children}</span>
    </a>
  )
}
