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

/** Añade una transformación de ImageKit (?tr=…) a la URL completa de una imagen ya subida. */
export function withTransform(url: string, tr: string): string {
  return `${url}${url.includes('?') ? '&' : '?'}tr=${tr}`
}

/**
 * Fuentes para <picture> desde una URL completa de ImageKit: AVIF (lo más
 * ligero; ~5 veces menos que WebP con transparencia) y WebP de respaldo
 * para navegadores sin AVIF. Se pide el formato explícito: con f-auto,
 * ImageKit entrega WebP sin pérdida para los PNG con transparencia.
 */
export function imagekitPicture(url: string, widths: readonly number[], quality: number) {
  const srcSet = (format: 'avif' | 'webp') => widths.map((w) => `${withTransform(url, `w-${w},q-${quality},f-${format}`)} ${w}w`).join(', ')
  return {
    avif: srcSet('avif'),
    webp: srcSet('webp'),
    src: withTransform(url, `w-${widths[0] ?? IMAGE_WIDTHS[0]},q-${quality},f-webp`),
  }
}

/** `src` (el más pequeño) y `srcSet` con todos los anchos, para <img>. */
export function responsiveImage(file: string, widths: readonly number[] = IMAGE_WIDTHS): { src: string; srcSet: string } {
  return {
    src: imageUrl(file, widths[0] ?? IMAGE_WIDTHS[0]),
    srcSet: widths.map((w) => `${imageUrl(file, w)} ${w}w`).join(', '),
  }
}
