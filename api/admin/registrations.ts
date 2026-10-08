import { z } from 'zod'
import { requireAdmin } from '../_lib/auth.js'
import { applyFilters, parseFilters } from '../_lib/filters.js'
import { handler, HttpError, json } from '../_lib/http.js'
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

/**
 * DELETE /api/admin/registrations?uid= — cancela una inscripción ajena
 * (fraude, duplicadas, pruebas) y libera sus plazas. Sin correo a la persona;
 * queda constancia en el log de quién la canceló.
 */
export const DELETE = handler(async (request) => {
  const admin = await requireAdmin(request)
  const uid = z.string().min(1).max(128).parse(new URL(request.url).searchParams.get('uid'))
  const cancelled = await (await getStore()).cancelRegistration(uid)
  if (!cancelled) throw new HttpError(404, 'La inscripción no existe')
  console.info(`[admin] ${admin.email} canceló la inscripción de ${cancelled.email} (${uid})`)
  return json({ cancelled: true })
})
