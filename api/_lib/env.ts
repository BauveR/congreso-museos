/*
 * Configuración del servidor. Los archivos de /api que empiezan por "_" no
 * son funciones de Vercel: son código compartido.
 *
 * DATA_MODE:
 * - "mock" (por defecto): sin Firebase. Datos en memoria del proceso y
 *   autenticación simulada. Solo para desarrollo.
 * - "firebase": Firestore + verificación real de tokens (firebase-admin).
 */

export type DataMode = 'mock' | 'firebase'

export function dataMode(): DataMode {
  return process.env.DATA_MODE === 'firebase' ? 'firebase' : 'mock'
}

/**
 * En producción de Vercel nunca se acepta el modo mock (su autenticación es
 * simulada): las peticiones fallan en lugar de exponer datos.
 */
export function assertSafeMode() {
  if (process.env.VERCEL_ENV === 'production' && dataMode() !== 'firebase') {
    throw new Error('DATA_MODE=firebase es obligatorio en producción')
  }
}

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Falta la variable de entorno ${name}`)
  return value
}
