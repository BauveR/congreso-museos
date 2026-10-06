import type { SectionId } from '../../content/types'

/**
 * Estado de scroll mutable FUERA de React. Lo escriben los ScrollTriggers
 * (useSectionTriggers) y lo lee la capa 3D en useFrame, sin re-renders.
 */
export interface ScrollState {
  /** Secciones en orden de aparición en el DOM. */
  sections: SectionId[]
  /** Sección activa (la que cruza el centro del viewport). */
  section: SectionId
  sectionIndex: number
  /** Progreso dentro de la sección activa (0–1). */
  sectionProgress: number
  /**
   * Progreso normalizado por secciones (0–1): cada sección ocupa 1/n del
   * recorrido, independientemente de su altura. Es lo que consume el 3D.
   */
  progress: number
  /** Saltar sin amortiguación en el próximo frame (navegación con fundido). */
  snap: boolean
}

export const scrollState: ScrollState = {
  sections: [],
  section: 'hero',
  sectionIndex: 0,
  sectionProgress: 0.5,
  progress: 0,
  snap: false,
}

const listeners = new Set<() => void>()

/** Suscripción a cambios de scroll (p. ej. para invalidar el frameloop "demand"). */
export function subscribeScroll(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Pide que el 3D vaya directo al estado actual (sin recorrer las poses intermedias). */
export function requestSnap() {
  scrollState.snap = true
  notifyScroll()
}

export function notifyScroll() {
  listeners.forEach((listener) => listener())
}

if (import.meta.env.DEV) {
  ;(window as unknown as { __scrollState: ScrollState }).__scrollState = scrollState
}
