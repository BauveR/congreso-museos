export interface AuthUser {
  uid: string
  email: string
  displayName: string
}

export interface SignUpInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

/** Código de error de autenticación ("auth/…") de Firebase o del modo mock. */
export function authErrorCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') return error.code
  if (error instanceof Error && error.message.startsWith('auth/')) return error.message
  return 'unknown'
}

export interface AuthApi {
  mode: 'mock' | 'firebase'
  user: AuthUser | null
  isAdmin: boolean
  loading: boolean
  /** Token para la API (Authorization: Bearer). */
  getIdToken(): Promise<string>
  signOut(): Promise<void>
  /** Inicio de sesión con Google (en mock, cuenta de prueba). */
  signInWithGoogle(): Promise<void>
  /** Alta con correo y contraseña (el nombre queda como displayName). */
  signUpWithPassword(input: SignUpInput): Promise<void>
  signInWithPassword(email: string, password: string): Promise<void>
  /** Envía el correo para restablecer la contraseña. */
  resetPassword(email: string): Promise<void>
  /** Firebase: envía un enlace de acceso al correo. */
  sendEmailLink(email: string): Promise<void>
  /** Firebase: correo pendiente de confirmar al volver del enlace (si no se recuerda). */
  pendingEmailLink: boolean
  completeEmailLink(email: string): Promise<void>
  /** Mock: inicio de sesión simulado. */
  mockSignIn(user: { name: string; email: string; admin: boolean }): void
}
