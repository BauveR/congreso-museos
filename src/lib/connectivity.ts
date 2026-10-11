import { useEffect, useState } from 'react'
import type { ConnectivityEvent } from '../../shared/connectivity'

/*
 * Conexión en redes difíciles (universidades, administraciones): estados de
 * carga progresivos, señales anónimas a /api/telemetry y recarga única tras
 * un despliegue. Nada de esto actúa si todo carga a tiempo.
 */

/** A partir de aquí, «está tardando». */
export const SLOW_MS = 8_000
/** A partir de aquí, la carga se da por fallida (las peticiones GET se cortan). */
export const TIMEOUT_MS = 20_000

interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

/** sessionStorage, o nada si el navegador lo bloquea. */
function tabStorage(): KeyValueStorage | null {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

/**
 * ¿Se puede hacer esto una vez en esta pestaña? Marca y devuelve true la
 * primera vez; después, false. Sin almacenamiento, nunca (evita bucles).
 */
export function once(key: string, storage: KeyValueStorage | null = tabStorage()): boolean {
  if (!storage) return false
  try {
    if (storage.getItem(key)) return false
    storage.setItem(key, '1')
    return true
  } catch {
    return false
  }
}

/** Señal anónima (una por pestaña y tipo). Nunca lanza ni retrasa nada. */
export function reportConnectivity(event: ConnectivityEvent) {
  if (!once(`connectivity:${event}`)) return
  const body = JSON.stringify({ event })
  try {
    if (navigator.sendBeacon?.('/api/telemetry', body)) return
  } catch {
    // Sin sendBeacon: fetch.
  }
  void fetch('/api/telemetry', { method: 'POST', body, keepalive: true }).catch(() => undefined)
}

export type LoadPhase = 'loading' | 'slow' | 'error'

/**
 * Fase visible de una carga: «cargando», «está tardando» (tras SLOW_MS) o
 * «error». null cuando ya ha cargado. Anota las cargas lentas y fallidas.
 */
export function useLoadPhase(loading: boolean, failed: boolean): LoadPhase | null {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (!loading || failed) return
    const id = setTimeout(() => {
      setSlow(true)
      reportConnectivity('slow')
    }, SLOW_MS)
    return () => {
      clearTimeout(id)
      setSlow(false)
    }
  }, [loading, failed])

  useEffect(() => {
    if (failed) reportConnectivity('failed')
  }, [failed])

  if (failed) return 'error'
  if (loading) return slow ? 'slow' : 'loading'
  return null
}

/** ¿Es el error de un archivo JS que ya no existe (versión anterior tras un despliegue)? */
export function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(message)
}

/**
 * Tras un despliegue, una pestaña abierta con la versión anterior pide
 * archivos que ya no existen: se recarga una sola vez para traer la nueva.
 * Devuelve true si va a recargar.
 */
export function reloadForStaleChunk(): boolean {
  if (!once('reload:stale-chunk')) return false
  reportConnectivity('stale-chunk')
  window.location.reload()
  return true
}

/** Escucha el aviso de Vite cuando falla la carga de un chunk (llamar una vez al arrancar). */
export function listenForStaleChunks() {
  window.addEventListener('vite:preloadError', (event) => {
    if (reloadForStaleChunk()) event.preventDefault()
  })
}
