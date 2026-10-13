import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/*
 * Cabeceras y proxy de vercel.json para el acceso con Google y los correos
 * de Firebase en el dominio propio (/__/auth/ servido desde firebaseapp.com):
 * https://firebase.google.com/docs/auth/web/redirect-best-practices
 */

interface Rule {
  source: string
  destination?: string
  headers?: { key: string; value: string }[]
}
const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as { rewrites: Rule[]; headers: Rule[] }

/** ¿Aplica una regla de vercel.json (formato con grupos regex) a esta ruta? */
const matches = (source: string, path: string) => new RegExp(`^${source}$`).test(path)
/** Cabeceras que Vercel pondría en una ruta. */
const headersFor = (path: string) =>
  Object.fromEntries(config.headers.filter((rule) => matches(rule.source, path)).flatMap((rule) => rule.headers!.map((h) => [h.key, h.value])))

const csp = headersFor('/')['Content-Security-Policy'] ?? ''
const directive = (name: string) => csp.split(';').map((d) => d.trim()).find((d) => d.startsWith(`${name} `)) ?? ''

describe('proxy /__/auth', () => {
  it('se reenvía a Firebase antes de la SPA, que no lo captura', () => {
    const [first, spa] = config.rewrites
    expect(first).toMatchObject({ source: '/__/auth/:path*', destination: 'https://museos-de-canarias.firebaseapp.com/__/auth/:path*' })
    expect(matches(spa!.source, '/__/auth/handler')).toBe(false)
    expect(matches(spa!.source, '/api/sessions')).toBe(false)
    expect(matches(spa!.source, '/inscripcion')).toBe(true)
  })

  it('sus páginas (handler, iframe, action) no llevan la CSP ni X-Frame-Options ni COOP de la web', () => {
    for (const page of ['/__/auth/handler', '/__/auth/iframe', '/__/auth/action']) {
      const headers = headersFor(page)
      expect(headers, page).not.toHaveProperty('Content-Security-Policy')
      expect(headers, page).not.toHaveProperty('X-Frame-Options')
      expect(headers, page).not.toHaveProperty('Cross-Origin-Opener-Policy')
      expect(headers['X-Content-Type-Options'], page).toBe('nosniff')
    }
  })
})

describe('cabeceras de la web', () => {
  it('conserva la protección completa en el resto de rutas', () => {
    for (const page of ['/', '/inscripcion', '/admin']) {
      const headers = headersFor(page)
      expect(headers['X-Frame-Options'], page).toBe('DENY')
      expect(headers['Content-Security-Policy'], page).toContain("default-src 'self'")
    }
  })

  it('HTTPS obligatorio (HSTS) en todas las rutas, sin preload (fácil de retirar)', () => {
    for (const page of ['/', '/api/sessions', '/__/auth/handler']) {
      expect(headersFor(page)['Strict-Transport-Security'], page).toBe('max-age=63072000')
    }
  })

  it('COOP permite la ventana de Google (same-origin la rompería)', () => {
    expect(headersFor('/')['Cross-Origin-Opener-Policy']).toBe('same-origin-allow-popups')
  })

  it("frame-src admite el iframe de Firebase en el propio dominio ('self') y en firebaseapp.com (para volver atrás)", () => {
    expect(directive('frame-src').split(' ')).toEqual(expect.arrayContaining(["'self'", 'https://museos-de-canarias.firebaseapp.com']))
  })
})
