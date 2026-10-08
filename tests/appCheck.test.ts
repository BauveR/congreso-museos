import { afterEach, describe, expect, it, vi } from 'vitest'
import { checkAppCheck } from '../api/_lib/appCheck.js'

const request = () => new Request('http://localhost/api/registration', { method: 'POST' })

describe('App Check (APP_CHECK)', () => {
  vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  afterEach(() => {
    delete process.env.APP_CHECK
    delete process.env.DATA_MODE
  })

  it('off o modo mock: no se comprueba', async () => {
    process.env.APP_CHECK = 'enforce' // en mock no aplica
    await expect(checkAppCheck(request())).resolves.toBeUndefined()
  })

  it('monitor: sin comprobante solo se registra', async () => {
    process.env.DATA_MODE = 'firebase'
    process.env.APP_CHECK = 'monitor'
    await expect(checkAppCheck(request())).resolves.toBeUndefined()
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('sin comprobante'))
  })

  it('enforce: sin comprobante, 401', async () => {
    process.env.DATA_MODE = 'firebase'
    process.env.APP_CHECK = 'enforce'
    await expect(checkAppCheck(request())).rejects.toMatchObject({ status: 401 })
  })
})
