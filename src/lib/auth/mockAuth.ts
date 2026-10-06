import type { AuthUser } from './types'

/*
 * Autenticación simulada (VITE_DATA_MODE=mock). El "token" es el usuario en
 * base64url con prefijo "mock."; el servidor solo lo acepta en modo mock y
 * nunca en producción.
 */

const KEY = 'congreso.mockUser'

export interface MockUser extends AuthUser {
  admin: boolean
}

export function loadMockUser(): MockUser | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as MockUser) : null
  } catch {
    return null
  }
}

export function saveMockUser(user: MockUser | null) {
  try {
    if (user) localStorage.setItem(KEY, JSON.stringify(user))
    else localStorage.removeItem(KEY)
  } catch {
    // Sin almacenamiento (modo privado): la sesión dura lo que la pestaña.
  }
}

/** uid estable a partir del correo (así la misma persona recupera su inscripción). */
export function mockUid(email: string) {
  return 'mock-' + email.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
}

export function mockToken(user: MockUser) {
  const json = JSON.stringify({ uid: user.uid, email: user.email, name: user.displayName, admin: user.admin })
  const base64 = btoa(String.fromCharCode(...new TextEncoder().encode(json)))
  return 'mock.' + base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
