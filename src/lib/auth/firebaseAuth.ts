import type { Auth } from 'firebase/auth'
import { getFirebaseApp } from '../firebaseApp'

/* Firebase Auth (VITE_DATA_MODE=firebase), cargado bajo demanda. */

let authPromise: Promise<Auth> | null = null

export function getFirebaseAuth(): Promise<Auth> {
  authPromise ??= Promise.all([getFirebaseApp(), import('firebase/auth')]).then(([app, auth]) => {
    const instance = auth.getAuth(app)
    instance.languageCode = 'es'
    // Pruebas en local contra el emulador de Auth (npm run dev:emulators). Nunca en el build de producción.
    if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === 'true') {
      auth.connectAuthEmulator(instance, 'http://localhost:9099', { disableWarnings: true })
    }
    return instance
  })
  return authPromise
}

/** Correo guardado al pedir el enlace, para completar el acceso al volver. */
export const EMAIL_LINK_KEY = 'congreso.emailForSignIn'
