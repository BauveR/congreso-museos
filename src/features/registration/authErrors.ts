import { accessText, registrationText } from '../../content/inscripcion'
import { authErrorCode } from '../../lib/auth/types'

const t = accessText

/** Salidas que se ofrecen bajo un error: ir a «Ya tengo cuenta», recuperar la contraseña o crear la cuenta. */
export type RecoveryAction = keyof typeof accessText.errorActions

export interface AuthErrorView {
  message: string
  actions: RecoveryAction[]
  /** Correo que trae el error (p. ej. cuenta existente con otro método), para rellenar el campo. */
  email?: string
}

/** Correo que adjunta Firebase en algunos errores (customData.email). */
function errorEmail(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('customData' in error)) return undefined
  const data = (error as { customData?: { email?: unknown } }).customData
  return typeof data?.email === 'string' ? data.email : undefined
}

/**
 * Error de acceso → mensaje y salidas. Ningún error deja a la persona sin
 * saber qué hacer: si el correo ya tiene cuenta, entrar o recuperar la
 * contraseña; si no coincide la contraseña, recuperarla o crear la cuenta;
 * sin internet, decirlo (no culpar a la red de la institución).
 */
export function describeAuthError(error: unknown, online = typeof navigator === 'undefined' || navigator.onLine): AuthErrorView {
  const code = authErrorCode(error)
  switch (code) {
    case 'auth/email-already-in-use':
      return { message: t.errors[code]!, actions: ['signIn', 'reset'] }
    case 'auth/account-exists-with-different-credential':
      return { message: t.errors[code]!, actions: ['signIn', 'reset'], email: errorEmail(error) }
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return { message: t.errors[code]!, actions: ['reset', 'signUp'] }
    case 'auth/network-request-failed':
      return { message: online ? t.errors[code]! : t.errors.offline!, actions: [] }
    default:
      return { message: t.errors[code] ?? registrationText.genericError, actions: [] }
  }
}
