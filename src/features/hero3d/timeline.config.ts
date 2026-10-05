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
}

export type Keyframes = Record<SectionId, Pose>

const pose = (p: Partial<Pose>): Pose => ({ x: 0, y: 0, scale: 1, ...p })

/** En móvil el objeto queda centrado; en escritorio se desplaza a los lados. */
export const timeline: Record<Breakpoint, Keyframes> = {
  mobile: {
    hero: pose({ y: 0.05, scale: 0.9 }),
    presentacion: pose({ y: 0.2, scale: 0.7 }),
    'por-que': pose({ scale: 0.6 }),
    ponentes: pose({ y: 0.3, scale: 0.5 }),
    cinetico: pose({ scale: 0.9 }),
    umbral: pose({ scale: 0.3 }),
    descripcion: pose({ scale: 0.6 }),
    agenda: pose({ scale: 0.5 }),
    inscripciones: pose({ y: 0.2, scale: 0.8 }),
    contacto: pose({ scale: 0.6 }),
  },
  desktop: {
    hero: pose({ x: 0.15, y: -0.2, scale: 1.1 }),
    presentacion: pose({ x: 0.6, scale: 0.8 }),
    'por-que': pose({ y: 0.1, scale: 0.6 }),
    ponentes: pose({ x: -0.5, y: 0.2, scale: 0.6 }),
    cinetico: pose({ x: 0.5, scale: 1 }),
    umbral: pose({ scale: 0.3 }),
    descripcion: pose({ x: 0.55, scale: 0.8 }),
    agenda: pose({ x: 0.6, scale: 0.7 }),
    inscripciones: pose({ y: 0.1, scale: 0.9 }),
    contacto: pose({ x: -0.5, scale: 0.6 }),
  },
}

/**
 * Color de la esfera en cada sección (se interpola al pasar de una a otra).
 * Hasta "umbral" el fondo es oscuro; desde "descripcion" es claro, así que
 * ahí se usan tonos más oscuros para que la esfera siga viéndose.
 */
export const sectionColors: Record<SectionId, string> = {
  hero: '#d1e132', // lima de marca
  presentacion: '#a8e06b', // verde claro
  'por-que': '#7fd8be', // menta
  ponentes: '#e8eadf', // blanco cálido
  cinetico: '#d1e132', // lima: momento fuerte
  umbral: '#f2f1ec', // se funde con el velo claro de la transición
  descripcion: '#4d5800', // oliva (acento del tema claro)
  agenda: '#2f6f5e', // verde profundo
  inscripciones: '#8a9a00', // lima oscuro
  contacto: '#111311', // casi negro
}

/** Pulso de la esfera: amplitud (fracción del tamaño), periodo y frames por segundo. */
export const PULSE = { amplitude: 0.04, period: 2.6, fps: 30 }

/**
 * Desenfoque de la esfera (sin borde visible):
 * - `edge`: desde dónde se difumina, medido del centro (1) a la silueta (0);
 *   con 1 la transparencia cae desde el centro y no queda contorno.
 * - `falloff`: curva de esa caída (más alto = núcleo más pequeño y más difuso).
 * - `haloSize`: tamaño del halo respecto al radio.
 * - `haloSoftness`: dónde empieza a caer el halo (más bajo = más difuso).
 * - `haloIntensity`: opacidad base del halo (el pulso la hace respirar).
 */
export const SPHERE_BLUR = { edge: 1, falloff: 2.6, haloSize: 4.2, haloSoftness: 0, haloIntensity: 0.6 }

/** Interpola entre las poses de dos secciones. */
export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    scale: a.scale + (b.scale - a.scale) * t,
  }
}

/**
 * GLB a usar en lugar de la esfera (ruta en /public). Con `null` se usa la
 * esfera procedural.
 */
export const MODEL_URL: string | null = null
