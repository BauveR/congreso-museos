import { z } from 'zod'
import { requireAdmin } from '../_lib/auth.js'
import { handler, json, readJson } from '../_lib/http.js'
import { getStore } from '../_lib/store/index.js'

/** GET /api/admin/sessions — todas las sesiones con aforo e inscritos. */
export const GET = handler(async (request) => {
  await requireAdmin(request)
  return json({ sessions: await (await getStore()).listSessions() })
})

const patchSchema = z.object({
  id: z.string().min(1).max(64),
  title: z.string().optional(),
  date: z.string().optional(),
  capacity: z.number().optional(),
  active: z.boolean().optional(),
})

/**
 * PATCH /api/admin/sessions — edita una sesión. El aforo no puede bajar de
 * los ya inscritos y nunca modifica el contador (shared/sessions.ts).
 */
export const PATCH = handler(async (request) => {
  await requireAdmin(request)
  const { id, ...patch } = patchSchema.parse(await readJson(request))
  return json({ session: await (await getStore()).updateSession(id, patch) })
})

/** POST /api/admin/sessions — acciones: { action: "recount" } recalcula los contadores. */
export const POST = handler(async (request) => {
  await requireAdmin(request)
  z.object({ action: z.literal('recount') }).parse(await readJson(request))
  return json({ sessions: await (await getStore()).recount() })
})
