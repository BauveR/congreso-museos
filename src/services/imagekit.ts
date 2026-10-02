/**
 * Stub de ImageKit. FUERA DE ALCANCE en esta fase: mientras no haya
 * endpoint configurado, devuelve la ruta local sin transformar.
 */

export interface ImageTransform {
  width?: number
  quality?: number
}

const endpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT

export function imageUrl(path: string, _transform: ImageTransform = {}): string {
  if (!endpoint) return path
  // TODO: construir la URL con transformaciones (tr:w-…,q-…).
  return path
}
