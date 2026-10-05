import type { Theme } from '../../app/theme'

/**
 * Desvanecido de las partículas con la profundidad: densidad relativa a la
 * distancia de cámara (misma fórmula que FogExp2), así las más lejanas se
 * apagan igual en cualquier viewport.
 */
export const PARTICLE_DEPTH_FADE = 0.4

/** Partículas como polvo en suspensión. */
export const PARTICLE_COLOR: Record<Theme, string> = {
  dark: '#e9ebe4',
  light: '#5c6156',
}
