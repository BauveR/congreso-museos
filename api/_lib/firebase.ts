import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { env, requireEnv } from './env.js'

/** ¿Hay emuladores de Firebase? (las variables las pone `firebase emulators:exec` o .env.emulators). */
export const usingEmulators = () => Boolean(env('FIRESTORE_EMULATOR_HOST') || env('FIREBASE_AUTH_EMULATOR_HOST'))

/**
 * App de firebase-admin (solo DATA_MODE=firebase). Credenciales de la cuenta
 * de servicio en FIREBASE_SERVICE_ACCOUNT (JSON completo, en una línea).
 * Nunca se exponen al navegador.
 * Con emuladores: sin credenciales y con un proyecto «demo-…», que Firebase
 * nunca conecta con servicios reales. Prohibido en producción.
 */
export function getAdminApp(): App {
  const existing = getApps()[0]
  if (existing) return existing
  if (usingEmulators()) {
    if (process.env.VERCEL_ENV === 'production') throw new Error('Los emuladores de Firebase no se pueden usar en producción')
    const projectId = env('GCLOUD_PROJECT') ?? 'demo-congreso'
    if (!projectId.startsWith('demo-')) throw new Error(`Con emuladores, el proyecto debe ser «demo-…» (es «${projectId}»)`)
    return initializeApp({ projectId })
  }
  const serviceAccount = JSON.parse(requireEnv('FIREBASE_SERVICE_ACCOUNT')) as {
    project_id: string
    client_email: string
    private_key: string
  }
  return initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  })
}
