import { PARTICIPATION_TYPES } from '../../shared/registration.js'
import type { Registration } from './store/types.js'

export interface RegistrationFilters {
  session?: string
  type?: string
  city?: string
  certificate?: 'si' | 'no'
  q?: string
}

/** Lee los filtros de la URL (ignora valores no reconocidos). */
export function parseFilters(url: URL): RegistrationFilters {
  const get = (key: string) => url.searchParams.get(key)?.trim().slice(0, 100) || undefined
  const type = get('type')
  const certificate = get('certificate')
  return {
    session: get('session'),
    type: type && (PARTICIPATION_TYPES as readonly string[]).includes(type) ? type : undefined,
    city: get('city'),
    certificate: certificate === 'si' || certificate === 'no' ? certificate : undefined,
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
    .filter((r) => {
      if (!q) return true
      const haystack = normalize([r.data.firstName, r.data.lastName, r.email, r.data.organization, r.data.jobTitle].join(' '))
      return haystack.includes(q)
    })
    .sort((a, b) => a.data.lastName.localeCompare(b.data.lastName, 'es') || a.data.firstName.localeCompare(b.data.firstName, 'es'))
}
