import { useEffect, useState } from 'react'
import { CONNECTIVITY_EVENTS, CONNECTIVITY_LABELS, sumEvents, type ConnectivityDay } from '../../../shared/connectivity'
import { adminText } from '../../content/inscripcion'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/auth/context'

const t = adminText.connectivity

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10)

/**
 * Contadores anónimos de conexión (ver shared/connectivity.ts): visitas,
 * cargas lentas, fallos y recargas tras despliegue, en 7 y 30 días, con el
 * porcentaje sobre las visitas.
 */
export function ConnectivityPanel() {
  const { getIdToken } = useAuth()
  const [days, setDays] = useState<ConnectivityDay[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const result = await api<{ days: ConnectivityDay[] }>('admin/connectivity', { token: await getIdToken() })
        if (!cancelled) setDays(result.days)
      } catch {
        if (!cancelled) setFailed(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [getIdToken])

  const week = days ? sumEvents(days, daysAgo(6)) : null
  const month = days ? sumEvents(days) : null
  const pct = (n: number, of: number) => (of ? Math.round((n / of) * 100) : 0)

  return (
    <section className="rounded-2xl border border-borde p-5">
      <h3 className="font-semibold">{t.title}</h3>
      <p className="mt-1 text-sm text-pretty text-texto-suave">{t.help}</p>
      {failed && <p className="mt-4 text-sm text-error">{t.error}</p>}
      {month && week && (month.visit === 0 ? (
        <p className="mt-4 text-sm text-texto-suave">{t.empty}</p>
      ) : (
        <table className="mt-4 w-full text-left text-sm">
          <thead className="text-xs tracking-wide text-texto-suave uppercase">
            <tr>
              <th className="pb-2 font-semibold" />
              <th className="pb-2 text-right font-semibold">{t.last7}</th>
              <th className="pb-2 text-right font-semibold">{t.last30}</th>
            </tr>
          </thead>
          <tbody>
            {CONNECTIVITY_EVENTS.map((e) => (
              <tr key={e} className="border-t border-borde align-top">
                <th scope="row" className="py-2 pr-3 font-normal">
                  {CONNECTIVITY_LABELS[e]}
                  {e !== 'visit' && month[e] > 0 && <span className="block text-xs text-texto-suave">{t.ofVisits(pct(month[e], month.visit))}</span>}
                </th>
                <td className="py-2 text-right tabular-nums">{week[e]}</td>
                <td className={`py-2 text-right font-semibold tabular-nums ${e === 'failed' && month[e] > 0 ? 'text-error' : ''}`}>{month[e]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </section>
  )
}
