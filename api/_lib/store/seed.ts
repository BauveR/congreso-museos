import { ALLERGENS, PARTICIPATION_TYPES, registrationSchema } from '../../../shared/registration.js'
import type { Store } from './types.js'

/**
 * Datos de ejemplo para el modo mock: inscripciones ficticias variadas para
 * probar el panel (filtros, exportación). Pasan por el mismo esquema y la
 * misma lógica de aforo que una inscripción real.
 */
const NAMES = ['Ana', 'Luis', 'Marta', 'Carlos', 'Lucía', 'Javier', 'Elena', 'Pablo', 'Sara', 'Diego', 'Nuria', 'Raúl']
const SURNAMES = ['García Pérez', 'Martín Ruiz', 'Hernández Díaz', 'Rodríguez Sosa', 'Suárez León', 'Cabrera Trujillo']
const CITIES = ['San Sebastián de La Gomera', 'Santa Cruz de Tenerife', 'Las Palmas de Gran Canaria', 'Madrid', 'Sevilla', 'La Laguna']
const ORGS = ['Museo Insular', 'Cabildo de La Gomera', 'Universidad de La Laguna', 'Fundación Patrimonio', 'Museo de Historia']
const SESSION_SETS = [['dia-19'], ['dia-20'], ['dia-21'], ['dia-19', 'dia-20'], ['dia-19', 'dia-20', 'dia-21']]

const dniFor = (n: number) => {
  const number = String(10_000_000 + n * 7919).slice(0, 8)
  return number + 'TRWAGMYFPDXBNJZSQVHLCKE'[Number(number) % 23]
}

export async function seedMockData(store: Store, count = 36) {
  for (let i = 0; i < count; i++) {
    const certificate = i % 3 === 0
    const data = registrationSchema.parse({
      firstName: NAMES[i % NAMES.length],
      lastName: SURNAMES[i % SURNAMES.length],
      phone: `+34 6${String(10_000_000 + i * 104_729).slice(0, 8)}`,
      city: CITIES[i % CITIES.length],
      organization: ORGS[i % ORGS.length],
      jobTitle: i % 2 ? 'Conservador/a' : 'Técnico/a de museos',
      participationType: PARTICIPATION_TYPES[i % 7 === 0 ? 0 : i % 11 === 0 ? 2 : 1],
      sessionIds: SESSION_SETS[i % SESSION_SETS.length] ?? ['dia-19'],
      certificate,
      idDocument: certificate ? { type: 'dni', number: dniFor(i) } : undefined,
      allergens: i % 5 === 0 ? [ALLERGENS[i % ALLERGENS.length]!.id] : [],
      accessibility: i % 9 === 0 ? 'Acceso con silla de ruedas' : '',
      observations: '',
      consents: { privacy: true, healthData: i % 5 === 0 || i % 9 === 0, image: i % 2 === 0, communications: i % 4 === 0 },
    })
    await store.saveRegistration(`mock-${i + 1}`, `persona${i + 1}@example.com`, data)
  }
}
