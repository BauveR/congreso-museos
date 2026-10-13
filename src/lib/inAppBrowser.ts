/*
 * Navegadores integrados en apps (Instagram, Facebook, Messenger, LinkedIn,
 * TikTok…): Google bloquea ahí su inicio de sesión (403 «disallowed_useragent»).
 * Se detectan por el user agent para avisar y ofrecer salidas: abrir la página
 * en Chrome (Android), copiar el enlace o entrar con correo y contraseña.
 */

export interface InAppBrowser {
  /** Nombre de la app, si se reconoce (null: un WebView de Android sin identificar). */
  app: string | null
  platform: 'ios' | 'android' | 'other'
  /** Identificada con seguridad por su marca propia: solo entonces se desactiva el botón de Google. */
  certain: boolean
}

/** Marca propia de cada app en el user agent (comprobadas con UA reales en los tests). */
const APPS: [name: string, pattern: RegExp][] = [
  ['Instagram', /\bInstagram\b/],
  ['Messenger', /MessengerForiOS|\bOrca-Android\b|MessengerLite/],
  ['Facebook', /FBAN\/|FBAV\/|FB_IAB\//],
  ['LinkedIn', /LinkedInApp/],
  ['TikTok', /musical_ly|BytedanceWebview|\btrill_/],
  ['Snapchat', /Snapchat\//],
  ['Pinterest', /Pinterest\//],
  ['Line', /\bLine\/\d/],
  ['X', /TwitterAndroid/],
]

function platformOf(userAgent: string): InAppBrowser['platform'] {
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'ios'
  if (/Android/.test(userAgent)) return 'android'
  return 'other'
}

export function detectInAppBrowser(userAgent: string): InAppBrowser | null {
  const platform = platformOf(userAgent)
  const match = APPS.find(([, pattern]) => pattern.test(userAgent))
  if (match) return { app: match[0], platform, certain: true }
  // WebView genérico de Android («; wv)»): probablemente una app, pero sin saber cuál.
  if (platform === 'android' && /;\s*wv\)/.test(userAgent)) return { app: null, platform, certain: false }
  return null
}

/** Parámetro que lleva directamente a la sección de inscripción de la portada (lo atiende Access.tsx). */
export const SECTION_PARAM = 'seccion'

/**
 * Esta página, y si es la portada, apuntando a la sección de inscripción (el
 * «#» no viaja a Chrome). Con `previewKey`, también el acceso anticipado,
 * que Chrome no tendría (no comparte almacenamiento con la app).
 */
export function registrationLink(href: string, previewKey?: string | null): string {
  const url = new URL(href)
  url.hash = ''
  if (url.pathname === '/') url.searchParams.set(SECTION_PARAM, 'acceso')
  if (previewKey && !url.searchParams.has('acceso')) url.searchParams.set('acceso', previewKey)
  return url.href
}

const OPENED_KEY = 'congreso.openedInChrome'

/**
 * ¿Abrir Chrome automáticamente? Solo una vez por pestaña: si el móvil no
 * tiene Chrome, Android vuelve a cargar la página dentro de la app y, sin
 * este freno, se repetiría en bucle. Sin almacenamiento, nunca.
 */
export function shouldAutoOpenChrome(storage: Pick<Storage, 'getItem' | 'setItem'> | null): boolean {
  if (!storage) return false
  try {
    if (storage.getItem(OPENED_KEY)) return false
    storage.setItem(OPENED_KEY, '1')
    return true
  } catch {
    return false
  }
}

/**
 * Enlace que abre esta misma página en Chrome desde una app de Android (si no
 * hay Chrome, abre la página igual). Sin el «#…» de la página: un segundo «#»
 * antes de «#Intent;» confunde a algunas versiones de Android.
 */
export function chromeIntentUrl(href: string): string {
  const url = new URL(href)
  url.hash = ''
  const target = `${url.host}${url.pathname}${url.search}`
  return `intent://${target}#Intent;scheme=${url.protocol.replace(':', '')};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url.href)};end`
}
