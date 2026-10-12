import { describe, expect, it } from 'vitest'
import { accessText, registrationText } from '../../content/inscripcion'
import { describeAuthError } from './authErrors'

/* Errores de acceso: mensaje claro y siempre una salida. */

const firebaseError = (code: string, customData?: Record<string, unknown>) => Object.assign(new Error(code), { code, customData })

describe('errores de acceso con salida', () => {
  it('correo ya registrado: entrar o recuperar la contraseña', () => {
    expect(describeAuthError(firebaseError('auth/email-already-in-use'))).toEqual({
      message: accessText.errors['auth/email-already-in-use'],
      actions: ['signIn', 'reset'],
    })
  })

  it('cuenta existente con otro método: entrar con el correo que trae el error', () => {
    const view = describeAuthError(firebaseError('auth/account-exists-with-different-credential', { email: 'ana@ull.edu.es' }))
    expect(view.actions).toEqual(['signIn', 'reset'])
    expect(view.email).toBe('ana@ull.edu.es')
  })

  it('correo o contraseña incorrectos: recuperar la contraseña o crear la cuenta', () => {
    for (const code of ['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found']) {
      expect(describeAuthError(firebaseError(code)).actions, code).toEqual(['reset', 'signUp'])
    }
  })

  it('cuenta desactivada: lo explica, sin salidas que no servirían', () => {
    expect(describeAuthError(firebaseError('auth/user-disabled'))).toEqual({ message: accessText.errors['auth/user-disabled'], actions: [] })
  })

  it('sin internet no se confunde con una red que bloquea', () => {
    expect(describeAuthError(firebaseError('auth/network-request-failed'), false).message).toBe(accessText.errors.offline)
    expect(describeAuthError(firebaseError('auth/network-request-failed'), true).message).toBe(accessText.errors['auth/network-request-failed'])
  })

  it('un error desconocido da el mensaje genérico', () => {
    expect(describeAuthError(new Error('algo raro'))).toEqual({ message: registrationText.genericError, actions: [] })
  })
})
