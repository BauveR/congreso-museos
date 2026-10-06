import { ALLERGENS, DIET_LABELS, ID_TYPE_LABELS, PARTICIPATION_LABELS } from '../../shared/registration.js'
import { toCsv } from '../../shared/csv.js'
import { requireAdmin } from '../_lib/auth.js'
import { applyFilters, parseFilters } from '../_lib/filters.js'
import { handler } from '../_lib/http.js'
import { getStore } from '../_lib/store/index.js'

const ALLERGEN_LABELS = new Map<string, string>(ALLERGENS.map((a) => [a.id, a.label]))
const yesNo = (value: boolean) => (value ? 'Sí' : 'No')

/** GET /api/admin/export?…filtros — CSV (Excel) con las inscripciones filtradas. */
export const GET = handler(async (request) => {
  await requireAdmin(request)
  const store = await getStore()
  const [all, sessions] = await Promise.all([store.listRegistrations(), store.listSessions()])
  const filters = parseFilters(new URL(request.url))
  const registrations = applyFilters(all, filters)

  const headers = [
    'Nombre', 'Apellidos', 'Correo', 'Teléfono', 'Ciudad', 'Entidad', 'Cargo o profesión',
    'Tipo de participación', ...sessions.map((s) => s.title), 'Certificado', 'Tipo de documento',
    'Número de documento', 'Accesibilidad', 'Alérgenos', 'Otra alergia', 'Dieta', 'Observaciones',
    'Consentimiento imagen', 'Consentimiento comunicaciones', 'Fecha de inscripción', 'Última modificación',
  ]
  const rows = registrations.map(({ email, data: d, createdAt, updatedAt }) => [
    d.firstName, d.lastName, email, d.phone, d.city, d.organization, d.jobTitle,
    PARTICIPATION_LABELS[d.participationType],
    ...sessions.map((s) => yesNo(d.sessionIds.includes(s.id))),
    yesNo(d.certificate),
    d.idDocument ? ID_TYPE_LABELS[d.idDocument.type] : '',
    d.idDocument?.number ?? '',
    d.accessibility,
    d.allergens.map((id) => ALLERGEN_LABELS.get(id) ?? id).join(', '),
    d.otherAllergy,
    DIET_LABELS[d.diet],
    d.observations,
    yesNo(d.consents.image),
    yesNo(d.consents.communications),
    createdAt,
    updatedAt,
  ])

  const suffix = filters.session ? `-${filters.session}` : ''
  return new Response(toCsv(headers, rows), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="inscripciones${suffix}.csv"`,
      'cache-control': 'no-store',
    },
  })
})
