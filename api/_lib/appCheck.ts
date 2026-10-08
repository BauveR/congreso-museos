import { dataMode, env } from './env.js'
import { getAdminApp } from './firebase.js'
import { HttpError } from './http.js'

/**
 * Firebase App Check (reCAPTCHA Enterprise): la petición debe venir de la
 * web del congreso, no de un script. APP_CHECK decide qué se hace:
 * - "off" (por defecto): no se comprueba.
 * - "monitor": se comprueba y solo se registra en el log si falla (para ver,
 *   antes de exigirlo, que la web legítima lo envía bien).
 * - "enforce": sin comprobante válido, 401.
 * Solo con DATA_MODE=firebase (en mock no hay comprobantes).
 */
export async function checkAppCheck(request: Request): Promise<void> {
  const mode = env('APP_CHECK') ?? 'off'
  if (mode === 'off' || dataMode() !== 'firebase') return

  const token = request.headers.get('x-firebase-appcheck') ?? ''
  let problem = token ? '' : 'sin comprobante'
  if (token) {
    try {
      const { getAppCheck } = await import('firebase-admin/app-check')
      await getAppCheck(getAdminApp()).verifyToken(token)
    } catch (error) {
      problem = `comprobante no válido (${error instanceof Error ? error.message : String(error)})`
    }
  }
  if (!problem) return

  console.warn(`[appcheck] ${mode}: ${problem} · ${request.method} ${new URL(request.url).pathname}`)
  if (mode === 'enforce') throw new HttpError(401, 'No hemos podido verificar la petición. Recarga la página e inténtalo de nuevo.')
}
