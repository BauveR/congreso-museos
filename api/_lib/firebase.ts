import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { requireEnv } from './env.js'

/**
 * App de firebase-admin (solo DATA_MODE=firebase). Credenciales de la cuenta
 * de servicio en FIREBASE_SERVICE_ACCOUNT (JSON completo, en una línea).
 * Nunca se exponen al navegador.
 */
export function getAdminApp(): App {
  const existing = getApps()[0]
  if (existing) return existing
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
