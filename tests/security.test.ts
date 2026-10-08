import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as adminRegistrations from '../api/admin/registrations.js'
import { MemoryStore } from '../api/_lib/store/memory.js'
import * as registration from '../api/registration.js'
import * as sessions from '../api/sessions.js'
import { validInput } from './fixtures.js'

/* Medidas de la revisión de seguridad: cupo de correos, cierre de inscripciones y cancelación por administración. */

const token = (user: { uid: string; email: string; admin?: boolean }) =>
  'mock.' + Buffer.from(JSON.stringify({ name: 'Test', ...user })).toString('base64url')
const ana = token({ uid: 'ana', email: 'ana@example.com' })
const admin = token({ uid: 'adm', email: 'admin@example.com', admin: true })

const call = (fn: (r: Request) => Promise<Response>, init: { method?: string; auth?: string; body?: unknown; query?: string } = {}) =>
  fn(
    new Request(`http://localhost/api/x${init.query ?? ''}`, {
      method: init.method ?? 'GET',
      headers: init.auth ? { authorization: `Bearer ${init.auth}` } : {},
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    }),
  )
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const body = async (res: Response): Promise<any> => res.json()
const save = (input: unknown, auth = ana) => call(registration.POST, { method: 'POST', auth, body: input })

beforeEach(() => {
  globalThis.__congresoMockStore = new MemoryStore()
  process.env.MAIL_PROVIDER = 'console'
  vi.spyOn(console, 'info').mockImplementation(() => undefined)
})
afterEach(() => {
  delete process.env.REGISTRATION_OPEN
})

describe('cupo de correos', () => {
  it('cambios menores no envían correo; cambiar de días sí', async () => {
    expect((await body(await save(validInput()))).emailSent).toBe(true)
    expect((await body(await save({ ...validInput(), phone: '612 000 111' }))).emailSent).toBeNull()
    expect((await body(await save({ ...validInput(), sessionIds: ['dia-20'] }))).emailSent).toBe(true)
  })

  it('como máximo 3 correos por persona y día', async () => {
    const days = [['dia-19'], ['dia-20'], ['dia-21'], ['dia-19', 'dia-20']]
    const sent = []
    for (const sessionIds of days) sent.push((await body(await save({ ...validInput(), sessionIds }))).emailSent)
    expect(sent).toEqual([true, true, true, null])
  })
})

describe('inscripciones cerradas (REGISTRATION_OPEN=false)', () => {
  it('el público no puede inscribirse; administración sí; se informa en /api/sessions', async () => {
    process.env.REGISTRATION_OPEN = 'false'
    expect((await body(await call(sessions.GET))).open).toBe(false)
    expect((await save(validInput())).status).toBe(403)
    expect((await save(validInput(), admin)).status).toBe(201)
  })

  it('cancelar la propia inscripción sigue permitido', async () => {
    await save(validInput())
    process.env.REGISTRATION_OPEN = 'false'
    expect((await call(registration.DELETE, { method: 'DELETE', auth: ana })).status).toBe(200)
  })
})

describe('cancelación por administración', () => {
  it('solo administración; libera las plazas', async () => {
    await save(validInput())
    expect((await call(adminRegistrations.DELETE, { method: 'DELETE', auth: ana, query: '?uid=ana' })).status).toBe(403)
    expect((await call(adminRegistrations.DELETE, { method: 'DELETE', auth: admin, query: '?uid=ana' })).status).toBe(200)
    expect((await call(adminRegistrations.DELETE, { method: 'DELETE', auth: admin, query: '?uid=ana' })).status).toBe(404)
    const day = (await body(await call(sessions.GET))).sessions.find((s: { id: string }) => s.id === 'dia-19')
    expect(day.remaining).toBe(80)
  })
})
