import { ALLERGENS, DIET_LABELS, PARTICIPATION_LABELS, PARTICIPATION_TYPES } from '../../../shared/registration'
import { adminText } from '../../content/inscripcion'
import type { AdminRegistration } from './types'

const t = adminText.stats

/** Una barra: categoría y número de personas. */
export interface Count {
  key: string
  label: string
  value: number
  /** Contexto (p. ej. «sin necesidades»): se pinta en gris, no en el acento. */
  muted?: boolean
}

export interface Summary {
  total: number
  certificate: number
  /** Personas con dieta o alguna alergia. */
  foodNeeds: number
  participation: Count[]
  food: Count[]
  cities: Count[]
}

/** Ciudades que se muestran; el resto se agrupa en «Otras». */
const TOP_CITIES = 6

const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim().toLowerCase()

const hasAllergy = (r: AdminRegistration) => r.data.allergens.length > 0 || Boolean(r.data.otherAllergy?.trim())

/** Recuentos para el resumen de un día (o de todos) a partir de sus inscripciones. */
export function summarize(rows: AdminRegistration[]): Summary {
  const count = (pred: (r: AdminRegistration) => boolean) => rows.filter(pred).length

  const participation = PARTICIPATION_TYPES.map((type) => ({
    key: type,
    label: PARTICIPATION_LABELS[type],
    value: count((r) => r.data.participationType === type),
  }))

  const allergens = ALLERGENS.map((a) => ({ key: a.id, label: a.label, value: count((r) => r.data.allergens.includes(a.id)) }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
  const food: Count[] = [
    ...(['vegetariana', 'vegana'] as const).map((diet) => ({ key: diet, label: DIET_LABELS[diet], value: count((r) => r.data.diet === diet) })),
    ...allergens,
    { key: 'otra', label: t.otherAllergy, value: count((r) => Boolean(r.data.otherAllergy?.trim())) },
    { key: 'ninguna', label: t.noFoodNeeds, value: count((r) => r.data.diet === 'ninguna' && !hasAllergy(r)), muted: true },
  ].filter((c) => c.value > 0 || c.key === 'vegetariana' || c.key === 'vegana')

  // Ciudades: se agrupan sin mayúsculas ni tildes; se muestra la primera forma escrita.
  const cityMap = new Map<string, Count>()
  for (const r of rows) {
    const key = normalize(r.data.city)
    if (!key) continue
    const entry = cityMap.get(key) ?? { key, label: r.data.city.trim(), value: 0 }
    entry.value++
    cityMap.set(key, entry)
  }
  const sorted = [...cityMap.values()].sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'es'))
  const rest = sorted.slice(TOP_CITIES).reduce((sum, c) => sum + c.value, 0)
  const cities = [...sorted.slice(0, TOP_CITIES), ...(rest ? [{ key: 'otras', label: t.otherCities, value: rest, muted: true }] : [])]

  return {
    total: rows.length,
    certificate: count((r) => r.data.certificate),
    foodNeeds: count((r) => hasAllergy(r) || r.data.diet !== 'ninguna'),
    participation,
    food,
    cities,
  }
}
