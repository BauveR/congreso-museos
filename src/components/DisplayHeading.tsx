import type { ReactNode } from 'react'
import { RevealText } from './RevealText'

interface DisplayHeadingProps {
  children: ReactNode
  as?: 'h2' | 'h3'
  /** Color del texto: salvia sobre el fondo de página (solo tamaños grandes: 4,04:1); oscuro sobre fondos de color. */
  color?: string
  className?: string
}

/** Título de sección del contenido en Kola. */
export function DisplayHeading({ children, as = 'h2', color = 'text-salvia-texto', className = '' }: DisplayHeadingProps) {
  return (
    <RevealText
      as={as}
      className={`font-wordmark text-3xl leading-tight font-normal text-balance sm:text-4xl lg:text-5xl ${color} ${className}`}
    >
      {children}
    </RevealText>
  )
}
