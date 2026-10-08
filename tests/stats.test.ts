import { describe, expect, it } from 'vitest'
import { registrationSchema } from '../shared/registration.js'
import { summarize } from '../src/features/admin/stats.js'
import type { AdminRegistration } from '../src/features/admin/types.js'
import { validInput } from './fixtures.js'

const reg = (uid: string, extra: Record<string, unknown> = {}): AdminRegistration => ({
  uid,
  email: `${uid}@example.com`,
  data: registrationSchema.parse({ ...validInput(), consents: { privacy: true, healthData: true }, ...extra }),
  createdAt: '',
  updatedAt: '',
})

const value = (items: { key: string; value: number }[], key: string) => items.find((i) => i.key === key)?.value

describe('resumen de inscritos', () => {
  const rows = [
    reg('a', { city: 'La Laguna', certificate: true, idDocument: { type: 'dni', number: '12345678Z' } }),
    reg('b', { city: 'la laguna ', diet: 'vegana', allergens: ['gluten'] }),
    reg('c', { city: 'Madrid', participationType: 'ponente', otherAllergy: 'Kiwi' }),
  ]
  const s = summarize(rows)

  it('cifras clave', () => {
    expect(s.total).toBe(3)
    expect(s.certificate).toBe(1)
    expect(s.foodNeeds).toBe(2)
  })

  it('tipo de participación, con todas las categorías', () => {
    expect(value(s.participation, 'asistente')).toBe(2)
    expect(value(s.participation, 'ponente')).toBe(1)
    expect(value(s.participation, 'organizacion')).toBe(0)
  })

  it('alimentación: dietas, alérgenos con casos, otra alergia y sin necesidades', () => {
    expect(value(s.food, 'vegana')).toBe(1)
    expect(value(s.food, 'vegetariana')).toBe(0)
    expect(value(s.food, 'gluten')).toBe(1)
    expect(value(s.food, 'huevo')).toBeUndefined()
    expect(value(s.food, 'otra')).toBe(1)
    expect(value(s.food, 'ninguna')).toBe(1)
  })

  it('ciudades agrupadas sin mayúsculas ni espacios', () => {
    expect(s.cities.map((c) => [c.label, c.value])).toEqual([
      ['La Laguna', 2],
      ['Madrid', 1],
    ])
  })
})
