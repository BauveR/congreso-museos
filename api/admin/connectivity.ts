import { requireAdmin } from '../_lib/auth.js'
import { handler, json } from '../_lib/http.js'
import { getStore } from '../_lib/store/index.js'

/** Días que se muestran en el panel. */
const DAYS = 30

/** GET /api/admin/connectivity — contadores anónimos de conexión de los últimos 30 días. */
export const GET = handler(async (request) => {
  await requireAdmin(request)
  const since = new Date(Date.now() - (DAYS - 1) * 86_400_000).toISOString().slice(0, 10)
  return json({ since, days: await (await getStore()).listEventCounts(since) })
})
