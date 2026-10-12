/*
 * Acceso con Google por redirección (misma pestaña) en los navegadores de
 * iOS que no son Safari: Chrome (CriOS), Firefox (FxiOS), Edge (EdgiOS),
 * Opera (OPiOS) y la app de Google (GSA). En ellos la ventana de Google no
 * puede cerrarse sola y se queda en blanco en /__/auth/handler. El resto de
 * navegadores sigue con la ventana emergente, que ya funciona.
 *
 * La redirección recarga la página: antes de salir se apunta (una sola vez,
 * caduca a los 15 minutos) que se fue a Google, para mostrar «Entrando…» al
 * volver y llevar a la persona a la sección de inscripción.
 */

const IOS = /iPhone|iPad|iPod/
const NON_SAFARI_IOS = /CriOS|FxiOS|EdgiOS|OPiOS|\bGSA\//

/** ¿Hay que usar la redirección en este navegador? (iPadOS se presenta como Mac: se detecta por pantalla táctil). */
export function needsGoogleRedirect(userAgent: string, maxTouchPoints = 0): boolean {
  const ios = IOS.test(userAgent) || (/Macintosh/.test(userAgent) && maxTouchPoints > 1)
  return ios && NON_SAFARI_IOS.test(userAgent)
}

const KEY = 'congreso.googleRedirect'
/** Pasado este tiempo, la vuelta ya no se considera parte del acceso (p. ej. se abandonó a medias). */
export const REDIRECT_TTL_MS = 15 * 60_000

interface Storage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

function tabStorage(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

/** Apunta que se sale a Google (antes de signInWithRedirect). */
export function markGoogleRedirect(storage: Storage | null = tabStorage(), now = Date.now()) {
  try {
    storage?.setItem(KEY, String(now))
  } catch {
    // Sin almacenamiento: al volver no habrá «Entrando…», pero el acceso funciona igual.
  }
}

/** ¿Se vuelve ahora mismo de Google? (sin consumirlo). */
export function returningFromGoogle(storage: Storage | null = tabStorage(), now = Date.now()): boolean {
  try {
    const at = Number(storage?.getItem(KEY))
    return Number.isFinite(at) && at > 0 && now - at < REDIRECT_TTL_MS
  } catch {
    return false
  }
}

/** Da por terminada la vuelta de Google (un solo uso). */
export function clearGoogleRedirect(storage: Storage | null = tabStorage()) {
  try {
    storage?.removeItem(KEY)
  } catch {
    // Nada que limpiar.
  }
}
