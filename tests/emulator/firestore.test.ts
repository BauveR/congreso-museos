import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as adminRegistrations from '../../api/admin/registrations.js'
import * as adminSessions from '../../api/admin/sessions.js'
import { getAdminApp } from '../../api/_lib/firebase.js'
import { FirestoreStore } from '../../api/_lib/store/firestore.js'
import * as registration from '../../api/registration.js'
import * as sessionsApi from '../../api/sessions.js'
import { registrationSchema } from '../../shared/registration.js'
import { CapacityError } from '../../shared/sessions.js'
import { validInput } from '../fixtures.js'
import { apiRequest, emulatorsRunning, resetEmulators, signIn, signUp, useFirebaseMode } from './helpers.js'

/*
 * El almacenamiento real (FirestoreStore) y la API de punta a punta contra
 * los emuladores: los mismos casos que tests/capacity.test.ts prueba en
 * memoria, más lo que solo Firestore puede romper (transacciones con varias
 * personas a la vez, subcolección privada, incrementos atómicos) y tokens
 * reales de Firebase Auth.
 */

const data = (sessionIds: string[], extra: Record<string, unknown> = {}) => registrationSchema.parse({ ...validInput(), sessionIds, ...extra })
const counts = async (store: FirestoreStore) => Object.fromEntries((await store.listSessions()).map((s) => [s.id, s.registered]))
/** Deja un día con `capacity` plazas (el resto, como vienen: 80). */
const withCapacity = async (store: FirestoreStore, id: string, capacity: number) => store.updateSession(id, { capacity })

describe.skipIf(!emulatorsRunning)('Firestore (emulador): almacenamiento', { timeout: 30_000 }, () => {
  let store: FirestoreStore

  beforeEach(async () => {
    useFirebaseMode()
    await resetEmulators()
    store = new FirestoreStore()
  })

  it('una sola inscripción por persona: editar no duplica plazas', async () => {
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19', 'dia-20']))
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19', 'dia-20']))
    await store.saveRegistration('u1', 'a@example.com', data(['dia-20', 'dia-21']))
    expect(await counts(store)).toEqual({ 'dia-19': 0, 'dia-20': 1, 'dia-21': 1 })
    expect(await store.listRegistrations()).toHaveLength(1)
  })

  it('cambiar el aforo no altera los contadores ni deja bajarlo de los inscritos', async () => {
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19']))
    await withCapacity(store, 'dia-19', 120)
    await withCapacity(store, 'dia-19', 1)
    expect(await counts(store)).toMatchObject({ 'dia-19': 1 })
    await expect(withCapacity(store, 'dia-19', 0)).rejects.toThrow(CapacityError)
  })

  it('la última plaza no se la llevan dos personas a la vez', async () => {
    await withCapacity(store, 'dia-19', 1)
    const results = await Promise.allSettled([
      store.saveRegistration('u1', 'a@example.com', data(['dia-19'])),
      store.saveRegistration('u2', 'b@example.com', data(['dia-19'])),
    ])
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1)
    const rejected = results.find((r) => r.status === 'rejected') as PromiseRejectedResult
    expect(rejected.reason).toBeInstanceOf(CapacityError)
    expect(await counts(store)).toMatchObject({ 'dia-19': 1 })
  })

  it('con 10 personas a la vez por 3 plazas, entran exactamente 3', async () => {
    await withCapacity(store, 'dia-20', 3)
    const results = await Promise.allSettled(
      Array.from({ length: 10 }, (_, i) => store.saveRegistration(`u${i}`, `p${i}@example.com`, data(['dia-20']))),
    )
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(3)
    expect(await counts(store)).toMatchObject({ 'dia-20': 3 })
    expect(await store.listRegistrations()).toHaveLength(3)
  })

  it('quien ya tiene un día lleno puede editar el resto de su inscripción', async () => {
    await withCapacity(store, 'dia-19', 1)
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19']))
    await expect(store.saveRegistration('u1', 'a@example.com', data(['dia-19', 'dia-20']))).resolves.toBeTruthy()
    expect(await counts(store)).toMatchObject({ 'dia-19': 1, 'dia-20': 1 })
  })

  it('cancelar libera las plazas y borra también los datos privados', async () => {
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19', 'dia-21'], { certificate: true, idDocument: { type: 'dni', number: '12345678Z' } }))
    await store.cancelRegistration('u1')
    expect(await counts(store)).toEqual({ 'dia-19': 0, 'dia-20': 0, 'dia-21': 0 })
    expect(await store.cancelRegistration('u1')).toBeNull()
    const identity = await getFirestore(getAdminApp()).doc('registrations/u1/private/identity').get()
    expect(identity.exists).toBe(false)
  })

  it('el documento de identidad va aparte (subcolección privada) y se recupera al leer', async () => {
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19'], { certificate: true, idDocument: { type: 'dni', number: '12345678Z' } }))
    const db = getFirestore(getAdminApp())
    const main = (await db.doc('registrations/u1').get()).data()
    expect(JSON.stringify(main)).not.toContain('12345678Z')
    expect((await db.doc('registrations/u1/private/identity').get()).data()).toEqual({ idDocument: { type: 'dni', number: '12345678Z' } })
    expect((await store.getRegistration('u1'))?.data.idDocument).toEqual({ type: 'dni', number: '12345678Z' })
    expect((await store.listRegistrations())[0]?.data.idDocument).toEqual({ type: 'dni', number: '12345678Z' })
  })

  it('quitar el certificado borra el documento guardado', async () => {
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19'], { certificate: true, idDocument: { type: 'dni', number: '12345678Z' } }))
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19']))
    expect((await getFirestore(getAdminApp()).doc('registrations/u1/private/identity').get()).exists).toBe(false)
  })

  it('recount repara contadores desajustados', async () => {
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19']))
    await store.saveRegistration('u2', 'b@example.com', data(['dia-19', 'dia-20']))
    await getFirestore(getAdminApp()).doc('sessions/dia-19').update({ registered: 40 })
    const sessions = await store.recount()
    expect(sessions.map((s) => s.registered)).toEqual([2, 1, 0])
  })

  it('cupo diario de correos: 3 por persona y día, independiente entre personas', async () => {
    const day = await Promise.all([1, 2, 3, 4].map(() => store.consumeMailQuota('u1', 3)))
    expect(day.filter(Boolean)).toHaveLength(3)
    expect(await store.consumeMailQuota('u2', 3)).toBe(true)
  })

  it('contadores de conexión: incrementos atómicos aunque lleguen a la vez', async () => {
    await Promise.all(Array.from({ length: 10 }, () => store.countEvent('visit', '2026-10-12')))
    await store.countEvent('failed', '2026-10-12')
    await store.countEvent('visit', '2026-10-01')
    expect(await store.listEventCounts('2026-10-05')).toEqual([{ day: '2026-10-12', counts: { visit: 10, failed: 1 } }])
  })
})

describe.skipIf(!emulatorsRunning)('API (emulador): de punta a punta con tokens reales', { timeout: 30_000 }, () => {
  beforeEach(async () => {
    useFirebaseMode()
    await resetEmulators()
    vi.spyOn(console, 'info').mockImplementation(() => undefined)
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
  })

  it('cuenta con contraseña sin verificar: crea, modifica y cancela su inscripción', async () => {
    const { idToken } = await signUp('lucia.hernandez@ulpgc.es')
    const created = await registration.POST(apiRequest(idToken, { method: 'POST', body: { ...validInput(), email: 'otra@example.com' } }))
    expect(created.status).toBe(201)
    // El correo sale del token, nunca del formulario.
    expect(((await created.json()) as { registration: { email: string } }).registration.email).toBe('lucia.hernandez@ulpgc.es')

    expect((await registration.POST(apiRequest(idToken, { method: 'POST', body: { ...validInput(), sessionIds: ['dia-20'] } }))).status).toBe(200)
    const remaining = ((await (await sessionsApi.GET(new Request('http://localhost/api/sessions'))).json()) as { sessions: { remaining: number }[] }).sessions.map((s) => s.remaining)
    expect(remaining).toEqual([80, 79, 80])

    expect((await registration.DELETE(apiRequest(idToken, { method: 'DELETE' }))).status).toBe(200)
    expect((await registration.DELETE(apiRequest(idToken, { method: 'DELETE' }))).status).toBe(404)
  })

  it('administración: solo con la marca admin en el token (403 sin ella)', async () => {
    const { uid, idToken } = await signUp('organizacion@example.com')
    expect((await adminSessions.GET(apiRequest(idToken))).status).toBe(403)

    await getAuth(getAdminApp()).setCustomUserClaims(uid, { admin: true })
    const adminToken = await signIn('organizacion@example.com')
    expect((await adminSessions.GET(apiRequest(adminToken))).status).toBe(200)
    expect((await adminRegistrations.GET(apiRequest(adminToken))).status).toBe(200)
  })

  it('aforo completo responde 409 y no cuenta plaza', async () => {
    const { uid } = await signUp('organizacion@example.com')
    await getAuth(getAdminApp()).setCustomUserClaims(uid, { admin: true })
    const adminToken = await signIn('organizacion@example.com')
    await adminSessions.PATCH(apiRequest(adminToken, { method: 'PATCH', body: { id: 'dia-21', capacity: 0 } }))

    const { idToken } = await signUp('ana@example.com')
    const res = await registration.POST(apiRequest(idToken, { method: 'POST', body: { ...validInput(), sessionIds: ['dia-21'] } }))
    expect(res.status).toBe(409)
  })
})
