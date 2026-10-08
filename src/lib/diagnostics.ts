import { useSyncExternalStore } from 'react'

/** Un error registrado para el panel de diagnóstico (solo administración lo ve). */
export interface DiagnosticEntry {
  id: number
  time: Date
  /** Dónde ocurrió: «POST /api/registration», «Acceso con Google»… */
  context: string
  message: string
  /** Estado HTTP (0: sin conexión con el servidor). */
  status?: number
  /** Código de Firebase u otro identificador del error. */
  code?: string
  /** Referencia del servidor: la misma línea en el log de Vercel. */
  ref?: string
  /** Detalle técnico (el servidor solo lo envía a administración). */
  detail?: string
}

/** Errores recientes que se conservan (en memoria, solo esta pestaña). */
const MAX = 30

let entries: DiagnosticEntry[] = []
let nextId = 1
const listeners = new Set<() => void>()
/** Errores ya anotados: la capa de API los anota y el formulario no los repite. */
const seen = new WeakSet<object>()

const emit = () => listeners.forEach((l) => l())

/**
 * Anota un error. Admite cualquier valor lanzado; `extra` completa o
 * sustituye lo que se deduce de él (estado, ref, detalle…).
 */
export function reportError(context: string, error: unknown, extra: Partial<DiagnosticEntry> = {}) {
  if (error && typeof error === 'object') {
    if (seen.has(error)) return
    seen.add(error)
  }
  const code = error && typeof error === 'object' && 'code' in error && typeof error.code === 'string' ? error.code : undefined
  const entry: DiagnosticEntry = {
    id: nextId++,
    time: new Date(),
    context,
    message: error instanceof Error ? error.message : String(error),
    code,
    detail: error instanceof Error && !extra.detail ? error.stack : undefined,
    ...extra,
  }
  entries = [entry, ...entries].slice(0, MAX)
  emit()
}

export function clearDiagnostics() {
  entries = []
  emit()
}

export function useDiagnostics(): DiagnosticEntry[] {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => entries,
  )
}

let globalCapture = false

/** Anota también los errores no capturados de la página (una sola vez). */
export function captureGlobalErrors() {
  if (globalCapture) return
  globalCapture = true
  window.addEventListener('error', (e) => reportError('Error no capturado', e.error ?? e.message))
  window.addEventListener('unhandledrejection', (e) => reportError('Promesa rechazada sin capturar', e.reason))
}
