/*
 * Señales anónimas de conexión que la web envía a /api/telemetry: sin
 * cuenta, sin IP guardada y sin identificadores, solo «pasó esto hoy».
 * Sirven para saber cuántas visitas tienen problemas (p. ej. redes de
 * universidades o administraciones que filtran servicios de Google).
 */
export const CONNECTIVITY_EVENTS = ['visit', 'slow', 'failed', 'auth-network', 'stale-chunk'] as const
export type ConnectivityEvent = (typeof CONNECTIVITY_EVENTS)[number]

export const CONNECTIVITY_LABELS: Record<ConnectivityEvent, string> = {
  visit: 'Visitas con la inscripción cargada',
  slow: 'Carga lenta (más de 8 s)',
  failed: 'No pudieron conectar',
  'auth-network': 'Fallo de red al entrar (Google o correo)',
  'stale-chunk': 'Recarga automática tras un despliegue',
}

export const isConnectivityEvent = (value: unknown): value is ConnectivityEvent =>
  typeof value === 'string' && (CONNECTIVITY_EVENTS as readonly string[]).includes(value)

/** Contadores de un día (AAAA-MM-DD, UTC). */
export interface ConnectivityDay {
  day: string
  counts: Partial<Record<ConnectivityEvent, number>>
}

/** Suma cada evento en los días desde `since` (incluido). */
export function sumEvents(days: ConnectivityDay[], since = ''): Record<ConnectivityEvent, number> {
  const totals = Object.fromEntries(CONNECTIVITY_EVENTS.map((e) => [e, 0])) as Record<ConnectivityEvent, number>
  for (const { day, counts } of days) {
    if (day < since) continue
    for (const e of CONNECTIVITY_EVENTS) totals[e] += counts[e] ?? 0
  }
  return totals
}
