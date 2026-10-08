import type { FirebaseApp } from 'firebase/app'
import type { AppCheck } from 'firebase/app-check'
import { cleanEnv } from '../../shared/env'

/*
 * App de Firebase del navegador (VITE_DATA_MODE=firebase), compartida por
 * Auth y App Check. El SDK se carga bajo demanda: nunca en la portada.
 */

let appPromise: Promise<FirebaseApp> | null = null

export function getFirebaseApp(): Promise<FirebaseApp> {
  appPromise ??= import('firebase/app').then((app) =>
    app.initializeApp({
      apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
      authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
      projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
      appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID),
    }),
  )
  return appPromise
}

const DATA_MODE = cleanEnv(import.meta.env.VITE_DATA_MODE)
const RECAPTCHA_SITE_KEY = cleanEnv(import.meta.env.VITE_RECAPTCHA_SITE_KEY)

let appCheckPromise: Promise<AppCheck> | null = null

/**
 * Comprobante de App Check (reCAPTCHA Enterprise) para /api: demuestra que la
 * petición sale de esta web y no de un script. Sin clave configurada o en
 * modo mock, undefined (el servidor decide si lo exige: APP_CHECK).
 * El SDK lo guarda y renueva solo; reCAPTCHA solo evalúa al renovarlo.
 */
export async function getAppCheckToken(): Promise<string | undefined> {
  if (DATA_MODE !== 'firebase' || !RECAPTCHA_SITE_KEY) return undefined
  try {
    appCheckPromise ??= Promise.all([getFirebaseApp(), import('firebase/app-check')]).then(([app, appCheck]) =>
      appCheck.initializeAppCheck(app, {
        provider: new appCheck.ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true,
      }),
    )
    const { getToken } = await import('firebase/app-check')
    return (await getToken(await appCheckPromise)).token
  } catch {
    // Sin comprobante (bloqueador, red): el servidor lo registra o lo rechaza según APP_CHECK.
    return undefined
  }
}
