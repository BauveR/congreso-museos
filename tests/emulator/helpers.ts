/*
 * Utilidades para los tests contra los emuladores de Firebase
 * (npm run test:emulators). Solo funcionan con FIRESTORE_EMULATOR_HOST y
 * FIREBASE_AUTH_EMULATOR_HOST, que pone `firebase emulators:exec`: sin
 * emuladores, los tests se saltan (npm test normal sigue en memoria).
 */

export const PROJECT = process.env.GCLOUD_PROJECT ?? 'demo-congreso'
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST

/** ¿Están los emuladores? (para describe.skipIf). */
export const emulatorsRunning = Boolean(firestoreHost && authHost)

/** Servidor en modo Firebase (contra los emuladores) para estos tests. */
export function useFirebaseMode() {
  process.env.DATA_MODE = 'firebase'
  process.env.APP_CHECK = 'off'
  process.env.MAIL_PROVIDER = 'console'
}

/** Borra todos los documentos de Firestore y todas las cuentas de Auth del emulador. */
export async function resetEmulators() {
  if (!PROJECT.startsWith('demo-')) throw new Error('Solo se borran datos de un proyecto «demo-…»')
  await Promise.all([
    fetch(`http://${firestoreHost}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`, { method: 'DELETE' }),
    fetch(`http://${authHost}/emulator/v1/projects/${PROJECT}/accounts`, { method: 'DELETE' }),
  ])
}

/**
 * Crea una cuenta con correo y contraseña en el emulador de Auth (como la web
 * al registrarse: sin verificar) y devuelve su token de sesión real.
 */
export async function signUp(email: string, password = 'volcanes del norte'): Promise<{ uid: string; idToken: string }> {
  const response = await fetch(`http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  })
  const data = (await response.json()) as { localId?: string; idToken?: string; error?: { message: string } }
  if (!data.localId || !data.idToken) throw new Error(`signUp en el emulador: ${data.error?.message ?? response.status}`)
  return { uid: data.localId, idToken: data.idToken }
}

/** Petición como la que hace la web a /api, con el token de la cuenta. */
export function apiRequest(idToken: string, init: { method?: string; body?: unknown; query?: string } = {}) {
  return new Request(`http://localhost/api/x${init.query ?? ''}`, {
    method: init.method ?? 'GET',
    headers: { authorization: `Bearer ${idToken}` },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })
}
