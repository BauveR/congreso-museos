import { describe, expect, it } from 'vitest'
import { fieldErrors, isValidDni, isValidNie, isValidPhone, registrationSchema } from '../shared/registration.js'
import { validInput } from './fixtures.js'


const errorsOf = (input: unknown) => {
  const result = registrationSchema.safeParse(input)
  return result.success ? {} : fieldErrors(result.error)
}

describe('documentos de identidad', () => {
  it('valida la letra del DNI', () => {
    expect(isValidDni('12345678Z')).toBe(true)
    expect(isValidDni('12345678A')).toBe(false)
    expect(isValidDni('1234567Z')).toBe(false)
  })
  it('valida la letra del NIE (X/Y/Z)', () => {
    expect(isValidNie('X1234567L')).toBe(true)
    expect(isValidNie('Y1234567X')).toBe(true)
    expect(isValidNie('X1234567A')).toBe(false)
  })
})

describe('teléfono', () => {
  it('acepta formatos nacionales e internacionales', () => {
    for (const phone of ['612345678', '+34 612 34 56 78', '(+34) 922-123-456', '+44 20 7946 0958']) {
      expect(isValidPhone(phone), phone).toBe(true)
    }
  })
  it('rechaza números cortos, largos o con letras', () => {
    for (const phone of ['12345', '+34 61234567890123', '612abc678', '']) expect(isValidPhone(phone), phone).toBe(false)
  })
})

describe('esquema de inscripción', () => {
  it('acepta una inscripción válida y limpia los textos', () => {
    const data = registrationSchema.parse(validInput())
    expect(data.firstName).toBe('Ana')
    expect(data.lastName).toBe('García Pérez')
    expect(data.allergens).toEqual([])
    expect(data.idDocument).toBeUndefined()
  })

  it('exige aceptar la política de privacidad', () => {
    expect(errorsOf({ ...validInput(), consents: { privacy: false } })).toHaveProperty(['consents.privacy'])
  })

  it('exige al menos un día', () => {
    expect(errorsOf({ ...validInput(), sessionIds: [] })).toHaveProperty(['sessionIds'])
  })

  it('rechaza días repetidos', () => {
    expect(errorsOf({ ...validInput(), sessionIds: ['dia-19', 'dia-19'] })).toHaveProperty(['sessionIds'])
  })

  it('con certificado exige un documento válido', () => {
    expect(errorsOf({ ...validInput(), certificate: true })).toHaveProperty(['idDocument.number'])
    expect(
      errorsOf({ ...validInput(), certificate: true, idDocument: { type: 'dni', number: '12345678A' } }),
    ).toHaveProperty(['idDocument.number'])
    const ok = registrationSchema.parse({
      ...validInput(),
      certificate: true,
      idDocument: { type: 'dni', number: '12345678-z' },
    })
    expect(ok.idDocument).toEqual({ type: 'dni', number: '12345678Z' })
  })

  it('sin certificado descarta el documento enviado', () => {
    const data = registrationSchema.parse({ ...validInput(), idDocument: { type: 'dni', number: '12345678Z' } })
    expect(data.idDocument).toBeUndefined()
  })

  it('pide consentimiento de datos de salud si hay alergias o accesibilidad', () => {
    expect(errorsOf({ ...validInput(), allergens: ['gluten'] })).toHaveProperty(['consents.healthData'])
    expect(errorsOf({ ...validInput(), accessibility: 'Silla de ruedas' })).toHaveProperty(['consents.healthData'])
    expect(errorsOf({ ...validInput(), allergens: ['gluten'], consents: { privacy: true, healthData: true } })).toEqual({})
  })

  it('rechaza alérgenos desconocidos y tipos de participación inventados', () => {
    expect(errorsOf({ ...validInput(), allergens: ['chocolate'] })).toHaveProperty(['allergens.0'])
    expect(errorsOf({ ...validInput(), participationType: 'vip' })).toHaveProperty(['participationType'])
  })

  it('aplica los límites de longitud', () => {
    expect(errorsOf({ ...validInput(), observations: 'x'.repeat(1001) })).toHaveProperty(['observations'])
    expect(errorsOf({ ...validInput(), firstName: 'x'.repeat(81) })).toHaveProperty(['firstName'])
  })

  it('rechaza envíos de bots (campo trampa relleno)', () => {
    expect(errorsOf({ ...validInput(), website: 'http://spam.example' })).toHaveProperty(['website'])
  })

  it('quita caracteres de control', () => {
    const data = registrationSchema.parse({ ...validInput(), city: 'La\u0000 Gomera\u0007' })
    expect(data.city).toBe('La Gomera')
  })
})

describe('mensajes', () => {
  it('los errores genéricos salen en español', () => {
    const result = registrationSchema.safeParse({ firstName: 'Ana' })
    expect(result.success).toBe(false)
    const messages = result.success ? [] : Object.values(fieldErrors(result.error))
    expect(messages.join(' ')).not.toMatch(/Invalid input|expected/)
  })
})
