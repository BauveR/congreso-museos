import { describe, expect, it } from 'vitest'
import { checkPassword, passwordOk } from '../shared/password.js'

/* Reglas de la contraseña nueva (solo al crear la cuenta). */

const ana = { email: 'ana.garcia@ull.edu.es', firstName: 'Ana María', lastName: 'García Pérez' }

describe('contraseña nueva', () => {
  it('acepta 8 caracteres sin exigir mayúsculas, números ni símbolos', () => {
    expect(passwordOk(checkPassword('volcanes del norte'))).toBe(true)
    expect(passwordOk(checkPassword('tabaibas'))).toBe(true)
  })

  it('exige al menos 8 caracteres', () => {
    expect(checkPassword('tabaiba').length).toBe(false)
    expect(checkPassword('tabaibas').length).toBe(true)
    // Cuenta caracteres, no bytes: «ñ» o un emoji son uno.
    expect(checkPassword('ñandúñan').length).toBe(true)
  })

  it('rechaza las más comunes, sin distinguir mayúsculas, y los caracteres repetidos', () => {
    expect(checkPassword('12345678').notCommon).toBe(false)
    expect(checkPassword('Password').notCommon).toBe(false)
    expect(checkPassword('Congreso2026').notCommon).toBe(false)
    expect(checkPassword('aaaaaaaaaa').notCommon).toBe(false)
    expect(checkPassword('museo de la naturaleza').notCommon).toBe(true)
  })

  it('rechaza el nombre, los apellidos o el correo dentro de la contraseña', () => {
    expect(checkPassword('garcia2026!', ana).notPersonal).toBe(false)
    expect(checkPassword('soymaria123', ana).notPersonal).toBe(false)
    expect(checkPassword('ana.garcia99', ana).notPersonal).toBe(false)
    // Partes cortas (menos de 4 letras, como «Ana») no cuentan: darían falsos positivos.
    expect(checkPassword('banana split', ana).notPersonal).toBe(true)
  })

  it('vacía no cumple nada', () => {
    expect(checkPassword('')).toEqual({ length: false, notCommon: false, notPersonal: false })
  })
})
