import { useMediaQuery } from './useMediaQuery'

/** Dispositivo con puntero fino y hover real (no táctil). */
export function useCanHover(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}
