import { describe, expect, it } from 'vitest'
import { csvCell, toCsv } from '../shared/csv.js'
import { registrationSchema } from '../shared/registration.js'
import { applyRegistrationChange, CapacityError, DEFAULT_SESSIONS, validateSessionPatch, type Session } from '../shared/sessions.js'
import { MemoryStore } from '../api/_lib/store/memory.js'
import { validInput } from './fixtures.js'

const sessionsMap = (sessions: Session[]) => new Map(sessions.map((s) => [s.id, s]))
const data = (sessionIds: string[]) => registrationSchema.parse({ ...validInput(), sessionIds })
const smallStore = (capacity: number) =>
  new MemoryStore(DEFAULT_SESSIONS.map((s) => ({ ...s, capacity })))
const counts = async (store: MemoryStore) =>
  Object.fromEntries((await store.listSessions()).map((s) => [s.id, s.registered]))

describe('reglas de aforo (puras)', () => {
  const sessions = sessionsMap(DEFAULT_SESSIONS.map((s) => ({ ...s, registered: 10, capacity: 11 })))

  it('solo suma las sesiones añadidas y resta las quitadas', () => {
    const result = applyRegistrationChange(sessions, ['dia-19', 'dia-20'], ['dia-20', 'dia-21'])
    expect(Object.fromEntries(result)).toEqual({ 'dia-21': 11, 'dia-19': 9 })
  })

  it('rechaza una sesión llena o inactiva', () => {
    const full = sessionsMap(DEFAULT_SESSIONS.map((s) => ({ ...s, registered: 80 })))
    expect(() => applyRegistrationChange(full, [], ['dia-19'])).toThrow(CapacityError)
    const inactive = sessionsMap(DEFAULT_SESSIONS.map((s) => ({ ...s, active: false })))
    expect(() => applyRegistrationChange(inactive, [], ['dia-19'])).toThrow(CapacityError)
  })

  it('no puede bajar el aforo por debajo de los inscritos', () => {
    const session = { ...DEFAULT_SESSIONS[0]!, registered: 50 }
    expect(() => validateSessionPatch(session, { capacity: 49 })).toThrow(/ya hay 50/)
    expect(validateSessionPatch(session, { capacity: 50 })).toEqual({ capacity: 50 })
    expect(() => validateSessionPatch(session, { capacity: 2.5 })).toThrow(CapacityError)
    expect(() => validateSessionPatch(session, { capacity: -1 })).toThrow(CapacityError)
  })
})

describe('MemoryStore (misma lógica que Firestore)', () => {
  it('una sola inscripción por persona: editar no duplica plazas', async () => {
    const store = smallStore(80)
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19', 'dia-20']))
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19', 'dia-20']))
    await store.saveRegistration('u1', 'a@example.com', data(['dia-20', 'dia-21']))
    expect(await counts(store)).toEqual({ 'dia-19': 0, 'dia-20': 1, 'dia-21': 1 })
    expect(await store.listRegistrations()).toHaveLength(1)
  })

  it('cambiar el aforo no altera los contadores', async () => {
    const store = smallStore(80)
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19']))
    await store.updateSession('dia-19', { capacity: 120 })
    await store.updateSession('dia-19', { capacity: 1 })
    expect(await counts(store)).toMatchObject({ 'dia-19': 1 })
    await expect(store.updateSession('dia-19', { capacity: 0 })).rejects.toThrow(CapacityError)
  })

  it('la última plaza no se la llevan dos personas a la vez', async () => {
    const store = smallStore(1)
    const results = await Promise.allSettled([
      store.saveRegistration('u1', 'a@example.com', data(['dia-19'])),
      store.saveRegistration('u2', 'b@example.com', data(['dia-19'])),
    ])
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1)
    expect(await counts(store)).toMatchObject({ 'dia-19': 1 })
  })

  it('quien ya tiene un día lleno puede editar el resto de su inscripción', async () => {
    const store = smallStore(1)
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19']))
    await expect(store.saveRegistration('u1', 'a@example.com', data(['dia-19', 'dia-20']))).resolves.toBeTruthy()
  })

  it('cancelar libera las plazas', async () => {
    const store = smallStore(80)
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19', 'dia-21']))
    await store.cancelRegistration('u1')
    expect(await counts(store)).toEqual({ 'dia-19': 0, 'dia-20': 0, 'dia-21': 0 })
    expect(await store.cancelRegistration('u1')).toBeNull()
  })

  it('recount repara contadores desajustados', async () => {
    const store = smallStore(80)
    await store.saveRegistration('u1', 'a@example.com', data(['dia-19']))
    await store.saveRegistration('u2', 'b@example.com', data(['dia-19', 'dia-20']))
    const sessions = await store.recount()
    expect(sessions.map((s) => s.registered)).toEqual([2, 1, 0])
  })
})

describe('CSV', () => {
  it('neutraliza fórmulas (inyección de CSV)', () => {
    expect(csvCell('=HYPERLINK("http://x")')).toBe(`"'=HYPERLINK(""http://x"")"`)
    expect(csvCell('+34 600')).toBe("'+34 600")
    expect(csvCell('@SUM(A1)')).toBe("'@SUM(A1)")
  })
  it('escapa separadores, comillas y saltos de línea', () => {
    expect(csvCell('a;b')).toBe('"a;b"')
    expect(csvCell('di "hola"')).toBe('"di ""hola"""')
    expect(csvCell('línea 1\nlínea 2')).toBe('"línea 1\nlínea 2"')
  })
  it('incluye BOM UTF-8 para Excel', () => {
    expect(toCsv(['Nombre'], [['Ana']]).startsWith('﻿Nombre\r\nAna')).toBe(true)
  })
})
