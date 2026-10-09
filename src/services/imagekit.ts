/**
 * Imágenes responsive, hoy locales y mañana en ImageKit sin tocar los
 * componentes: el contenido nombra el original (p. ej.
 * "galeria/Cmuseos.Jueves-183.jpg") y aquí se decide de dónde sale.
 * - Sin VITE_IMAGEKIT_URL_ENDPOINT: WebP pregenerados en
 *   public/media/<carpeta>/<nombre>-<ancho>.webp (con cwebp).
 * - Con él: el original subido a ImageKit con la misma ruta, redimensionado
 *   y en el mejor formato para cada navegador (tr:w-…,q-…,f-auto).
 */
import { cleanEnv } from '../../shared/env'

/** Anchos generados: móvil y pantallas grandes o retina. */
export const IMAGE_WIDTHS = [800, 1600] as const
const QUALITY = 72

const endpoint = cleanEnv(import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT)?.replace(/\/$/, '')

/** URL de un original a un ancho dado. */
export function imageUrl(file: string, width: number): string {
  if (endpoint) return `${endpoint}/tr:w-${width},q-${QUALITY},f-auto/${file}`
  return `/media/${file.replace(/\.[a-z]+$/i, '')}-${width}.webp`
}

/** `src` (el más pequeño) y `srcSet` con todos los anchos, para <img>. */
export function responsiveImage(file: string): { src: string; srcSet: string } {
  return {
    src: imageUrl(file, IMAGE_WIDTHS[0]),
    srcSet: IMAGE_WIDTHS.map((w) => `${imageUrl(file, w)} ${w}w`).join(', '),
  }
}
