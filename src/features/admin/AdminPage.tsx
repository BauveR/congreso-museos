import { Fragment, useEffect, useState } from 'react'
import {
  ALLERGENS,
  DIET_LABELS,
  ID_TYPE_LABELS,
  PARTICIPATION_LABELS,
  PARTICIPATION_TYPES,
  type RegistrationData,
} from '../../../shared/registration'
import type { Session } from '../../../shared/sessions'
import { SelectInput, TextInput } from '../../components/form'
import { PageShell } from '../../components/PageShell'
import { adminText } from '../../content/inscripcion'
import { api, ApiError, download } from '../../lib/api'
import { AuthProvider } from '../../lib/auth/AuthProvider'
import { useAuth } from '../../lib/auth/context'
import { SignedInBar, SignInPanel } from '../registration/SignInPanel'

const t = adminText
const button =
  'inline-flex h-10 items-center justify-center rounded-lg bg-acento px-4 text-xs font-bold tracking-wide text-acento-contraste uppercase hover:bg-acento/85 disabled:opacity-60'
const ghost =
  'inline-flex h-10 items-center justify-center rounded-lg border border-acento-texto px-4 text-xs font-bold tracking-wide uppercase hover:bg-acento-texto/10 disabled:opacity-60'
const cell = 'rounded-md border border-borde bg-superficie px-2 py-1.5 text-sm text-texto'

interface AdminRegistration {
  uid: string
  email: string
  data: RegistrationData
  createdAt: string
  updatedAt: string
}

/* ---------- Días y aforo ---------- */

function SessionRow({ session, onSaved }: { session: Session; onSaved: (s: Session) => void }) {
  const auth = useAuth()
  const [draft, setDraft] = useState(session)
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const dirty =
    draft.title !== session.title || draft.date !== session.date || draft.capacity !== session.capacity || draft.active !== session.active

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
    <tr className="border-t border-borde align-top">
      <td className="py-3 pr-3">
        <input aria-label={t.sessions.title} className={`${cell} w-full min-w-48`} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
      </td>
      <td className="py-3 pr-3">
        <input aria-label={t.sessions.date} type="date" className={cell} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
      </td>
      <td className="py-3 pr-3">
        <input
          aria-label={t.sessions.capacity}
          type="number"
          min={session.registered}
          step={1}
          className={`${cell} w-24`}
          value={Number.isNaN(draft.capacity) ? '' : draft.capacity}
          onChange={(e) => setDraft({ ...draft, capacity: e.target.valueAsNumber })}
        />
      </td>
      <td className={`py-3 pr-3 text-sm tabular-nums ${full ? 'font-bold text-acento-texto' : ''}`}>
        {session.registered} / {session.capacity}
      </td>
      <td className="py-3 pr-3">
        <input aria-label={t.sessions.active} type="checkbox" className="mt-2 size-5 accent-acento" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />
      </td>
      <td className="py-3">
        <button type="button" className={button} disabled={!dirty || busy} onClick={() => void save()}>
          {t.sessions.save}
        </button>
        {status && (
          <p role="status" className={`mt-1 max-w-56 text-xs ${status.ok ? 'text-texto-suave' : 'font-semibold text-error'}`}>
            {status.text}
          </p>
        )}
      </td>
    </tr>
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

  return (
    <section className="flex flex-col gap-4">
      <p className="text-sm text-texto-suave">{t.sessions.capacityHelp}</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left">
          <thead className="text-xs tracking-wide text-texto-suave uppercase">
            <tr>
              <th className="pb-2 font-semibold">{t.sessions.title}</th>
              <th className="pb-2 font-semibold">{t.sessions.date}</th>
              <th className="pb-2 font-semibold">{t.sessions.capacity}</th>
              <th className="pb-2 font-semibold">{t.sessions.registered}</th>
              <th className="pb-2 font-semibold">{t.sessions.active}</th>
              <th className="pb-2" />
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <SessionRow key={`${s.id}-${s.registered}-${s.capacity}`} session={s} onSaved={(u) => setSessions(sessions.map((x) => (x.id === u.id ? u : x)))} />
            ))}
          </tbody>
        </table>
      </div>
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

function RegistrationsPanel({ sessions }: { sessions: Session[] }) {
  const auth = useAuth()
  const [filters, setFilters] = useState({ session: '', type: '', city: '', certificate: '', q: '' })
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

  const titles = new Map(sessions.map((s) => [s.id, s.title]))
  const set = (key: keyof typeof filters, value: string) => setFilters((f) => ({ ...f, [key]: value }))
  const r = t.registrations

  return (
    <section className="flex flex-col gap-6">
      <fieldset className="grid gap-4 rounded-2xl border border-borde p-4 sm:grid-cols-2 lg:grid-cols-5">
        <legend className="px-2 text-sm font-semibold">{r.filters}</legend>
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
        <TextInput id="fQ" label={r.search} value={filters.q} onChange={(e) => set('q', e.target.value)} />
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="font-semibold">
          {rows ? r.total(rows.length) : '…'}
        </p>
        <button type="button" className={button} disabled={exporting || !rows?.length} onClick={() => void exportCsv()}>
          {exporting ? r.exporting : r.export}
        </button>
      </div>
      {error && (
        <p role="alert" className="font-semibold text-error">
          {error}
        </p>
      )}

      {rows && rows.length === 0 && <p className="text-texto-suave">{r.empty}</p>}
      {rows && rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[60rem] text-left text-sm">
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
              {rows.map(({ uid, email, data: d, createdAt, updatedAt }) => (
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
                    <td className="py-2 pr-3">{d.sessionIds.map((id) => titles.get(id)?.split('·')[0]?.trim() ?? id).join(', ')}</td>
                    <td className="py-2 pr-3">{d.certificate ? 'Sí' : 'No'}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        className="text-xs font-bold text-acento-texto underline underline-offset-4"
                        aria-expanded={open === uid}
                        onClick={() => setOpen(open === uid ? null : uid)}
                      >
                        {open === uid ? r.hideDetails : r.details}
                      </button>
                    </td>
                  </tr>
                  {open === uid && (
                    <tr>
                      <td colSpan={9} className="pb-4">
                        <dl className="grid gap-x-4 gap-y-1 rounded-xl bg-superficie p-4 sm:grid-cols-[14rem_1fr]">
                          {[
                            [r.detailLabels.jobTitle, d.jobTitle],
                            [r.detailLabels.idDocument, d.idDocument ? `${ID_TYPE_LABELS[d.idDocument.type]} ${d.idDocument.number}` : '—'],
                            [r.detailLabels.accessibility, d.accessibility || '—'],
                            [r.detailLabels.allergens, d.allergens.map((a) => ALLERGEN_LABELS.get(a) ?? a).join(', ') || '—'],
                            [r.detailLabels.otherAllergy, d.otherAllergy || '—'],
                            [r.detailLabels.diet, DIET_LABELS[d.diet]],
                            [r.detailLabels.observations, d.observations || '—'],
                            [r.detailLabels.consents, `${d.consents.image ? 'Sí' : 'No'} / ${d.consents.communications ? 'Sí' : 'No'}`],
                            [r.detailLabels.dates, `${new Date(createdAt).toLocaleString('es-ES')} / ${new Date(updatedAt).toLocaleString('es-ES')}`],
                          ].map(([term, value]) => (
                            <div key={term} className="contents">
                              <dt className="font-semibold">{term}</dt>
                              <dd className="whitespace-pre-line text-texto-suave">{value}</dd>
                            </div>
                          ))}
                        </dl>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
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
  const [tab, setTab] = useState<'sessions' | 'registrations'>('sessions')
  const [sessions, setSessions] = useState<Session[] | null>(null)
  const [error, setError] = useState<string | null>(null)

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
  }, [auth])

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

  return (
    <>
      <SignedInBar />
      <div role="tablist" aria-label={t.pageTitle} className="mb-8 flex gap-2 border-b border-borde">
        {(['sessions', 'registrations'] as const).map((key) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className="-mb-px border-b-2 border-transparent px-4 py-3 text-sm font-bold tracking-wide uppercase aria-selected:border-acento aria-selected:text-acento-texto"
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
      {sessions && tab === 'sessions' && <SessionsPanel sessions={sessions} setSessions={setSessions} />}
      {sessions && tab === 'registrations' && <RegistrationsPanel sessions={sessions} />}
    </>
  )
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <PageShell title={t.pageTitle} wide>
        <AdminDashboard />
      </PageShell>
    </AuthProvider>
  )
}
