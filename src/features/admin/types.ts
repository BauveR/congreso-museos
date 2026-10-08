import type { RegistrationData } from '../../../shared/registration'

/** Inscripción tal como la devuelve /api/admin/registrations. */
export interface AdminRegistration {
  uid: string
  email: string
  data: RegistrationData
  createdAt: string
  updatedAt: string
}
