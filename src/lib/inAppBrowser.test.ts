import { describe, expect, it } from 'vitest'
import { chromeIntentUrl, detectInAppBrowser, registrationLink, shouldAutoOpenChrome } from './inAppBrowser'

/* Navegadores dentro de apps, con user agents reales. */

const UA = {
  instagramIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 337.0.3.23.54 (iPhone14,5; iOS 17_5; es_ES; es; scale=3.00; 1170x2532; 615271239)',
  instagramAndroid:
    'Mozilla/5.0 (Linux; Android 14; SM-S918B Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.6422.165 Mobile Safari/537.36 Instagram 337.0.0.35.102 Android (34/14; 480dpi; 1080x2340; samsung; SM-S918B; dm3q; qcom; es_ES; 615271239)',
  facebookIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/470.0.0.40.104;FBBV/625871339;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/17.5;FBSS/3;FBID/phone;FBLC/es_ES;FBOP/5;FBRV/627459287]',
  facebookAndroid:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A.240705.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.6422.165 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/470.0.0.43.109;]',
  messengerIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/MessengerForiOS;FBAV/465.0.0.38.109;FBBV/617340394;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/17.5;FBSS/3;FBCR/;FBID/phone;FBLC/es_ES;FBOP/5]',
  linkedinIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.29.8960',
  linkedinAndroid:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A.240705.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.6422.165 Mobile Safari/537.36 [LinkedInApp]/4.1.940',
  tiktokIos:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_34.9.0 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/es Region/ES',
  tiktokAndroid:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A.240705.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.6422.165 Mobile Safari/537.36 trill_340001 BytedanceWebview/d8a21c6',
  genericWebView:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A.240705.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.6422.165 Mobile Safari/537.36',
  chromeAndroid: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.7204.157 Mobile Safari/537.36',
  safariIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
  chromeIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/138.0.7204.156 Mobile/15E148 Safari/604.1',
  chromeWindows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
}

describe('navegadores dentro de apps', () => {
  it('reconoce cada app con seguridad, en iPhone y en Android', () => {
    const cases: [keyof typeof UA, string, 'ios' | 'android'][] = [
      ['instagramIos', 'Instagram', 'ios'],
      ['instagramAndroid', 'Instagram', 'android'],
      ['facebookIos', 'Facebook', 'ios'],
      ['facebookAndroid', 'Facebook', 'android'],
      ['messengerIos', 'Messenger', 'ios'],
      ['linkedinIos', 'LinkedIn', 'ios'],
      ['linkedinAndroid', 'LinkedIn', 'android'],
      ['tiktokIos', 'TikTok', 'ios'],
      ['tiktokAndroid', 'TikTok', 'android'],
    ]
    for (const [key, app, platform] of cases) expect(detectInAppBrowser(UA[key]), key).toEqual({ app, platform, certain: true })
  })

  it('un WebView de Android sin marca se avisa, pero sin desactivar Google (no es seguro)', () => {
    expect(detectInAppBrowser(UA.genericWebView)).toEqual({ app: null, platform: 'android', certain: false })
  })

  it('los navegadores normales no se tocan', () => {
    for (const key of ['chromeAndroid', 'safariIphone', 'chromeIphone', 'chromeWindows'] as const) expect(detectInAppBrowser(UA[key]), key).toBeNull()
  })
})

describe('abrir en Chrome (Android)', () => {
  it('conserva la ruta y el acceso anticipado (sin el «#…»), con vuelta a la página si no hay Chrome', () => {
    const page = 'https://www.congresodemuseosdecanarias2026.com/inscripcion?acceso=CLAVE'
    expect(chromeIntentUrl(`${page}#acceso`)).toBe(
      'intent://www.congresodemuseosdecanarias2026.com/inscripcion?acceso=CLAVE#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=' +
        encodeURIComponent(page) +
        ';end',
    )
  })
})

describe('enlace a la inscripción para abrir fuera de la app', () => {
  const site = 'https://www.congresodemuseosdecanarias2026.com'

  it('en la portada apunta a la sección de inscripción (sin «#», que no viaja a Chrome)', () => {
    expect(registrationLink(`${site}/#acceso`)).toBe(`${site}/?seccion=acceso`)
  })

  it('en /inscripcion no añade sección', () => {
    expect(registrationLink(`${site}/inscripcion`)).toBe(`${site}/inscripcion`)
  })

  it('lleva el acceso anticipado recordado, sin duplicarlo si ya está', () => {
    expect(registrationLink(`${site}/`, 'CLAVE')).toBe(`${site}/?seccion=acceso&acceso=CLAVE`)
    expect(registrationLink(`${site}/?acceso=OTRA`, 'CLAVE')).toBe(`${site}/?acceso=OTRA&seccion=acceso`)
  })
})

describe('apertura automática de Chrome', () => {
  const memory = () => {
    const data = new Map<string, string>()
    return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) }
  }

  it('solo una vez por pestaña (si no hay Chrome, Android vuelve a la app: sin bucle)', () => {
    const storage = memory()
    expect(shouldAutoOpenChrome(storage)).toBe(true)
    expect(shouldAutoOpenChrome(storage)).toBe(false)
  })

  it('sin almacenamiento, nunca', () => {
    expect(shouldAutoOpenChrome(null)).toBe(false)
  })
})
