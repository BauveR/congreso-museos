export interface AuthUser {
  uid: string
  email: string
  displayName: string
}

export interface AuthApi {
  mode: 'mock' | 'firebase'
  user: AuthUser | null
  isAdmin: boolean
  loading: boolean
  /** Token para la API (Authorization: Bearer). */
  getIdToken(): Promise<string>
  signOut(): Promise<void>
  /** Firebase: inicio de sesión con Google. */
  signInWithGoogle(): Promise<void>
  /** Firebase: envía un enlace de acceso al correo. */
  sendEmailLink(email: string): Promise<void>
  /** Firebase: correo pendiente de confirmar al volver del enlace (si no se recuerda). */
  pendingEmailLink: boolean
  completeEmailLink(email: string): Promise<void>
  /** Mock: inicio de sesión simulado. */
  mockSignIn(user: { name: string; email: string; admin: boolean }): void
}
