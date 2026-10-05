import type { Theme } from '../../app/theme'

/**
 * Niebla de la escena (FogExp2). La densidad se expresa relativa a la
 * distancia de cámara: el objeto (a esa distancia) queda velado ~15 % y lo
 * más lejano se pierde en la bruma, en cualquier viewport.
 */
export const FOG_DENSITY = 0.4

/** Color de la niebla: gris claro sobre oscuro, gris cálido sobre claro. */
export const FOG_COLOR: Record<Theme, string> = {
  dark: '#4b4e48',
  light: '#d8d7d0',
}

/** Partículas como polvo en suspensión dentro de la bruma. */
export const PARTICLE_COLOR: Record<Theme, string> = {
  dark: '#e9ebe4',
  light: '#5c6156',
}
