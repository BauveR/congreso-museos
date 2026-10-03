import { useBreakpoint } from './useBreakpoint'
import { useReducedMotion } from './useReducedMotion'

/**
 * Efectos con pin (scroll horizontal, tarjetas apiladas): solo en escritorio
 * y sin reduced motion. En móvil se usa la versión simple de cada sección.
 */
export function useEnhancedMotion(): boolean {
  const desktop = useBreakpoint() === 'desktop'
  const reducedMotion = useReducedMotion()
  return desktop && !reducedMotion
}
