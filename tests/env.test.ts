import { describe, expect, it } from 'vitest'
import { cleanEnv } from '../shared/env.js'

describe('cleanEnv', () => {
  it('quita espacios y saltos de línea sobrantes', () => {
    expect(cleanEnv('AIzaKey \n')).toBe('AIzaKey')
  })

  it('quita las comillas que envuelven todo el valor', () => {
    expect(cleanEnv('"V Congreso <a@b.com>"')).toBe('V Congreso <a@b.com>')
    expect(cleanEnv(" 'firebase' ")).toBe('firebase')
  })

  it('respeta comillas internas y JSON', () => {
    expect(cleanEnv('{"type":"service_account"}')).toBe('{"type":"service_account"}')
    expect(cleanEnv('"abierta')).toBe('"abierta')
  })

  it('vacío o ausente → undefined', () => {
    expect(cleanEnv('  ')).toBeUndefined()
    expect(cleanEnv('""')).toBeUndefined()
    expect(cleanEnv(undefined)).toBeUndefined()
  })
})
