import { ALLERGENS, PARTICIPATION_TYPES, type RegistrationData } from '../../shared/registration.js'
import type { Registration } from './store/types.js'

export interface RegistrationFilters {
  session?: string
  type?: string
  city?: string
  certificate?: 'si' | 'no'
  /** Alimentación: alguna | ninguna | alergias | vegetariana | vegana | alergeno:<id> */
  food?: string
  q?: string
}

const FOOD_VALUES = new Set(['alguna', 'ninguna', 'alergias', 'vegetariana', 'vegana', ...ALLERGENS.map((a) => `alergeno:${a.id}`)])

type FoodData = Pick<RegistrationData, 'diet' | 'allergens' | 'otherAllergy'>

const hasAllergy = (d: FoodData) => d.allergens.length > 0 || Boolean(d.otherAllergy?.trim())

/** ¿Encaja la inscripción con el filtro de alimentación? (para el catering). */
function matchesFood(d: FoodData, food: string): boolean {
  if (food === 'alergias') return hasAllergy(d)
  if (food === 'alguna') return hasAllergy(d) || d.diet !== 'ninguna'
  if (food === 'ninguna') return !hasAllergy(d) && d.diet === 'ninguna'
  if (food.startsWith('alergeno:')) return (d.allergens as readonly string[]).includes(food.slice('alergeno:'.length))
  return d.diet === food
}

/** Lee los filtros de la URL (ignora valores no reconocidos). */
export function parseFilters(url: URL): RegistrationFilters {
  const get = (key: string) => url.searchParams.get(key)?.trim().slice(0, 100) || undefined
  const type = get('type')
  const certificate = get('certificate')
  const food = get('food')
  return {
    session: get('session'),
    type: type && (PARTICIPATION_TYPES as readonly string[]).includes(type) ? type : undefined,
    city: get('city'),
    certificate: certificate === 'si' || certificate === 'no' ? certificate : undefined,
    food: food && FOOD_VALUES.has(food) ? food : undefined,
    q: get('q'),
  }
}

const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export function applyFilters(regs: Registration[], f: RegistrationFilters): Registration[] {
  const city = f.city && normalize(f.city)
  const q = f.q && normalize(f.q)
  return regs
    .filter((r) => !f.session || r.data.sessionIds.includes(f.session))
    .filter((r) => !f.type || r.data.participationType === f.type)
    .filter((r) => !city || normalize(r.data.city).includes(city))
    .filter((r) => !f.certificate || r.data.certificate === (f.certificate === 'si'))
    .filter((r) => !f.food || matchesFood(r.data, f.food))
    .filter((r) => {
      if (!q) return true
      const haystack = normalize([r.data.firstName, r.data.lastName, r.email, r.data.organization, r.data.jobTitle].join(' '))
      return haystack.includes(q)
    })
    .sort((a, b) => a.data.lastName.localeCompare(b.data.lastName, 'es') || a.data.firstName.localeCompare(b.data.firstName, 'es'))
}
