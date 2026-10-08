/// <reference types="vite/client" />

// Solo variables públicas (prefijo VITE_). Las secretas viven en /api.
interface ImportMetaEnv {
  /** 'true': la portada muestra «Sitio en construcción» (producción hasta el lanzamiento). */
  readonly VITE_UNDER_CONSTRUCTION?: string
  /** SHA-256 (hex) de la clave de acceso anticipado: /?acceso=CLAVE salta «en construcción». */
  readonly VITE_PREVIEW_KEY_HASH?: string
  /** mock (sin Firebase, solo desarrollo) | firebase */
  readonly VITE_DATA_MODE?: 'mock' | 'firebase'
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
  /** Clave de sitio de reCAPTCHA Enterprise para App Check (pública). */
  readonly VITE_RECAPTCHA_SITE_KEY?: string
  readonly VITE_IMAGEKIT_URL_ENDPOINT?: string
  readonly VITE_IMAGEKIT_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
