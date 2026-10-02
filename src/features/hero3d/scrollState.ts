import type { SectionId } from '../../content/types'

/**
 * Estado de scroll mutable FUERA de React. Lo escriben los ScrollTriggers
 * (useSectionTriggers) y lo lee la capa 3D en useFrame, sin re-renders.
 */
export interface ScrollState {
  /** Progreso global de la página (0–1). */
  progress: number
  /** Sección activa (la que cruza el centro del viewport). */
  section: SectionId
  /** Progreso dentro de la sección activa (0–1). */
  sectionProgress: number
}

export const scrollState: ScrollState = {
  progress: 0,
  section: 'hero',
  sectionProgress: 0,
}

if (import.meta.env.DEV) {
  ;(window as unknown as { __scrollState: ScrollState }).__scrollState = scrollState
}
