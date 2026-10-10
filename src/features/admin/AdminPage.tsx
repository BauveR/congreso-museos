import { Download, SlidersHorizontal } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import {
  ALLERGENS,
  DIET_LABELS,
  DIETS,
  ID_TYPE_LABELS,
  PARTICIPATION_LABELS,
  PARTICIPATION_TYPES,
  type RegistrationData,
} from '../../../shared/registration'
import { dayColor } from '../../../shared/event'
import type { Session } from '../../../shared/sessions'
import { SelectInput, TextInput } from '../../components/form'
import { PageShell } from '../../components/PageShell'
import { ReadingSheet } from '../../components/ReadingSheet'
import { adminText } from '../../content/inscripcion'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { api, ApiError, download } from '../../lib/api'
import { AuthProvider } from '../../lib/auth/AuthProvider'
import { useAuth } from '../../lib/auth/context'
import { SignedInBar, SignInPanel } from '../registration/SignInPanel'
import { DiagnosticsButton } from './DiagnosticsButton'
import { StatsPanel } from './StatsPanel'
import type { AdminRegistration } from './types'

const t = adminText
const button =
  'inline-flex h-11 items-center justify-center rounded-lg bg-acento px-4 text-xs font-bold tracking-wide text-acento-contraste uppercase hover:bg-acento/85 disabled:opacity-60'
const ghost =
  'inline-flex h-11 items-center justify-center rounded-lg border border-acento-texto px-4 text-xs font-bold tracking-wide uppercase hover:bg-acento-texto/10 disabled:opacity-60'
const danger =
  'inline-flex h-11 items-center justify-center rounded-lg border border-error px-4 text-xs font-bold tracking-wide text-error uppercase hover:bg-error/10 disabled:opacity-60'
const cell = 'h-11 rounded-md border border-borde bg-superficie px-3 text-base font-normal tracking-normal text-texto normal-case'
const fieldLabel = 'flex flex-col gap-1.5 text-xs font-semibold tracking-wide text-texto-suave uppercase'


/* ---------- Días y aforo ---------- */

function SessionCard({ session, onSaved }: { session: Session; onSaved: (s: Session) => void }) {
  const auth = useAuth()
  const [draft, setDraft] = useState(session)
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const dirty =
    draft.title !== session.title || draft.date !== session.date || draft.capacity !== session.capacity || draft.active !== session.active
  const id = session.id

  const save = async () => {
    setBusy(true)
    setStatus(null)
    try {
      const { session: updated } = await api<{ session: Session }>('admin/sessions', {
        method: 'PATCH',
        token: await auth.getIdToken(),
        body: { id: session.id, title: draft.title, date: draft.date, capacity: draft.capacity, active: draft.active },
      })
      onSaved(updated)
      setDraft(updated)
      setStatus({ ok: true, text: t.sessions.saved })
    } catch (error) {
      setStatus({ ok: false, text: error instanceof ApiError ? error.message : String(error) })
    } finally {
      setBusy(false)
    }
  }

  const full = session.registered >= session.capacity
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-borde p-4 sm:p-5">
      <label className={fieldLabel}>
        {t.sessions.title}
        <input className={`${cell} w-full`} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className={fieldLabel}>
          {t.sessions.date}
          <input type="date" className={`${cell} w-full`} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
        </label>
        <label className={fieldLabel}>
          {t.sessions.capacity}
          <input
            type="number"
            inputMode="numeric"
            min={session.registered}
            step={1}
            className={`${cell} w-full`}
            value={Number.isNaN(draft.capacity) ? '' : draft.capacity}
            onChange={(e) => setDraft({ ...draft, capacity: e.target.valueAsNumber })}
          />
        </label>
      </div>
      <div>
        <p className={`flex justify-between text-sm ${full ? 'font-bold text-acento-texto' : 'text-texto-suave'}`}>
          <span>{t.sessions.registered}</span>
          <span className="tabular-nums">
            {session.registered} / {session.capacity}
          </span>
        </p>
        <div aria-hidden className="mt-1.5 h-2 overflow-hidden rounded-full bg-acento/20">
          <div className="h-full rounded-full bg-acento" style={{ width: `${Math.min(100, (session.registered / Math.max(1, session.capacity)) * 100)}%` }} />
        </div>
      </div>
      <label htmlFor={`active-${id}`} className="flex min-h-11 items-center gap-3 text-sm font-semibold">
        <input
          id={`active-${id}`}
          type="checkbox"
          className="size-5 accent-acento"
          checked={draft.active}
          onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
        />
        {t.sessions.active}
      </label>
      <button type="button" className={`${button} w-full`} disabled={!dirty || busy} onClick={() => void save()}>
        {t.sessions.save}
      </button>
      {status && (
        <p role="status" className={`-mt-2 text-xs ${status.ok ? 'text-texto-suave' : 'font-semibold text-error'}`}>
          {status.text}
        </p>
      )}
    </li>
  )
}

function SessionsPanel({ sessions, setSessions }: { sessions: Session[]; setSessions: (s: Session[]) => void }) {
  const auth = useAuth()
  const [busy, setBusy] = useState(false)

  const recount = async () => {
    setBusy(true)
    try {
      const result = await api<{ sessions: Session[] }>('admin/sessions', {
        method: 'POST',
        token: await auth.getIdToken(),
        body: { action: 'recount' },
      })
      setSessions(result.sessions)
    } finally {
      setBusy(false)
    }
  }

  // Una tarjeta por día (cabe en móvil sin scroll lateral); en escritorio, en columnas.
  return (
    <section className="flex flex-col gap-4">
      <p className="text-sm text-texto-suave">{t.sessions.capacityHelp}</p>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sessions.map((s) => (
          <SessionCard key={`${s.id}-${s.registered}-${s.capacity}`} session={s} onSaved={(u) => setSessions(sessions.map((x) => (x.id === u.id ? u : x)))} />
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={ghost} disabled={busy} onClick={() => void recount()}>
          {t.sessions.recount}
        </button>
        <p className="text-xs text-texto-suave">{t.sessions.recountHelp}</p>
      </div>
    </section>
  )
}

/* ---------- Inscritos ---------- */

const ALLERGEN_LABELS = new Map<string, string>(ALLERGENS.map((a) => [a.id, a.label]))

/** Resumen de alimentación para la tabla: dieta y alergias (— si no hay nada). */
function foodSummary(d: RegistrationData): string {
  const parts = [
    d.diet !== 'ninguna' ? DIET_LABELS[d.diet] : '',
    ...d.allergens.map((a) => ALLERGEN_LABELS.get(a) ?? a),
    d.otherAllergy?.trim() ?? '',
  ].filter(Boolean)
  return parts.join(', ') || '—'
}

/** Cancelar una inscripción ajena, con confirmación en dos pasos (sin diálogos del navegador). */
function CancelRegistration({ uid, onCancelled }: { uid: string; onCancelled: () => void }) {
  const auth = useAuth()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const r = t.registrations

  const cancel = async () => {
    setBusy(true)
    setError(null)
    try {
      await api(`admin/registrations?uid=${encodeURIComponent(uid)}`, { method: 'DELETE', token: await auth.getIdToken() })
      onCancelled()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : String(e))
      setBusy(false)
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-borde pt-4">
      {confirming ? (
        <>
          <button type="button" className={danger} disabled={busy} onClick={() => void cancel()}>
            {r.cancelConfirm}
          </button>
          <button type="button" className={ghost} disabled={busy} onClick={() => setConfirming(false)}>
            {r.cancelKeep}
          </button>
        </>
      ) : (
        <button type="button" className={danger} onClick={() => setConfirming(true)}>
          {r.cancel}
        </button>
      )}
      <p className="text-sm text-texto-suave">{r.cancelHelp}</p>
      {error && (
        <p role="alert" className="w-full font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  )
}

const NO_FILTERS = { session: '', type: '', city: '', certificate: '', food: '', q: '' }

/** Ficha completa de una inscripción y su cancelación (bajo la fila o dentro de la tarjeta). */
function RegistrationDetails({ row, onCancelled }: { row: AdminRegistration; onCancelled: () => void }) {
  const { uid, data: d, createdAt, updatedAt } = row
  const r = t.registrations
  return (
    <>
      <dl className="grid gap-x-4 gap-y-1 rounded-xl bg-superficie p-4 text-sm sm:grid-cols-[14rem_1fr]">
        {[
          [r.detailLabels.jobTitle, d.jobTitle],
          [r.detailLabels.idDocument, d.idDocument ? `${ID_TYPE_LABELS[d.idDocument.type]} ${d.idDocument.number}` : '—'],
          [r.detailLabels.accessibility, d.accessibility || '—'],
          [r.detailLabels.allergens, d.allergens.map((a) => ALLERGEN_LABELS.get(a) ?? a).join(', ') || '—'],
          [r.detailLabels.otherAllergy, d.otherAllergy || '—'],
          [r.detailLabels.diet, DIET_LABELS[d.diet]],
          [r.detailLabels.consents, `${d.consents.image ? 'Sí' : 'No'} / ${d.consents.communications ? 'Sí' : 'No'}`],
          [r.detailLabels.dates, `${new Date(createdAt).toLocaleString('es-ES')} / ${new Date(updatedAt).toLocaleString('es-ES')}`],
        ].map(([term, value]) => (
          <div key={term} className="contents">
            <dt className="font-semibold">{term}</dt>
            <dd className="mb-2 break-words whitespace-pre-line text-texto-suave sm:mb-0">{value}</dd>
          </div>
        ))}
      </dl>
      <CancelRegistration uid={uid} onCancelled={onCancelled} />
    </>
  )
}

/** Días elegidos como píldoras con el color de cada día (los mismos que el formulario y el correo). */
function DayPills({ ids, days }: { ids: string[]; days: Session[] }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const index = days.findIndex((s) => s.id === id)
        const color = index >= 0 ? dayColor(index) : null
        const title = days[index]?.title.split('·')[0]?.trim() ?? id
        return (
          <span
            key={id}
            className="rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap"
            style={color ? { background: color.bg, color: color.text } : undefined}
          >
            {title}
          </span>
        )
      })}
    </span>
  )
}

function RegistrationsPanel({ sessions, onSessionsChanged }: { sessions: Session[]; onSessionsChanged: () => void }) {
  const auth = useAuth()
  const desktop = useBreakpoint() === 'desktop'
  const [filters, setFilters] = useState(NO_FILTERS)
  /** Escritorio: panel de filtros desplegado bajo la barra. Móvil: hoja inferior con los filtros. */
  const [filtersOpen, setFiltersOpen] = useState(desktop)
  const [rows, setRows] = useState<AdminRegistration[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const query = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString()

  // Filtros con pequeña espera para no pedir en cada tecla.
  useEffect(() => {
    let cancelled = false
    const id = setTimeout(async () => {
      try {
        const result = await api<{ registrations: AdminRegistration[] }>(`admin/registrations${query ? `?${query}` : ''}`, {
          token: await auth.getIdToken(),
        })
        if (!cancelled) {
          setRows(result.registrations)
          setError(null)
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof ApiError ? e.message : String(e))
      }
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(id)
    }
  }, [query, auth])

  const exportCsv = async () => {
    setExporting(true)
    try {
      await download(`admin/export${query ? `?${query}` : ''}`, await auth.getIdToken(), 'inscripciones.csv')
    } catch (e) {
      setError(e instanceof ApiError ? e.message : String(e))
    } finally {
      setExporting(false)
    }
  }

  const days = sessions.filter((s) => s.kind === 'day')
  const set = (key: keyof typeof filters, value: string) => setFilters((f) => ({ ...f, [key]: value }))
  const activeCount = Object.values(filters).filter(Boolean).length
  const r = t.registrations
  const total = rows ? r.total(rows.length) : '…'
  const cancelled = (uid: string) => () => {
    setRows((list) => list?.filter((row) => row.uid !== uid) ?? null)
    setOpen(null)
    onSessionsChanged()
  }

  const clearButton = activeCount > 0 && (
    <button type="button" className="min-h-11 text-sm font-bold text-acento-texto underline underline-offset-4" onClick={() => setFilters(NO_FILTERS)}>
      {r.clearFilters}
    </button>
  )

  const fields = (
    <fieldset id="admin-filters" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <legend className="sr-only">{r.filters}</legend>
      <SelectInput id="fSession" label={r.session} value={filters.session} onChange={(e) => set('session', e.target.value)}>
        <option value="">{r.allSessions}</option>
        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.title}
          </option>
        ))}
      </SelectInput>
      <SelectInput id="fType" label={r.type} value={filters.type} onChange={(e) => set('type', e.target.value)}>
        <option value="">{r.allTypes}</option>
        {PARTICIPATION_TYPES.map((type) => (
          <option key={type} value={type}>
            {PARTICIPATION_LABELS[type]}
          </option>
        ))}
      </SelectInput>
      <TextInput id="fCity" label={r.city} value={filters.city} onChange={(e) => set('city', e.target.value)} />
      <SelectInput id="fCert" label={r.certificate} value={filters.certificate} onChange={(e) => set('certificate', e.target.value)}>
        <option value="">{r.any}</option>
        <option value="si">Sí</option>
        <option value="no">No</option>
      </SelectInput>
      <SelectInput id="fFood" label={r.food} value={filters.food} onChange={(e) => set('food', e.target.value)}>
        <option value="">{r.any}</option>
        {Object.entries(r.foodOptions).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
        <optgroup label={r.foodDiets}>
          {DIETS.filter((d) => d !== 'ninguna').map((d) => (
            <option key={d} value={d}>
              {DIET_LABELS[d]}
            </option>
          ))}
        </optgroup>
        <optgroup label={r.foodAllergens}>
          {ALLERGENS.map((a) => (
            <option key={a.id} value={`alergeno:${a.id}`}>
              {a.label}
            </option>
          ))}
        </optgroup>
      </SelectInput>
      <TextInput id="fQ" label={r.search} value={filters.q} onChange={(e) => set('q', e.target.value)} />
    </fieldset>
  )

  return (
    <section className="flex flex-col gap-6">
      {/* Barra fija arriba al recorrer la lista: filtros, total y exportar siempre a mano, en una sola línea. */}
      <div className="sticky top-0 z-20 mx-[calc(var(--wrap-gutter)*-1)] flex flex-col gap-4 border-b border-borde bg-fondo/95 px-(--wrap-gutter) py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls={desktop ? 'admin-filters' : undefined}
            aria-haspopup={desktop ? undefined : 'dialog'}
            onClick={() => setFiltersOpen((o) => !o)}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-borde px-4 text-sm font-bold"
          >
            <SlidersHorizontal aria-hidden className="size-4" />
            {r.filters}
            {activeCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-acento px-1.5 text-xs text-acento-contraste tabular-nums">
                {activeCount}
                <span className="sr-only"> {r.activeFilters(activeCount)}</span>
              </span>
            )}
          </button>
          {desktop && clearButton}
          <p role="status" className="ml-auto truncate text-sm font-semibold">
            {total}
          </p>
          <button
            type="button"
            className={`${button} shrink-0 gap-2`}
            disabled={exporting || !rows?.length}
            onClick={() => void exportCsv()}
            aria-label={desktop ? undefined : exporting ? r.exporting : r.export}
          >
            <Download aria-hidden className="size-4" />
            {desktop && (exporting ? r.exporting : r.export)}
          </button>
        </div>
        {desktop && filtersOpen && fields}
      </div>

      {/* Móvil: los filtros en una hoja inferior; el botón grande de abajo muestra los resultados. */}
      {!desktop && (
        <ReadingSheet open={filtersOpen} title={r.filters} closeLabel={r.showResults(total)} onClose={() => setFiltersOpen(false)}>
          <div className="flex flex-col gap-4">
            {fields}
            {clearButton}
          </div>
        </ReadingSheet>
      )}

      {error && (
        <p role="alert" className="font-semibold text-error">
          {error}
        </p>
      )}

      {rows && rows.length === 0 && <p className="text-texto-suave">{r.empty}</p>}

      {/* Móvil: una tarjeta por inscripción, sin scroll lateral. */}
      {rows && rows.length > 0 && !desktop && (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => {
            const { uid, email, data: d } = row
            return (
              <li key={uid} className="flex flex-col gap-3 rounded-2xl border border-borde p-4">
                <div>
                  <p className="font-semibold">
                    {d.lastName}, {d.firstName}
                  </p>
                  <p className="text-sm text-texto-suave">
                    {PARTICIPATION_LABELS[d.participationType]}
                    {d.city && ` · ${d.city}`}
                  </p>
                </div>
                <DayPills ids={d.sessionIds} days={days} />
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  <dt className="text-texto-suave">{r.columns[1]}</dt>
                  <dd className="min-w-0 break-all">
                    <a href={`mailto:${email}`} className="underline underline-offset-4">
                      {email}
                    </a>
                  </dd>
                  <dt className="text-texto-suave">{r.columns[2]}</dt>
                  <dd>
                    <a href={`tel:${d.phone}`} className="underline underline-offset-4">
                      {d.phone}
                    </a>
                  </dd>
                  {d.organization && (
                    <>
                      <dt className="text-texto-suave">{r.columns[4]}</dt>
                      <dd className="min-w-0 break-words">{d.organization}</dd>
                    </>
                  )}
                  <dt className="text-texto-suave">{r.columns[7]}</dt>
                  <dd>{d.certificate ? 'Sí' : 'No'}</dd>
                  <dt className="text-texto-suave">{r.columns[8]}</dt>
                  <dd className="min-w-0 break-words">{foodSummary(d)}</dd>
                </dl>
                <button type="button" className={`${ghost} w-full`} aria-expanded={open === uid} onClick={() => setOpen(open === uid ? null : uid)}>
                  {open === uid ? r.hideDetails : r.details}
                </button>
                {open === uid && <RegistrationDetails row={row} onCancelled={cancelled(uid)} />}
              </li>
            )
          })}
        </ul>
      )}

      {/* Escritorio: tabla completa. */}
      {rows && rows.length > 0 && desktop && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[68rem] text-left text-sm">
            <thead className="text-xs tracking-wide text-texto-suave uppercase">
              <tr>
                {r.columns.map((c) => (
                  <th key={c} className="pb-2 pr-3 font-semibold">
                    {c}
                  </th>
                ))}
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const { uid, email, data: d } = row
                return (
                  <Fragment key={uid}>
                    <tr className="border-t border-borde">
                      <td className="py-2 pr-3 font-semibold">
                        {d.lastName}, {d.firstName}
                      </td>
                      <td className="py-2 pr-3">{email}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">{d.phone}</td>
                      <td className="py-2 pr-3">{d.city}</td>
                      <td className="py-2 pr-3">{d.organization}</td>
                      <td className="py-2 pr-3">{PARTICIPATION_LABELS[d.participationType]}</td>
                      <td className="py-2 pr-3">
                        <DayPills ids={d.sessionIds} days={days} />
                      </td>
                      <td className="py-2 pr-3">{d.certificate ? 'Sí' : 'No'}</td>
                      <td className="py-2 pr-3">{foodSummary(d)}</td>
                      <td className="py-2">
                        <button
                          type="button"
                          className="min-h-11 text-xs font-bold text-acento-texto underline underline-offset-4"
                          aria-expanded={open === uid}
                          onClick={() => setOpen(open === uid ? null : uid)}
                        >
                          {open === uid ? r.hideDetails : r.details}
                        </button>
                      </td>
                    </tr>
                    {open === uid && (
                      <tr>
                        <td colSpan={10} className="pb-4">
                          <RegistrationDetails row={row} onCancelled={cancelled(uid)} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

/* ---------- Página ---------- */

function AdminDashboard() {
  const auth = useAuth()
  const [tab, setTab] = useState<'stats' | 'sessions' | 'registrations'>('stats')
  const [sessions, setSessions] = useState<Session[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  /** Se incrementa para volver a pedir las sesiones (p. ej. tras cancelar una inscripción). */
  const [sessionsVersion, setSessionsVersion] = useState(0)

  useEffect(() => {
    if (!auth.user || !auth.isAdmin) return
    let cancelled = false
    void (async () => {
      try {
        const result = await api<{ sessions: Session[] }>('admin/sessions', { token: await auth.getIdToken() })
        if (!cancelled) setSessions(result.sessions)
      } catch (e) {
        if (!cancelled) setError(e instanceof ApiError ? e.message : String(e))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [auth, sessionsVersion])

  if (auth.loading) return <p role="status">…</p>
  if (!auth.user) return <SignInPanel allowAdmin />
  if (!auth.isAdmin) {
    return (
      <>
        <SignedInBar />
        <p role="alert">{t.forbidden}</p>
      </>
    )
  }

  // pb-20: el botón fijo de diagnóstico (abajo a la izquierda) no tapa lo último de la lista.
  return (
    <div className="pb-20">
      <SignedInBar />
      <div role="tablist" aria-label={t.pageTitle} className="mb-8 flex gap-2 border-b border-borde">
        {(['stats', 'sessions', 'registrations'] as const).map((key) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className="-mb-px min-h-11 flex-1 border-b-2 border-transparent px-2 py-3 text-xs font-bold tracking-wide whitespace-nowrap uppercase aria-selected:border-acento aria-selected:text-acento-texto sm:flex-none sm:px-4 sm:text-sm"
          >
            {t.tabs[key]}
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="mb-4 font-semibold text-error">
          {error}
        </p>
      )}
      {sessions && tab === 'stats' && <StatsPanel sessions={sessions} />}
      {sessions && tab === 'sessions' && <SessionsPanel sessions={sessions} setSessions={setSessions} />}
      {sessions && tab === 'registrations' && (
        <RegistrationsPanel sessions={sessions} onSessionsChanged={() => setSessionsVersion((v) => v + 1)} />
      )}
    </div>
  )
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <PageShell title={t.pageTitle} wide>
        <AdminDashboard />
      </PageShell>
      <DiagnosticsButton />
    </AuthProvider>
  )
}
