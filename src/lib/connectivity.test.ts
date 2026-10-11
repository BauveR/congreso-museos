import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, ApiError } from './api'
import { isStaleChunkError, once } from './connectivity'

/*
 * Conexión en redes difíciles, lado navegador: la recarga «una sola vez»
 * y el corte de las peticiones que no contestan.
 */

describe('una sola vez por pestaña', () => {
  const memory = () => {
    const data = new Map<string, string>()
    return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) }
  }

  it('la primera vez sí, después no', () => {
    const storage = memory()
    expect(once('reload:stale-chunk', storage)).toBe(true)
    expect(once('reload:stale-chunk', storage)).toBe(false)
    expect(once('connectivity:slow', storage)).toBe(true)
  })

  it('sin almacenamiento (bloqueado o modo privado) nunca: así no hay bucles de recarga', () => {
    expect(once('reload:stale-chunk', null)).toBe(false)
    const broken = {
      getItem: () => {
        throw new Error('SecurityError')
      },
      setItem: () => undefined,
    }
    expect(once('reload:stale-chunk', broken)).toBe(false)
  })
})

describe('archivos de una versión anterior', () => {
  it('reconoce el error de carga de chunk de cada navegador', () => {
    expect(isStaleChunkError(new TypeError('Failed to fetch dynamically imported module: https://x/assets/a.js'))).toBe(true)
    expect(isStaleChunkError(new TypeError('Importing a module script failed.'))).toBe(true)
    expect(isStaleChunkError(new TypeError('error loading dynamically imported module'))).toBe(true)
    expect(isStaleChunkError(new Error('Unable to preload CSS for /assets/a.css'))).toBe(true)
    expect(isStaleChunkError(new Error('Cannot read properties of undefined'))).toBe(false)
  })
})

describe('peticiones que no contestan', () => {
  afterEach(() => vi.unstubAllGlobals())

  /** fetch que nunca responde, salvo que se corte con su signal. */
  const hangingFetch = vi.fn(
    (_url: string, init?: RequestInit) =>
      new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener('abort', () => reject(init.signal?.reason))
      }),
  )

  it('las lecturas se cortan y dan un error de conexión en lugar de quedarse cargando', async () => {
    vi.stubGlobal('fetch', hangingFetch)
    const error = await api('sessions', { timeoutMs: 50 }).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(0)
    expect((error as ApiError).message).toMatch(/tardado/)
  })

  it('las escrituras no llevan corte (el servidor podría haberlas guardado)', async () => {
    const spy = vi.fn(async (_url: string, init?: RequestInit) => {
      expect(init?.signal).toBeUndefined()
      return new Response('{}', { status: 200 })
    })
    vi.stubGlobal('fetch', spy)
    await api('registration', { method: 'POST', body: {}, token: 'mock.x' })
    expect(spy).toHaveBeenCalledOnce()
  })
})
