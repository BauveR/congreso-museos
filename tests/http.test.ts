import { describe, expect, it, vi } from 'vitest'
import { handler } from '../api/_lib/http.js'

const token = (user: { uid: string; email: string; admin?: boolean }) =>
  'mock.' + Buffer.from(JSON.stringify({ name: 'Test', ...user })).toString('base64url')

/** Manejador que falla con un error inesperado (500). */
const broken = handler(async () => {
  throw new Error('Falta la variable de entorno X')
})

const call = (auth?: string) =>
  broken(new Request('http://localhost/api/x', { headers: auth ? { authorization: `Bearer ${auth}` } : {} }))

describe('errores 500', () => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined)

  it('a cualquiera: mensaje genérico y referencia, sin detalle interno', async () => {
    const response = await call(token({ uid: 'ana', email: 'ana@example.com' }))
    const body = (await response.json()) as { error: string; ref: string; detail?: string }
    expect(response.status).toBe(500)
    expect(body.error).toBe('Error interno')
    expect(body.ref).toMatch(/^[0-9a-f]{8}$/)
    expect(body.detail).toBeUndefined()
  })

  it('a administración: además el detalle técnico', async () => {
    const response = await call(token({ uid: 'adm', email: 'admin@example.com', admin: true }))
    const body = (await response.json()) as { detail?: string }
    expect(body.detail).toContain('Falta la variable de entorno X')
  })
})
