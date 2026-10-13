/*
 * Estilo único de los botones del sitio (y de los enlaces con forma de
 * botón): esquinas redondeadas en píldora, sin icono, etiqueta en mayúsculas.
 * Cambiar aquí la forma o los colores cambia todos los botones a la vez.
 * Excepciones a propósito: el botón de Google (lleva su logo por normas de
 * marca) y el panel de administración (botones de solo icono en móvil).
 */

export type ButtonVariant = 'primary' | 'secondary' | 'danger'
export type ButtonSize = 'md' | 'sm'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full border text-center font-bold tracking-wide uppercase transition-colors disabled:opacity-60'

const SIZES: Record<ButtonSize, string> = {
  md: 'min-h-12 px-6 text-sm',
  sm: 'min-h-11 px-5 text-xs',
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'border-acento bg-acento text-acento-contraste hover:bg-acento/85',
  secondary: 'border-acento-texto text-texto hover:bg-acento-texto/10',
  danger: 'border-error text-error hover:bg-error/10',
}

interface ButtonOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  /** A todo el ancho del contenedor. */
  full?: boolean
}

/** Clases de un botón: `<button className={buttonClass({ variant: 'secondary' })}>`. */
export function buttonClass({ variant = 'primary', size = 'md', full = false }: ButtonOptions = {}): string {
  return `${BASE} ${SIZES[size]} ${VARIANTS[variant]}${full ? ' w-full' : ''}`
}
