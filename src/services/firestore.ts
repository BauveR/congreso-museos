/**
 * Stub de Firestore. FUERA DE ALCANCE en esta fase: no se instala el SDK.
 * Cuando se implemente, inicializar Firebase con las variables VITE_FIREBASE_*.
 */

export interface RegistrationRequest {
  name: string
  email: string
  organization?: string
}

export async function saveRegistration(_data: RegistrationRequest): Promise<void> {
  throw new Error('firestore.saveRegistration: no implementado')
}
