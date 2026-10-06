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
}

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
}
