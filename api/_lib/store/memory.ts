import type { RegistrationData } from '../../../shared/registration.js'
import {
  applyRegistrationChange,
  CapacityError,
  DEFAULT_SESSIONS,
  validateSessionPatch,
  type Session,
  type SessionPatch,
} from '../../../shared/sessions.js'
import type { Registration, SaveResult, Store } from './types.js'

/**
 * Almacenamiento en memoria (DATA_MODE=mock). Las operaciones se encadenan
 * en una cola para imitar las transacciones de Firestore: nunca se
 * intercalan dos escrituras (p. ej. dos personas por la última plaza).
 */
export class MemoryStore implements Store {
  private sessions = new Map<string, Session>()
  private registrations = new Map<string, Registration>()
  private queue: Promise<unknown> = Promise.resolve()

  constructor(sessions: Session[] = DEFAULT_SESSIONS) {
    for (const s of sessions) this.sessions.set(s.id, { ...s })
  }

  private transaction<T>(fn: () => T): Promise<T> {
    const run = this.queue.then(fn)
    this.queue = run.catch(() => undefined)
    return run
  }

  async listSessions() {
    return [...this.sessions.values()].sort((a, b) => a.order - b.order).map((s) => ({ ...s }))
  }

  updateSession(id: string, patch: SessionPatch) {
    return this.transaction(() => {
      const session = this.sessions.get(id)
      if (!session) throw new CapacityError('La sesión no existe', id)
      const updated = { ...session, ...validateSessionPatch(session, patch) }
      this.sessions.set(id, updated)
      return { ...updated }
    })
  }

  async getRegistration(uid: string) {
    const reg = this.registrations.get(uid)
    return reg ? structuredClone(reg) : null
  }

  saveRegistration(uid: string, email: string, data: RegistrationData) {
    return this.transaction((): SaveResult => {
      const previous = this.registrations.get(uid)
      const counts = applyRegistrationChange(this.sessions, previous?.data.sessionIds ?? [], data.sessionIds)
      for (const [id, registered] of counts) this.sessions.set(id, { ...this.sessions.get(id)!, registered })

      const now = new Date().toISOString()
      const registration: Registration = {
        uid,
        email,
        data: structuredClone(data),
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
      }
      this.registrations.set(uid, registration)
      return { registration: structuredClone(registration), created: !previous }
    })
  }

  cancelRegistration(uid: string) {
    return this.transaction(() => {
      const previous = this.registrations.get(uid)
      if (!previous) return null
      const counts = applyRegistrationChange(this.sessions, previous.data.sessionIds, [])
      for (const [id, registered] of counts) this.sessions.set(id, { ...this.sessions.get(id)!, registered })
      this.registrations.delete(uid)
      return structuredClone(previous)
    })
  }

  async listRegistrations() {
    return [...this.registrations.values()].map((r) => structuredClone(r))
  }

  recount() {
    return this.transaction(() => {
      const counts = new Map<string, number>()
      for (const reg of this.registrations.values()) {
        for (const id of reg.data.sessionIds) counts.set(id, (counts.get(id) ?? 0) + 1)
      }
      for (const [id, session] of this.sessions) this.sessions.set(id, { ...session, registered: counts.get(id) ?? 0 })
      return [...this.sessions.values()].sort((a, b) => a.order - b.order).map((s) => ({ ...s }))
    })
  }
}
