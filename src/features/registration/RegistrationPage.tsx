import { useEffect, useState } from 'react'
import { PARTICIPATION_LABELS, type RegistrationData } from '../../../shared/registration'
import { PageShell } from '../../components/PageShell'
import { registrationText } from '../../content/inscripcion'
import { api } from '../../lib/api'
import { AuthProvider } from '../../lib/auth/AuthProvider'
import { useAuth } from '../../lib/auth/context'
import { initialValues, type FormInput, type PublicSession } from './formValues'
import { RegistrationForm } from './RegistrationForm'
import { SignedInBar, SignInPanel } from './SignInPanel'

const t = registrationText

interface SavedRegistration {
  email: string
  data: RegistrationData
}

/** `justSaved`: se acaba de guardar (hay que informar del correo); si no, es una inscripción previa. */
type View =
  | { kind: 'form' }
  | { kind: 'done'; justSaved: boolean; created: boolean; emailSent: boolean }
  | { kind: 'cancelled' }

const primary =
  'inline-flex h-12 items-center justify-center rounded-lg bg-acento px-6 text-sm font-bold tracking-wide text-acento-contraste uppercase hover:bg-acento/85 disabled:opacity-60'
const secondary =
  'inline-flex h-12 items-center justify-center rounded-lg border border-acento-texto px-6 text-sm font-bold tracking-wide uppercase hover:bg-acento-texto/10 disabled:opacity-60'

function RegistrationFlow() {
  const auth = useAuth()
  const [sessions, setSessions] = useState<PublicSession[] | null>(null)
  const [saved, setSaved] = useState<SavedRegistration | null>(null)
  const [view, setView] = useState<View>({ kind: 'form' })
  const [loadError, setLoadError] = useState<string | null>(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [busy, setBusy] = useState(false)

  // Carga de sesiones e inscripción al iniciar sesión (cancelable si cambia la cuenta).
  useEffect(() => {
    if (!auth.user) return
    let cancelled = false
    void (async () => {
      try {
        const token = await auth.getIdToken()
        const [s, r] = await Promise.all([
          api<{ sessions: PublicSession[] }>('sessions'),
          api<{ registration: SavedRegistration | null }>('registration', { token }),
        ])
        if (cancelled) return
        setSessions(s.sessions)
        setSaved(r.registration)
        setView(r.registration ? { kind: 'done', justSaved: false, created: false, emailSent: false } : { kind: 'form' })
        setLoadError(null)
      } catch {
        if (!cancelled) setLoadError(t.genericError)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [auth])

  if (auth.loading) return <p role="status">…</p>
  if (!auth.user) {
    return (
      <>
        <p className="mb-8 text-lg text-texto-suave">{t.intro}</p>
        <SignInPanel />
      </>
    )
  }
  if (loadError) return <p role="alert" className="text-error">{loadError}</p>
  if (!sessions) return <p role="status">…</p>

  const submit = async (input: FormInput) => {
    const token = await auth.getIdToken()
    try {
      const result = await api<{ registration: SavedRegistration; created: boolean; emailSent: boolean }>('registration', {
        method: 'POST',
        body: input,
        token,
      })
      setSaved(result.registration)
      setView({ kind: 'done', justSaved: true, created: result.created, emailSent: result.emailSent })
      window.scrollTo({ top: 0 })
    } finally {
      // Plazas actualizadas (también si falló por aforo).
      api<{ sessions: PublicSession[] }>('sessions').then((s) => setSessions(s.sessions), () => undefined)
    }
  }

  const cancel = async () => {
    setBusy(true)
    try {
      await api('registration', { method: 'DELETE', token: await auth.getIdToken() })
      setSaved(null)
      setConfirmCancel(false)
      setView({ kind: 'cancelled' })
      api<{ sessions: PublicSession[] }>('sessions').then((s) => setSessions(s.sessions), () => undefined)
    } finally {
      setBusy(false)
    }
  }

  if (view.kind === 'cancelled') {
    return (
      <>
        <SignedInBar />
        <p role="status" className="mb-6 text-lg">{t.success.cancelled}</p>
        <button type="button" className={primary} onClick={() => setView({ kind: 'form' })}>
          {t.success.newRegistration}
        </button>
      </>
    )
  }

  if (view.kind === 'done' && saved) {
    const titles = new Map(sessions.map((s) => [s.id, s.title]))
    const d = saved.data
    return (
      <>
        <SignedInBar />
        <div role="status" className="mb-8 rounded-2xl border border-borde bg-superficie p-6">
          <h2 className="text-2xl font-bold">{view.justSaved && !view.created ? t.success.updated : t.success.created}</h2>
          {view.justSaved && (
            <p className="mt-2 text-texto-suave">{view.emailSent ? t.success.emailSent(saved.email) : t.success.emailFailed}</p>
          )}
        </div>
        <h3 className="mb-3 font-bold">{t.success.summary}</h3>
        <dl className="mb-8 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[12rem_1fr]">
          <dt className="font-semibold">{t.fields.firstName}</dt>
          <dd>{d.firstName} {d.lastName}</dd>
          <dt className="font-semibold">{t.fields.participationType}</dt>
          <dd>{PARTICIPATION_LABELS[d.participationType]}</dd>
          <dt className="font-semibold">{t.sections.attendance}</dt>
          <dd>{d.sessionIds.map((id) => titles.get(id) ?? id).join(', ')}</dd>
          <dt className="font-semibold">{t.sections.certificate}</dt>
          <dd>{d.certificate ? t.fields.yes : t.fields.no}</dd>
        </dl>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={primary} onClick={() => setView({ kind: 'form' })}>
            {t.success.edit}
          </button>
          {!confirmCancel ? (
            <button type="button" className={secondary} onClick={() => setConfirmCancel(true)}>
              {t.success.cancel}
            </button>
          ) : (
            <div className="flex w-full flex-col gap-3 rounded-xl border border-error p-4" role="alertdialog" aria-label={t.success.cancelQuestion}>
              <p>{t.success.cancelQuestion}</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" className={`${secondary} border-error text-error`} disabled={busy} onClick={() => void cancel()}>
                  {t.success.cancelConfirm}
                </button>
                <button type="button" className={secondary} onClick={() => setConfirmCancel(false)}>
                  {t.success.cancelKeep}
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <SignedInBar />
      <RegistrationForm
        key={saved ? 'update' : 'create'}
        email={auth.user.email}
        sessions={sessions}
        ownSessionIds={saved?.data.sessionIds ?? []}
        initial={initialValues(saved?.data ?? null, auth.user.displayName)}
        isUpdate={Boolean(saved)}
        onSubmit={submit}
      />
    </>
  )
}

export default function RegistrationPage() {
  return (
    <AuthProvider>
      <PageShell title={t.pageTitle}>
        <RegistrationFlow />
      </PageShell>
    </AuthProvider>
  )
}
