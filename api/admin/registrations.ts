import { requireAdmin } from '../_lib/auth.js'
import { applyFilters, parseFilters } from '../_lib/filters.js'
import { handler, json } from '../_lib/http.js'
import { getStore } from '../_lib/store/index.js'

/**
 * GET /api/admin/registrations?session=&type=&city=&certificate=&q=
 * Inscripciones filtradas (incluye el documento de identidad solo de quien
 * pidió certificado).
 */
export const GET = handler(async (request) => {
  await requireAdmin(request)
  const registrations = applyFilters(await (await getStore()).listRegistrations(), parseFilters(new URL(request.url)))
  return json({ registrations, total: registrations.length })
})
