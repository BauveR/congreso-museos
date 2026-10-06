import { handler, json } from './_lib/http.js'
import { getStore } from './_lib/store/index.js'

/** GET /api/sessions — público: sesiones activas y plazas libres. */
export const GET = handler(async () => {
  const sessions = await (await getStore()).listSessions()
  return json({
    sessions: sessions
      .filter((s) => s.active)
      .map(({ id, title, date, kind, capacity, registered }) => ({
        id,
        title,
        date,
        kind,
        remaining: Math.max(0, capacity - registered),
      })),
  })
})
