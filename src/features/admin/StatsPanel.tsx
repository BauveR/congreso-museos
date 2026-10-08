import { useEffect, useMemo, useState } from 'react'
import type { Session } from '../../../shared/sessions'
import { adminText } from '../../content/inscripcion'
import { api } from '../../lib/api'
import { useAuth } from '../../lib/auth/context'
import { summarize, type Count } from './stats'
import type { AdminRegistration } from './types'

const t = adminText.stats

/*
 * Resumen por día para la organización: cifras clave y barras horizontales
 * de una sola serie (color de acento; el contexto, en gris). Cada barra
 * lleva su valor al final, así que no hace falta leyenda ni pasar el ratón.
 */

const pct = (part: number, total: number) => (total ? Math.round((part / total) * 100) : 0)

function StatTile({ label, value, sub, meter }: { label: string; value: number; sub?: string; meter?: { value: number; max: number } }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-borde p-5">
      <p className="text-sm text-texto-suave">{label}</p>
      <p className="font-display text-5xl leading-none font-semibold">{value}</p>
      {meter && (
        <div
          role="meter"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={meter.max}
          aria-valuenow={meter.value}
          className="mt-1 h-2 overflow-hidden rounded-full bg-acento/20"
        >
          <div className="h-full rounded-full bg-acento" style={{ width: `${Math.min(100, pct(meter.value, meter.max))}%` }} />
        </div>
      )}
      {sub && <p className="text-sm text-texto-suave">{sub}</p>}
    </div>
  )
}

function BarList({ title, help, items }: { title: string; help?: string; items: Count[] }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <section className="rounded-2xl border border-borde p-5">
      <h3 className="font-semibold">{title}</h3>
      {help && <p className="mt-1 text-sm text-texto-suave">{help}</p>}
      <ul className="mt-4 flex flex-col">
        {items.map((item) => (
          <li
            key={item.key}
            className="grid grid-cols-[minmax(7rem,13rem)_1fr] items-center gap-3 rounded-md px-1 py-1.5 transition-colors hover:bg-superficie"
          >
            <span className="text-sm leading-snug">{item.label}</span>
            <span className="flex items-center gap-2">
              {/* Barra de 12px, extremo redondeado y base recta; mínimo visible si el valor es > 0. */}
              <span
                aria-hidden
                className={`h-3 rounded-r-[4px] ${item.muted ? 'bg-texto-suave/50' : 'bg-acento'}`}
                style={{ width: item.value ? `max(4px, ${(item.value / max) * 85}%)` : 0 }}
              />
              <span className="text-sm font-semibold tabular-nums">{item.value}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Pestaña «Resumen»: elige un día (o todos) y muestra cifras y gráficos de sus inscritos. */
export function StatsPanel({ sessions }: { sessions: Session[] }) {
  const auth = useAuth()
  const days = sessions.filter((s) => s.kind === 'day')
  const [day, setDay] = useState('')
  const [rows, setRows] = useState<AdminRegistration[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const query = day ? `?session=${encodeURIComponent(day)}` : ''
        const result = await api<{ registrations: AdminRegistration[] }>(`admin/registrations${query}`, { token: await auth.getIdToken() })
        if (!cancelled) setRows(result.registrations)
      } catch {
        // El error ya queda en el panel de diagnóstico; se mantiene el último resumen.
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [auth, day])

  const summary = useMemo(() => (rows ? summarize(rows) : null), [rows])
  const session = days.find((s) => s.id === day)

  const dayButton = (id: string, label: string) => (
    <button
      key={id || 'all'}
      type="button"
      aria-pressed={day === id}
      onClick={() => {
        if (id === day) return
        setLoading(true)
        setDay(id)
      }}
      className="min-h-11 rounded-full border border-borde px-4 text-sm font-bold aria-pressed:border-acento aria-pressed:bg-acento aria-pressed:text-acento-contraste"
    >
      {label}
    </button>
  )

  return (
    <section className="flex flex-col gap-6">
      {/* Filtro en una fila, encima de todo lo que afecta. */}
      <div role="group" aria-label={t.day} className="flex flex-wrap gap-2">
        {dayButton('', t.allDays)}
        {days.map((s) => dayButton(s.id, s.title))}
      </div>

      {summary && (
        // Al cambiar de día se mantiene el resumen anterior, atenuado, hasta tener el nuevo.
        <div aria-busy={loading} className={`flex flex-col gap-6 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatTile
              label={t.registered}
              value={summary.total}
              meter={session ? { value: session.registered, max: session.capacity } : undefined}
              sub={
                session
                  ? session.registered >= session.capacity
                    ? t.full
                    : t.ofCapacity(session.capacity, session.capacity - session.registered)
                  : t.peopleAllDays
              }
            />
            <StatTile label={t.certificate} value={summary.certificate} sub={t.ofTotal(pct(summary.certificate, summary.total))} />
            <StatTile label={t.foodNeeds} value={summary.foodNeeds} sub={t.ofTotal(pct(summary.foodNeeds, summary.total))} />
          </div>

          {summary.total === 0 ? (
            <p className="text-texto-suave">{t.empty}</p>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <BarList title={t.participation} items={summary.participation} />
              <BarList title={t.food} help={t.foodHelp} items={summary.food} />
              <BarList title={t.cities} items={summary.cities} />
            </div>
          )}
        </div>
      )}
    </section>
  )
}
