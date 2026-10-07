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

const ACCOUNTS_KEY = 'congreso.mockAccounts'

interface MockAccount {
  name: string
  password: string
}

function loadAccounts(): Record<string, MockAccount> {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '{}') as Record<string, MockAccount>
  } catch {
    return {}
  }
}

/**
 * Cuentas con contraseña simuladas (solo en este navegador). Reproduce los
 * errores de Firebase para probar los mensajes. Lanza el código del error.
 */
export function mockPasswordAccount(mode: 'signUp' | 'signIn', email: string, password: string, name = ''): string {
  const key = email.trim().toLowerCase()
  const accounts = loadAccounts()
  const existing = accounts[key]
  if (mode === 'signUp') {
    if (existing) throw new Error('auth/email-already-in-use')
    if (password.length < 6) throw new Error('auth/weak-password')
    accounts[key] = { name, password }
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
    } catch {
      // Sin almacenamiento: la cuenta dura lo que la sesión.
    }
    return name
  }
  if (!existing || existing.password !== password) throw new Error('auth/invalid-credential')
  return existing.name
}
