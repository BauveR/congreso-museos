import { HttpError } from './http.js'

/**
 * Límite de peticiones por clave (p. ej. uid) en una ventana de tiempo.
 * Es "best effort": vive en memoria de cada instancia serverless. Frena el
 * abuso desde una misma sesión; para algo estricto, añadir App Check.
 */
const hits = new Map<string, number[]>()

export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= max) {
    throw new HttpError(429, 'Demasiados intentos, espera un momento y vuelve a probar')
  }
  recent.push(now)
  hits.set(key, recent)
}
