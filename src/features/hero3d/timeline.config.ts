import type { SectionId } from '../../content/types'
import type { Breakpoint } from '../../hooks/useBreakpoint'

/**
 * Pose del modelo en una sección. `x` e `y` son fracciones del semiancho y
 * semialto visibles (-1…1), así la posición es la misma en cualquier
 * viewport. `scale` multiplica el tamaño base que fija useFitCamera.
 */
export interface Pose {
  x: number
  y: number
  scale: number
  rotX: number
  rotY: number
  rotZ: number
}

export type Keyframes = Record<SectionId, Pose>

const BASE: Pose = { x: 0, y: 0, scale: 1, rotX: 0, rotY: 0, rotZ: 0 }
const pose = (p: Partial<Pose>): Pose => ({ ...BASE, ...p })

/** En móvil el objeto queda centrado; en escritorio se desplaza a los lados. */
export const timeline: Record<Breakpoint, Keyframes> = {
  mobile: {
    hero: pose({ y: 0.25, scale: 1.1, rotX: 0.3 }),
    presentacion: pose({ y: 0.2, scale: 0.7, rotX: 0.6, rotY: 0.8 }),
    'por-que': pose({ scale: 0.6, rotX: 0.9, rotY: 1.6 }),
    ponentes: pose({ y: 0.3, scale: 0.5, rotX: 1.2, rotY: 2.4 }),
    cinetico: pose({ scale: 0.9, rotX: 1.5, rotY: 3.2, rotZ: 0.4 }),
    umbral: pose({ scale: 0.3, rotX: 1.7, rotY: 3.6 }),
    descripcion: pose({ scale: 0.6, rotX: 1.8, rotY: 4 }),
    agenda: pose({ scale: 0.5, rotX: 2.1, rotY: 4.8 }),
    inscripciones: pose({ y: 0.2, scale: 0.8, rotX: 2.4, rotY: 5.6 }),
    contacto: pose({ scale: 0.6, rotX: 2.7, rotY: 6.4 }),
  },
  desktop: {
    hero: pose({ x: 0.55, scale: 1, rotX: 0.3 }),
    presentacion: pose({ x: 0.6, scale: 0.8, rotX: 0.6, rotY: 0.8 }),
    'por-que': pose({ x: 0, y: 0.1, scale: 0.6, rotX: 0.9, rotY: 1.6 }),
    ponentes: pose({ x: -0.5, y: 0.2, scale: 0.6, rotX: 1.2, rotY: 2.4 }),
    cinetico: pose({ x: 0.5, scale: 1, rotX: 1.5, rotY: 3.2, rotZ: 0.4 }),
    umbral: pose({ scale: 0.3, rotX: 1.7, rotY: 3.6 }),
    descripcion: pose({ x: 0.55, scale: 0.8, rotX: 1.8, rotY: 4 }),
    agenda: pose({ x: 0.6, scale: 0.7, rotX: 2.1, rotY: 4.8 }),
    inscripciones: pose({ x: 0, y: 0.1, scale: 0.9, rotX: 2.4, rotY: 5.6 }),
    contacto: pose({ x: -0.5, scale: 0.6, rotX: 2.7, rotY: 6.4 }),
  },
}

/** Interpola entre las poses de dos secciones. */
export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const lerp = (k: keyof Pose) => a[k] + (b[k] - a[k]) * t
  return {
    x: lerp('x'),
    y: lerp('y'),
    scale: lerp('scale'),
    rotX: lerp('rotX'),
    rotY: lerp('rotY'),
    rotZ: lerp('rotZ'),
  }
}

/**
 * GLB a usar en lugar del PlaceholderModel (ruta en /public). Con `null` se
 * usa la geometría procedural.
 */
export const MODEL_URL: string | null = null
