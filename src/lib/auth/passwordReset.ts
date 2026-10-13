import { authErrorCode } from './types'

/*
 * Recuperar la contraseña sin quedarse atascado:
 * - Si Firebase rechaza la dirección de vuelta («Continuar» tras cambiarla:
 *   dominio no autorizado, p. ej. una vista previa de Vercel), se reenvía
 *   sin ella: el correo llega igual, solo sin ese botón.
 * - Tope de envíos por pestaña: Firebase bloquea temporalmente el correo
 *   tras muchos envíos seguidos («too-many-requests»), y entonces nadie
 *   desde esa red recibiría el enlace.
 */

/** Errores de Firebase por la dirección de vuelta: se reintenta sin ella. */
const CONTINUE_URL_ERRORS = new Set(['auth/unauthorized-continue-uri', 'auth/invalid-continue-uri', 'auth/missing-continue-uri'])

/** Envía con dirección de vuelta y, si Firebase la rechaza, sin ella. */
export async function sendWithContinueFallback(send: (withContinueUrl: boolean) => Promise<void>): Promise<void> {
  try {
    await send(true)
  } catch (e) {
    if (!CONTINUE_URL_ERRORS.has(authErrorCode(e))) throw e
    await send(false)
  }
}

/** Enlaces de recuperación que se pueden pedir desde una misma pestaña. */
export const MAX_RESET_SENDS = 3
const SENT_KEY = 'congreso.resetSends'

type Store = Pick<Storage, 'getItem' | 'setItem'> | null

function sentCount(storage: Store): number {
  try {
    return Number(storage?.getItem(SENT_KEY)) || 0
  } catch {
    return 0
  }
}

/** ¿Quedan envíos en esta pestaña? Sin almacenamiento, sí (el freno de Firebase sigue ahí). */
export function canSendReset(storage: Store): boolean {
  return sentCount(storage) < MAX_RESET_SENDS
}

/** Anota un envío hecho. */
export function countResetSend(storage: Store): void {
  try {
    storage?.setItem(SENT_KEY, String(sentCount(storage) + 1))
  } catch {
    /* sin almacenamiento: solo queda el freno de Firebase */
  }
}
