import { describe, expect, it } from 'vitest'
import { applyFilters, parseFilters } from '../api/_lib/filters.js'
import type { Registration } from '../api/_lib/store/types.js'
import { registrationSchema } from '../shared/registration.js'
import { validInput } from './fixtures.js'

/** Inscripción con los campos de alimentación indicados. */
const reg = (uid: string, food: { diet?: string; allergens?: string[]; otherAllergy?: string }): Registration => ({
  uid,
  email: `${uid}@example.com`,
  // Alergias o dieta: requieren el consentimiento de datos de salud.
  data: registrationSchema.parse({ ...validInput(), lastName: uid, ...food, consents: { privacy: true, healthData: true } }),
  createdAt: '',
  updatedAt: '',
})

const all = [
  reg('sin', {}),
  reg('vegana', { diet: 'vegana' }),
  reg('gluten', { allergens: ['gluten'] }),
  reg('otra', { otherAllergy: 'Kiwi' }),
]

const filter = (food: string) =>
  applyFilters(all, parseFilters(new URL(`http://x/?food=${encodeURIComponent(food)}`))).map((r) => r.uid)

describe('filtro de alimentación', () => {
  it('con alguna necesidad / sin necesidades', () => {
    expect(filter('alguna')).toEqual(['gluten', 'otra', 'vegana'])
    expect(filter('ninguna')).toEqual(['sin'])
  })

  it('con alguna alergia (lista u otra)', () => {
    expect(filter('alergias')).toEqual(['gluten', 'otra'])
  })

  it('por dieta y por alérgeno concreto', () => {
    expect(filter('vegana')).toEqual(['vegana'])
    expect(filter('alergeno:gluten')).toEqual(['gluten'])
  })

  it('ignora valores no reconocidos', () => {
    expect(filter('inventado')).toHaveLength(all.length)
  })
})
