import type { HTMLAttributes, Ref } from 'react'
import type { SectionId } from '../content/types'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id: SectionId
  as?: 'section' | 'footer'
  ref?: Ref<HTMLElement>
}

/**
 * Envoltorio común de sección: el mismo id sirve de ancla para el nav y de
 * `data-section` para los ScrollTriggers y la timeline 3D.
 */
export function Section({ id, as: Tag = 'section', className = '', ...rest }: SectionProps) {
  return <Tag id={id} data-section={id} className={`relative ${className}`} {...rest} />
}
