import { dataMode } from './env.js'
import { getAdminApp } from './firebase.js'
import { HttpError } from './http.js'

export interface AuthUser {
  uid: string
  email: string
  name: string
  admin: boolean
}

/**
 * Token simulado (solo DATA_MODE=mock): "mock." + base64url(JSON del usuario).
 * Lo genera el AuthProvider mock del navegador.
 */
function decodeMockToken(token: string): AuthUser {
  try {
    const user = JSON.parse(Buffer.from(token.slice(5), 'base64url').toString('utf8')) as Partial<AuthUser>
    if (!user.uid || !user.email) throw new Error()
    return { uid: String(user.uid), email: String(user.email), name: String(user.name ?? ''), admin: Boolean(user.admin) }
  } catch {
    throw new HttpError(401, 'Token no válido')
  }
}

/** Verifica el token del encabezado Authorization: Bearer <token>. */
export async function requireUser(request: Request): Promise<AuthUser> {
  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token) throw new HttpError(401, 'Inicia sesión para continuar')

  if (dataMode() === 'mock') {
    if (!token.startsWith('mock.')) throw new HttpError(401, 'Token no válido')
    return decodeMockToken(token)
  }

  const { getAuth } = await import('firebase-admin/auth')
  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(token, true)
    if (!decoded.email) throw new HttpError(403, 'La cuenta no tiene correo electrónico')
    if (decoded.email_verified === false) throw new HttpError(403, 'Verifica tu correo electrónico antes de inscribirte')
    return { uid: decoded.uid, email: decoded.email, name: String(decoded.name ?? ''), admin: decoded.admin === true }
  } catch (error) {
    if (error instanceof HttpError) throw error
    throw new HttpError(401, 'Sesión caducada o no válida, vuelve a iniciar sesión')
  }
}

/** Solo cuentas con la marca de administración (custom claim admin=true). */
export async function requireAdmin(request: Request): Promise<AuthUser> {
  const user = await requireUser(request)
  if (!user.admin) throw new HttpError(403, 'Acceso solo para administración')
  return user
}
