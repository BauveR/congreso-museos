import { safeStorage } from './safeStorage'

/** Parámetro y almacenamiento del acceso anticipado (ver app/previewAccess.ts). */
export const PREVIEW_PARAM = 'acceso'
export const PREVIEW_STORAGE_KEY = 'previewAccess'

/**
 * Clave de acceso anticipado recordada en este navegador, si la hay. Sirve
 * para que el enlace que abre Chrome desde una app la lleve: Chrome no
 * comparte almacenamiento con el navegador de la app.
 */
export const storedPreviewKey = (): string | null => safeStorage.get(PREVIEW_STORAGE_KEY)
