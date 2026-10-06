import { beforeEach, describe, expect, it } from 'vitest'
import * as adminExport from '../api/admin/export.js'
import * as adminRegistrations from '../api/admin/registrations.js'
import * as adminSessions from '../api/admin/sessions.js'
import { MemoryStore } from '../api/_lib/store/memory.js'
import * as registration from '../api/registration.js'
import * as sessions from '../api/sessions.js'
import { validInput } from './fixtures.js'

/*
 * Endpoints de punta a punta en modo mock: se llaman las funciones tal como
 * las ejecuta Vercel (Request → Response), con tokens simulados.
 */

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

/** Cuerpo JSON sin tipar (solo pruebas). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const body = async (res: Response): Promise<any> => res.json()

beforeEach(() => {
  globalThis.__congresoMockStore = new MemoryStore() // sin datos de ejemplo
  process.env.MAIL_PROVIDER = 'console'
})

describe('API de inscripción', () => {
  it('las sesiones son públicas y muestran plazas libres', async () => {
    const res = await call(sessions.GET)
    const data = await body(res)
    expect(res.status).toBe(200)
    expect(data.sessions).toHaveLength(3)
    expect(data.sessions[0]).toEqual({ id: 'dia-19', title: expect.any(String), date: '2026-11-19', kind: 'day', remaining: 80 })
    expect(data.sessions[0]).not.toHaveProperty('registered')
  })

  it('sin token responde 401', async () => {
    expect((await call(registration.POST, { method: 'POST', body: validInput() })).status).toBe(401)
    expect((await call(registration.GET, { auth: 'mock.basura' })).status).toBe(401)
  })

  it('valida en el servidor (422 con errores por campo)', async () => {
    const res = await call(registration.POST, { method: 'POST', auth: ana, body: { ...validInput(), phone: '123' } })
    expect(res.status).toBe(422)
    expect((await body(res)).fields).toHaveProperty('phone')
  })

  it('crea, actualiza y cancela; el correo sale del token', async () => {
    const created = await call(registration.POST, {
      method: 'POST',
      auth: ana,
      body: { ...validInput(), email: 'otra@example.com' },
    })
    expect(created.status).toBe(201)
    expect((await body(created)).registration.email).toBe('ana@example.com')

    const updated = await call(registration.POST, { method: 'POST', auth: ana, body: { ...validInput(), sessionIds: ['dia-20'] } })
    expect(updated.status).toBe(200)

    const remaining = (await body(await call(sessions.GET))).sessions.map((s: { remaining: number }) => s.remaining)
    expect(remaining).toEqual([80, 79, 80])

    expect((await call(registration.DELETE, { method: 'DELETE', auth: ana })).status).toBe(200)
    expect((await call(registration.DELETE, { method: 'DELETE', auth: ana })).status).toBe(404)
  })

  it('aforo completo responde 409', async () => {
    await call(adminSessions.PATCH, { method: 'PATCH', auth: admin, body: { id: 'dia-21', capacity: 0 } })
    const res = await call(registration.POST, { method: 'POST', auth: ana, body: { ...validInput(), sessionIds: ['dia-21'] } })
    expect(res.status).toBe(409)
  })
})

describe('API de administración', () => {
  it('solo administración (403 para cuentas normales)', async () => {
    expect((await call(adminSessions.GET, { auth: ana })).status).toBe(403)
    expect((await call(adminRegistrations.GET, { auth: ana })).status).toBe(403)
    expect((await call(adminExport.GET, { auth: ana })).status).toBe(403)
  })

  it('no deja bajar el aforo por debajo de los inscritos (409)', async () => {
    await call(registration.POST, { method: 'POST', auth: ana, body: validInput() })
    const res = await call(adminSessions.PATCH, { method: 'PATCH', auth: admin, body: { id: 'dia-19', capacity: 0 } })
    expect(res.status).toBe(409)
    expect((await body(res)).error).toMatch(/ya hay 1/)
  })

  it('filtra y exporta CSV', async () => {
    await call(registration.POST, { method: 'POST', auth: ana, body: validInput() })
    const list = await body(await call(adminRegistrations.GET, { auth: admin, query: '?session=dia-20' }))
    expect(list.total).toBe(0)

    const res = await call(adminExport.GET, { auth: admin, query: '?session=dia-19' })
    expect(res.headers.get('content-type')).toContain('text/csv')
    const csv = await res.text()
    expect(csv).toContain('ana@example.com')
    expect(csv.split('\r\n')[0]).toContain('Día 1 · 19 de noviembre')
  })
})
