/// <reference types="vite/client" />

// Solo variables públicas (prefijo VITE_). Las secretas viven en /api.
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
  readonly VITE_IMAGEKIT_URL_ENDPOINT?: string
  readonly VITE_IMAGEKIT_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
