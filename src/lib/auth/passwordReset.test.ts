import { describe, expect, it, vi } from 'vitest'
import { canSendReset, countResetSend, MAX_RESET_SENDS, sendWithContinueFallback } from './passwordReset'

/* Recuperar la contraseña: reintento sin dirección de vuelta y tope de envíos. */

const firebaseError = (code: string) => Object.assign(new Error(code), { code })

describe('dirección de vuelta rechazada', () => {
  it('si Firebase no la acepta, se reenvía sin ella', async () => {
    const send = vi.fn(async (withUrl: boolean) => {
      if (withUrl) throw firebaseError('auth/unauthorized-continue-uri')
    })
    await sendWithContinueFallback(send)
    expect(send.mock.calls).toEqual([[true], [false]])
  })

  it('con éxito a la primera, un solo envío', async () => {
    const send = vi.fn(async () => {})
    await sendWithContinueFallback(send)
    expect(send).toHaveBeenCalledTimes(1)
  })

  it('otros errores no se reintentan', async () => {
    const send = vi.fn(async () => {
      throw firebaseError('auth/too-many-requests')
    })
    await expect(sendWithContinueFallback(send)).rejects.toMatchObject({ code: 'auth/too-many-requests' })
    expect(send).toHaveBeenCalledTimes(1)
  })
})

describe('tope de envíos por pestaña', () => {
  const memory = () => {
    const data = new Map<string, string>()
    return { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) }
  }

  it(`permite ${MAX_RESET_SENDS} envíos y después no`, () => {
    const storage = memory()
    for (let i = 0; i < MAX_RESET_SENDS; i++) {
      expect(canSendReset(storage)).toBe(true)
      countResetSend(storage)
    }
    expect(canSendReset(storage)).toBe(false)
  })

  it('sin almacenamiento (o si falla) no bloquea', () => {
    expect(canSendReset(null)).toBe(true)
    const broken = {
      getItem: () => {
        throw new Error('bloqueado')
      },
      setItem: () => {
        throw new Error('bloqueado')
      },
    }
    countResetSend(broken)
    expect(canSendReset(broken)).toBe(true)
  })
})
