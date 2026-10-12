import { describe, expect, it } from 'vitest'
import { clearGoogleRedirect, markGoogleRedirect, needsGoogleRedirect, REDIRECT_TTL_MS, returningFromGoogle } from './redirectFlow'

/* Acceso con Google por redirección solo en los navegadores de iOS que no son Safari. */

const UA = {
  chromeIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/138.0.7204.156 Mobile/15E148 Safari/604.1',
  firefoxIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/141.0 Mobile/15E148 Safari/605.1.15',
  edgeIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 EdgiOS/138.3351.83 Mobile/15E148 Safari/605.1.15',
  operaIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 OPiOS/16.0.15 Mobile/15E148 Safari/9537.53',
  googleAppIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/380.0.775224930 Mobile/15E148 Safari/604.1',
  chromeIpad:
    'Mozilla/5.0 (iPad; CPU OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/138.0.7204.156 Mobile/15E148 Safari/604.1',
  /** iPadOS pide la web de escritorio: se presenta como Mac (se reconoce por la pantalla táctil). */
  chromeIpadDesktop: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/138.0.7204.156 Safari/604.1',
  safariIphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
  chromeAndroid:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.7204.157 Mobile Safari/537.36',
  googleAppAndroid:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/138.0.7204.157 Mobile Safari/537.36 GSA/15.30.32.29.arm64',
  chromeMac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
  chromeWindows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
}

describe('¿redirección o ventana?', () => {
  it('redirección en Chrome, Firefox, Edge, Opera y la app de Google de iPhone y iPad', () => {
    for (const ua of [UA.chromeIphone, UA.firefoxIphone, UA.edgeIphone, UA.operaIphone, UA.googleAppIphone, UA.chromeIpad]) {
      expect(needsGoogleRedirect(ua), ua).toBe(true)
    }
    expect(needsGoogleRedirect(UA.chromeIpadDesktop, 5)).toBe(true)
  })

  it('ventana en Safari de iPhone, Android y ordenador (ya funcionan)', () => {
    for (const ua of [UA.safariIphone, UA.chromeAndroid, UA.googleAppAndroid, UA.chromeMac, UA.chromeWindows]) {
      expect(needsGoogleRedirect(ua, 0), ua).toBe(false)
    }
    // Un Mac de verdad (sin pantalla táctil) con un UA parecido al de iPad no cuenta como iOS.
    expect(needsGoogleRedirect(UA.chromeIpadDesktop, 0)).toBe(false)
  })
})

describe('vuelta de Google', () => {
  const memory = () => {
    const data = new Map<string, string>()
    return {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
      removeItem: (k: string) => void data.delete(k),
    }
  }

  it('se reconoce al volver y es de un solo uso', () => {
    const storage = memory()
    expect(returningFromGoogle(storage)).toBe(false)
    markGoogleRedirect(storage, 1_000)
    expect(returningFromGoogle(storage, 2_000)).toBe(true)
    clearGoogleRedirect(storage)
    expect(returningFromGoogle(storage, 2_000)).toBe(false)
  })

  it('caduca a los 15 minutos (acceso abandonado a medias)', () => {
    const storage = memory()
    const start = 1_000_000
    markGoogleRedirect(storage, start)
    expect(returningFromGoogle(storage, start + REDIRECT_TTL_MS - 1)).toBe(true)
    expect(returningFromGoogle(storage, start + REDIRECT_TTL_MS)).toBe(false)
  })

  it('sin almacenamiento no falla', () => {
    expect(() => markGoogleRedirect(null)).not.toThrow()
    expect(returningFromGoogle(null)).toBe(false)
  })
})
