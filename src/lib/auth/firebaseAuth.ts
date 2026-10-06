import type { FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'

/*
 * Firebase Auth (VITE_DATA_MODE=firebase). El SDK se carga bajo demanda:
 * solo en las páginas de inscripción y administración, nunca en la landing.
 */

let authPromise: Promise<Auth> | null = null

export function getFirebaseAuth(): Promise<Auth> {
  authPromise ??= Promise.all([import('firebase/app'), import('firebase/auth')]).then(([app, auth]) => {
    const firebaseApp: FirebaseApp = app.initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    })
    const instance = auth.getAuth(firebaseApp)
    instance.languageCode = 'es'
    return instance
  })
  return authPromise
}

/** Correo guardado al pedir el enlace, para completar el acceso al volver. */
export const EMAIL_LINK_KEY = 'congreso.emailForSignIn'
