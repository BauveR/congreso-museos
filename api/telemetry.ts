import { isConnectivityEvent } from '../shared/connectivity.js'
import { handler, HttpError, isSameOrigin, readJson } from './_lib/http.js'
import { rateLimit } from './_lib/rateLimit.js'
import { getStore } from './_lib/store/index.js'
import { today } from './_lib/store/types.js'

/**
 * POST /api/telemetry — público y anónimo: { event } suma uno al contador
 * del día. Sin App Check a propósito: debe llegar también cuando la red
 * bloquea reCAPTCHA o Google, que es justo lo que se quiere medir. Solo
 * desde la propia web (Origin/Referer); la IP solo se usa en memoria para
 * limitar abusos; no se guarda.
 */
export const POST = handler(async (request) => {
  if (!isSameOrigin(request)) throw new HttpError(403, 'Origen no permitido')
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'sin-ip'
  rateLimit(`telemetry:${ip}`, 30, 60_000)
  const body = (await readJson(request, 200)) as { event?: unknown } | null
  if (!isConnectivityEvent(body?.event)) throw new HttpError(400, 'Evento no válido')
  await (await getStore()).countEvent(body.event, today())
  return new Response(null, { status: 204 })
})
