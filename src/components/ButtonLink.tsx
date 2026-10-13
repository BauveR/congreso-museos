import type { AnchorHTMLAttributes } from 'react'
import { buttonClass, type ButtonVariant } from './button'

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Exclude<ButtonVariant, 'danger'>
}

/** Enlace con forma de botón (estilo único de button.ts): etiqueta en mayúsculas, sin icono. */
export function ButtonLink({ variant = 'primary', className = '', children, ...rest }: ButtonLinkProps) {
  return (
    <a className={`${buttonClass({ variant })} min-w-60 ${className}`} {...rest}>
      {children}
    </a>
  )
}
