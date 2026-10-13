import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  confirmPasswordReset,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
} from 'firebase/auth'
import { getAuth as getAdminAuth } from 'firebase-admin/auth'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { requireUser } from '../../api/_lib/auth.js'
import { getAdminApp } from '../../api/_lib/firebase.js'
import * as registration from '../../api/registration.js'
import { checkPassword } from '../../shared/password.js'
import { describeAuthError } from '../../src/features/registration/authErrors.js'
import { canSendReset, countResetSend, sendWithContinueFallback } from '../../src/lib/auth/passwordReset.js'
import { validInput } from '../fixtures.js'
import { apiRequest, emulatorsRunning, PROJECT, resetEmulators, useFirebaseMode } from './helpers.js'

/*
 * Acceso de punta a punta con el SDK de Firebase del navegador (el mismo que
 * usa la web) contra el emulador de Auth: crear cuenta, entrar, errores con
 * su mensaje y su salida, recuperar la contraseña, Google y su convivencia
 * con la contraseña, y que el servidor acepte cada sesión sin verificar el correo.
 */

const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? 'localhost:9099'
const PASSWORD = 'volcanes del norte'

let app: FirebaseApp
let auth: Auth

/** Código del error que lanza `fn` (o 'sin error'). */
async function codeOf(fn: () => Promise<unknown>): Promise<string> {
  try {
    await fn()
    return 'sin error'
  } catch (e) {
    return (e as { code?: string }).code ?? String(e)
  }
}

/** Último código de recuperación de contraseña que el emulador «envió» a un correo. */
async function lastResetCode(email: string): Promise<{ oobCode: string; oobLink: string }> {
  const res = await fetch(`http://${authHost}/emulator/v1/projects/${PROJECT}/oobCodes`)
  const { oobCodes } = (await res.json()) as { oobCodes: { email: string; requestType: string; oobCode: string; oobLink: string }[] }
  const code = oobCodes.filter((c) => c.email === email && c.requestType === 'PASSWORD_RESET').at(-1)
  if (!code) throw new Error(`Sin correo de recuperación para ${email}`)
  return code
}

/** Credencial de Google de prueba (el emulador acepta un id_token sin firmar). */
const googleCredential = (email: string, sub = email) => GoogleAuthProvider.credential(JSON.stringify({ sub, email, email_verified: true }))

/** Token de la sesión actual, como el que la web manda a /api. */
const currentToken = () => auth.currentUser!.getIdToken()

describe.skipIf(!emulatorsRunning)('Acceso (emulador de Auth) con el SDK de la web', { timeout: 30_000 }, () => {
  beforeAll(() => {
    app = initializeApp({ apiKey: 'demo-api-key', projectId: PROJECT, authDomain: 'localhost' }, 'auth-tests')
    auth = getAuth(app)
    connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true })
  })

  beforeEach(async () => {
    useFirebaseMode()
    await signOut(auth)
    await resetEmulators()
    vi.spyOn(console, 'info').mockImplementation(() => undefined)
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  describe('crear cuenta', () => {
    it('con correo institucional: entra al momento, sin verificar el correo, y puede inscribirse', async () => {
      const { user } = await createUserWithEmailAndPassword(auth, 'ana.garcia@ull.edu.es', PASSWORD)
      expect(user.emailVerified).toBe(false)
      const token = await currentToken()
      await expect(requireUser(apiRequest(token))).resolves.toMatchObject({ email: 'ana.garcia@ull.edu.es' })
      const res = await registration.POST(apiRequest(token, { method: 'POST', body: validInput() }))
      expect(res.status).toBe(201)
    })

    it('correo ya registrado: mensaje claro y salidas a «entrar» y «recuperar»', async () => {
      await createUserWithEmailAndPassword(auth, 'ana@example.com', PASSWORD)
      await signOut(auth)
      const code = await codeOf(() => createUserWithEmailAndPassword(auth, 'ana@example.com', 'otra clave segura'))
      expect(code).toBe('auth/email-already-in-use')
      expect(describeAuthError({ code })).toMatchObject({ actions: ['signIn', 'reset'] })
    })

    it('las reglas de la web frenan contraseñas débiles antes de llegar a Firebase', () => {
      expect(Object.values(checkPassword('volcanes del norte', { email: 'ana@example.com' })).every(Boolean)).toBe(true)
      expect(checkPassword('corta').length).toBe(false)
      expect(checkPassword('congreso2026').notCommon).toBe(false)
      expect(checkPassword('garcia2026xx', { lastName: 'García' }).notPersonal).toBe(false)
    })

    it('correo mal escrito: «El correo no es válido»', async () => {
      const code = await codeOf(() => createUserWithEmailAndPassword(auth, 'ana@', PASSWORD))
      expect(code).toBe('auth/invalid-email')
      expect(describeAuthError({ code }).message).toBe('El correo no es válido.')
    })
  })

  describe('entrar', () => {
    beforeEach(async () => {
      await createUserWithEmailAndPassword(auth, 'luis@ulpgc.es', PASSWORD)
      await signOut(auth)
    })

    it('con su contraseña (también con el correo en mayúsculas y espacios, como lo escribe la web tras trim)', async () => {
      await signInWithEmailAndPassword(auth, 'LUIS@ULPGC.ES'.trim(), PASSWORD)
      expect(auth.currentUser?.email).toBe('luis@ulpgc.es')
      await expect(requireUser(apiRequest(await currentToken()))).resolves.toMatchObject({ email: 'luis@ulpgc.es' })
    })

    it('contraseña incorrecta o correo sin cuenta: el mismo mensaje (no revela si existe) y salidas a recuperar o crear', async () => {
      for (const [email, password] of [
        ['luis@ulpgc.es', 'no es esta'],
        ['nadie@ulpgc.es', PASSWORD],
      ]) {
        const code = await codeOf(() => signInWithEmailAndPassword(auth, email!, password!))
        expect(['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found'], `${email}: ${code}`).toContain(code)
        expect(describeAuthError({ code })).toEqual({ message: 'Correo o contraseña incorrectos.', actions: ['reset', 'signUp'] })
      }
    })

    it('quien creó su contraseña antes de las reglas nuevas (6 caracteres) sigue entrando', async () => {
      await getAdminAuth(getAdminApp()).createUser({ email: 'antigua@example.com', password: 'abc123' })
      await signInWithEmailAndPassword(auth, 'antigua@example.com', 'abc123')
      expect(auth.currentUser?.email).toBe('antigua@example.com')
    })

    it('cuenta desactivada: lo dice y el servidor rechaza su token anterior', async () => {
      const { user } = await signInWithEmailAndPassword(auth, 'luis@ulpgc.es', PASSWORD)
      const oldToken = await user.getIdToken()
      await signOut(auth)
      await getAdminAuth(getAdminApp()).updateUser(user.uid, { disabled: true })
      const code = await codeOf(() => signInWithEmailAndPassword(auth, 'luis@ulpgc.es', PASSWORD))
      expect(code).toBe('auth/user-disabled')
      expect(describeAuthError({ code }).message).toContain('desactivada')
      await expect(requireUser(apiRequest(oldToken))).rejects.toMatchObject({ status: 401 })
    })
  })

  describe('recuperar la contraseña', () => {
    beforeEach(async () => {
      await createUserWithEmailAndPassword(auth, 'marta@gobiernodecanarias.org', PASSWORD)
      await signOut(auth)
    })

    it('enlace con vuelta a la web → contraseña nueva → entra con la nueva y no con la antigua', async () => {
      await sendWithContinueFallback((withUrl) =>
        sendPasswordResetEmail(auth, 'marta@gobiernodecanarias.org', withUrl ? { url: 'http://localhost:5173/' } : undefined),
      )
      const { oobCode, oobLink } = await lastResetCode('marta@gobiernodecanarias.org')
      expect(decodeURIComponent(oobLink)).toContain('continueUrl=http://localhost:5173/')

      await confirmPasswordReset(auth, oobCode, 'mareas de otoño')
      expect(await codeOf(() => signInWithEmailAndPassword(auth, 'marta@gobiernodecanarias.org', PASSWORD))).not.toBe('sin error')
      await signInWithEmailAndPassword(auth, 'marta@gobiernodecanarias.org', 'mareas de otoño')
      expect(auth.currentUser?.email).toBe('marta@gobiernodecanarias.org')
    })

    it('si Firebase rechaza la dirección de vuelta, el correo sale igual sin ella', async () => {
      const calls: boolean[] = []
      await sendWithContinueFallback(async (withUrl) => {
        calls.push(withUrl)
        // El emulador no comprueba los dominios autorizados: se simula el rechazo de producción.
        if (withUrl) throw Object.assign(new Error('auth/unauthorized-continue-uri'), { code: 'auth/unauthorized-continue-uri' })
        await sendPasswordResetEmail(auth, 'marta@gobiernodecanarias.org')
      })
      expect(calls).toEqual([true, false])
      await expect(lastResetCode('marta@gobiernodecanarias.org')).resolves.toBeTruthy()
    })

    it('un enlace ya usado no sirve otra vez', async () => {
      await sendPasswordResetEmail(auth, 'marta@gobiernodecanarias.org')
      const { oobCode } = await lastResetCode('marta@gobiernodecanarias.org')
      await confirmPasswordReset(auth, oobCode, 'mareas de otoño')
      expect(await codeOf(() => confirmPasswordReset(auth, oobCode, 'otra mas segura'))).toMatch(/auth\/(invalid-action-code|expired-action-code)/)
    })

    it('tope de 3 envíos por pestaña', async () => {
      const data = new Map<string, string>()
      const tab = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) }
      let sent = 0
      for (let i = 0; i < 5; i++) {
        if (!canSendReset(tab)) continue
        await sendPasswordResetEmail(auth, 'marta@gobiernodecanarias.org')
        countResetSend(tab)
        sent++
      }
      expect(sent).toBe(3)
    })
  })

  describe('Google', () => {
    it('cuenta nueva con Google: entra y el servidor la acepta', async () => {
      await signInWithCredential(auth, googleCredential('pedro@gmail.com'))
      expect(auth.currentUser?.email).toBe('pedro@gmail.com')
      await expect(requireUser(apiRequest(await currentToken()))).resolves.toMatchObject({ email: 'pedro@gmail.com' })
    })

    it('quien entró con Google y luego intenta crear cuenta con contraseña: «ya existe», con salida', async () => {
      await signInWithCredential(auth, googleCredential('pedro@gmail.com'))
      await signOut(auth)
      const code = await codeOf(() => createUserWithEmailAndPassword(auth, 'pedro@gmail.com', PASSWORD))
      expect(code).toBe('auth/email-already-in-use')
      expect(describeAuthError({ code }).message).toContain('Google')
    })

    it('quien tiene contraseña y entra con Google (mismo correo): sigue siendo la misma cuenta y la misma inscripción', async () => {
      const { user } = await createUserWithEmailAndPassword(auth, 'eva@gmail.com', PASSWORD)
      const created = await registration.POST(apiRequest(await user.getIdToken(), { method: 'POST', body: validInput() }))
      expect(created.status).toBe(201)
      await signOut(auth)

      const code = await codeOf(() => signInWithCredential(auth, googleCredential('eva@gmail.com')))
      if (code === 'sin error') {
        // Google es proveedor de confianza para @gmail.com: Firebase une ambas formas de entrar en la misma cuenta.
        expect(auth.currentUser?.uid).toBe(user.uid)
        const res = await registration.GET(apiRequest(await currentToken()))
        expect(res.status).toBe(200)
      } else {
        // Si Firebase no las une, la web lo explica y ofrece entrar con la contraseña.
        expect(code).toBe('auth/account-exists-with-different-credential')
        expect(describeAuthError({ code }).actions).toEqual(['signIn', 'reset'])
      }
    })
  })

  it('sin conexión con el servicio de acceso: el mensaje distingue «sin internet» de «la red lo bloquea»', () => {
    expect(describeAuthError({ code: 'auth/network-request-failed' }, false).message).toContain('No tienes conexión')
    expect(describeAuthError({ code: 'auth/network-request-failed' }, true).message).toContain('redes de universidades')
  })

  it('demasiados intentos: mensaje para esperar', () => {
    expect(describeAuthError({ code: 'auth/too-many-requests' }).message).toContain('Espera unos minutos')
  })
})
