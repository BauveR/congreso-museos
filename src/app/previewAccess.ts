import { useEffect, useState } from 'react'
import { safeStorage } from '../lib/safeStorage'

/** Parámetro del enlace para quien prueba: /?acceso=CLAVE */
const PARAM = 'acceso'
const STORAGE_KEY = 'previewAccess'
/** Huella SHA-256 (hex) de la clave: la clave nunca está en el código publicado. */
const KEY_HASH = import.meta.env.VITE_PREVIEW_KEY_HASH?.trim().toLowerCase()

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Acceso anticipado con «en construcción» activo: con el enlace ?acceso=CLAVE
 * se ve la web completa y el navegador la recuerda. El parámetro se quita de
 * la barra de direcciones. Barrera para no mostrar la web antes de tiempo,
 * no protección de datos (eso son las reglas de Firestore y /api).
 */
async function checkPreviewAccess(): Promise<boolean> {
  if (!KEY_HASH) return false
  const url = new URL(window.location.href)
  const fromLink = url.searchParams.get(PARAM)
  if (fromLink !== null) {
    url.searchParams.delete(PARAM)
    window.history.replaceState(window.history.state, '', url)
  }
  const key = fromLink?.trim() || safeStorage.get(STORAGE_KEY)
  if (!key || (await sha256(key)) !== KEY_HASH) return false
  safeStorage.set(STORAGE_KEY, key)
  return true
}

/** null mientras se comprueba (no se pinta nada para no mostrar un parpadeo). */
export function usePreviewAccess(enabled: boolean): boolean | null {
  const [access, setAccess] = useState<boolean | null>(enabled ? null : false)
  useEffect(() => {
    if (enabled) void checkPreviewAccess().then(setAccess, () => setAccess(false))
  }, [enabled])
  return access
}
