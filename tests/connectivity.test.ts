import { beforeEach, describe, expect, it } from 'vitest'
import * as adminConnectivity from '../api/admin/connectivity.js'
import { MemoryStore } from '../api/_lib/store/memory.js'
import { today } from '../api/_lib/store/types.js'
import * as telemetry from '../api/telemetry.js'
import { sumEvents } from '../shared/connectivity.js'

/*
 * Conexión en redes difíciles, lado servidor: contador anónimo
 * (/api/telemetry) y su lectura en administración. La parte del navegador
 * está en src/lib/connectivity.test.ts.
 */

const token = (user: { uid: string; email: string; admin?: boolean }) =>
  'mock.' + Buffer.from(JSON.stringify({ name: 'Test', ...user })).toString('base64url')
const admin = token({ uid: 'adm', email: 'admin@example.com', admin: true })
const ana = token({ uid: 'ana', email: 'ana@example.com' })

let ipCounter = 0
/** Cada test con su IP: el límite de peticiones vive en memoria entre tests. */
const nextIp = () => `10.0.0.${++ipCounter}`

/** Aviso desde la propia web (mismo origen), salvo que se indique otro. */
const beacon = (body: string, ip = nextIp(), from: Record<string, string> = { origin: 'http://localhost' }) =>
  telemetry.POST(new Request('http://localhost/api/telemetry', { method: 'POST', headers: { 'x-forwarded-for': ip, ...from }, body }))

const getCounts = (auth?: string) =>
  adminConnectivity.GET(new Request('http://localhost/api/admin/connectivity', { headers: auth ? { authorization: `Bearer ${auth}` } : {} }))

beforeEach(() => {
  globalThis.__congresoMockStore = new MemoryStore()
})

describe('contador anónimo de conexión', () => {
  it('cuenta los eventos válidos del día, sin datos personales', async () => {
    const ip = nextIp()
    expect((await beacon(JSON.stringify({ event: 'visit' }), ip)).status).toBe(204)
    expect((await beacon(JSON.stringify({ event: 'visit' }), ip)).status).toBe(204)
    expect((await beacon(JSON.stringify({ event: 'failed' }), ip)).status).toBe(204)

    const res = await getCounts(admin)
    expect(res.status).toBe(200)
    const data = (await res.json()) as { days: { day: string; counts: Record<string, number> }[] }
    expect(data.days).toEqual([{ day: today(), counts: { visit: 2, failed: 1 } }])
  })

  it('rechaza eventos desconocidos, JSON roto y cuerpos grandes', async () => {
    expect((await beacon(JSON.stringify({ event: 'hola' }))).status).toBe(400)
    expect((await beacon(JSON.stringify({ event: 'visit', uid: 'x'.repeat(300) }))).status).toBe(413)
    expect((await beacon('no es json')).status).toBe(400)
    expect((await beacon('null')).status).toBe(400)
  })

  it('solo acepta avisos de la propia web (Origin o, si falta, Referer)', async () => {
    const visit = JSON.stringify({ event: 'visit' })
    expect((await beacon(visit, nextIp(), { origin: 'https://otra-web.example' })).status).toBe(403)
    expect((await beacon(visit, nextIp(), {})).status).toBe(403)
    expect((await beacon(visit, nextIp(), { referer: 'http://localhost/inscripcion' })).status).toBe(204)
    expect((await beacon(visit, nextIp(), { referer: 'https://otra-web.example/' })).status).toBe(403)
  })

  it('limita las peticiones por IP', async () => {
    const ip = nextIp()
    for (let i = 0; i < 30; i++) expect((await beacon(JSON.stringify({ event: 'slow' }), ip)).status).toBe(204)
    expect((await beacon(JSON.stringify({ event: 'slow' }), ip)).status).toBe(429)
  })

  it('solo administración puede leer los contadores', async () => {
    expect((await getCounts()).status).toBe(401)
    expect((await getCounts(ana)).status).toBe(403)
  })

  it('suma por evento desde una fecha', () => {
    const days = [
      { day: '2026-10-01', counts: { visit: 10, failed: 1 } },
      { day: '2026-10-08', counts: { visit: 5, slow: 2 } },
    ]
    expect(sumEvents(days)).toMatchObject({ visit: 15, failed: 1, slow: 2, 'auth-network': 0 })
    expect(sumEvents(days, '2026-10-05')).toMatchObject({ visit: 5, failed: 0, slow: 2 })
  })
})
