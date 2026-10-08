import type { RegistrationData } from '../../../shared/registration.js'
import type { Session, SessionPatch } from '../../../shared/sessions.js'

export interface Registration {
  uid: string
  /** Correo verificado de la cuenta (no se acepta del formulario). */
  email: string
  data: RegistrationData
  createdAt: string
  updatedAt: string
}

export interface SaveResult {
  registration: Registration
  created: boolean
  /** ¿Cambiaron los días respecto a la versión anterior? (al crear, sí). */
  sessionsChanged: boolean
}

/** Día (AAAA-MM-DD, UTC) para los cupos diarios. */
export const today = () => new Date().toISOString().slice(0, 10)

/** ¿Tienen dos listas de días los mismos elementos? */
export const sameSessions = (a: readonly string[], b: readonly string[]) =>
  a.length === b.length && a.every((id) => b.includes(id))

/**
 * Almacenamiento de sesiones e inscripciones. Implementaciones: memoria
 * (mock) y Firestore. Las dos aplican las mismas reglas de aforo
 * (shared/sessions.ts) dentro de una transacción.
 */
export interface Store {
  listSessions(): Promise<Session[]>
  updateSession(id: string, patch: SessionPatch): Promise<Session>
  getRegistration(uid: string): Promise<Registration | null>
  /** Crea o actualiza la inscripción del usuario (una por persona). */
  saveRegistration(uid: string, email: string, data: RegistrationData): Promise<SaveResult>
  /** Cancela la inscripción y libera sus plazas. Devuelve la cancelada, si existía. */
  cancelRegistration(uid: string): Promise<Registration | null>
  listRegistrations(): Promise<Registration[]>
  /** Recalcula los contadores desde las inscripciones (reparación). */
  recount(): Promise<Session[]>
  /**
   * Cupo diario de correos por persona (persistente, a diferencia del límite
   * de peticiones): cuenta uno más y devuelve false si ya llegó a `max` hoy.
   */
  consumeMailQuota(uid: string, max: number): Promise<boolean>
}
