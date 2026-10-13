/**
 * Imágenes servidas desde ImageKit: el contenido guarda la URL completa del
 * original y aquí se le añaden las transformaciones (ancho, calidad, formato).
 */

/** Ancho por defecto de la primera fuente (<img src>). */
export const IMAGE_WIDTHS = [800, 1600] as const

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
