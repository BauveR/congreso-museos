import type { Auth } from 'firebase/auth'
import { getFirebaseApp } from '../firebaseApp'

/* Firebase Auth (VITE_DATA_MODE=firebase), cargado bajo demanda. */

let authPromise: Promise<Auth> | null = null

export function getFirebaseAuth(): Promise<Auth> {
  authPromise ??= Promise.all([getFirebaseApp(), import('firebase/auth')]).then(([app, auth]) => {
    const instance = auth.getAuth(app)
    instance.languageCode = 'es'
    return instance
  })
  return authPromise
}

/** Correo guardado al pedir el enlace, para completar el acceso al volver. */
export const EMAIL_LINK_KEY = 'congreso.emailForSignIn'
