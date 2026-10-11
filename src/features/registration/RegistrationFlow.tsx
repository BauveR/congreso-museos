import { useEffect, useState } from 'react'
import { ConnectionNotice } from '../../components/ConnectionNotice'
import type { RegistrationData } from '../../../shared/registration'
import { registrationText } from '../../content/inscripcion'
import { api, ApiError } from '../../lib/api'
import { useAuth } from '../../lib/auth/context'
import { useLoadPhase } from '../../lib/connectivity'
import { reportError } from '../../lib/diagnostics'
import { initialValues, type FormInput, type PublicSession } from './formValues'
import { RegistrationForm } from './RegistrationForm'
import { RegistrationSummary } from './RegistrationSummary'

const t = registrationText

interface SavedRegistration {
  email: string
  data: RegistrationData
}

/** `justSaved`: se acaba de guardar (hay que informar del correo); si no, es una inscripción previa. */
type View =
  | { kind: 'form' }
  /** emailSent: null = no se envió a propósito (cambios menores o cupo diario agotado). */
  | { kind: 'done'; justSaved: boolean; created: boolean; emailSent: boolean | null }
  | { kind: 'cancelled' }

const primary =
  'inline-flex h-12 items-center justify-center rounded-lg bg-acento px-6 text-sm font-bold tracking-wide text-acento-contraste uppercase hover:bg-acento/85 disabled:opacity-60'
const secondary =
  'inline-flex h-12 items-center justify-center rounded-lg border border-acento-texto px-6 text-sm font-bold tracking-wide uppercase hover:bg-acento-texto/10 disabled:opacity-60'

export type RegistrationViewKind = View['kind'] | 'loading' | 'error'

interface RegistrationFlowProps {
  /** Tras guardar (p. ej. llevar a la vista el resultado). */
  onSaved?: () => void
  /** Cambio de vista (el contenedor puede animar su altura o cambiar textos). */
  onViewChange?: (kind: RegistrationViewKind) => void
  /** Formulario en dos columnas en escritorio. */
  wide?: boolean
}

/**
 * Inscripción con sesión iniciada: formulario, resumen (con modificar y
 * cancelar) y cancelada. La usan la página /inscripcion y la landing.
 */
export function RegistrationFlow({ onSaved, onViewChange, wide = false }: RegistrationFlowProps) {
  const auth = useAuth()
  const [sessions, setSessions] = useState<PublicSession[] | null>(null)
  /** Inscripciones abiertas (el servidor decide; administración puede inscribirse siempre). */
  const [open, setOpen] = useState(true)
  const [saved, setSaved] = useState<SavedRegistration | null>(null)
  const [view, setView] = useState<View>({ kind: 'form' })
  const [loadError, setLoadError] = useState<{ account: boolean; message: string } | null>(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [busy, setBusy] = useState(false)
  /** Se incrementa con «Reintentar» para repetir la carga (sin recargar la página). */
  const [attempt, setAttempt] = useState(0)
  // Dependencias por uid, no por objeto: no se repite la carga si cambia otra cosa de la sesión.
  const uid = auth.user?.uid
  const { getIdToken } = auth

  // Carga de sesiones e inscripción al iniciar sesión (cancelable si cambia la cuenta).
  useEffect(() => {
    if (!uid) return
    let cancelled = false
    void (async () => {
      try {
        const token = await getIdToken()
        const [s, r] = await Promise.all([
          api<{ sessions: PublicSession[]; open: boolean }>('sessions'),
          api<{ registration: SavedRegistration | null }>('registration', { token }),
        ])
        if (cancelled) return
        setSessions(s.sessions)
        setOpen(s.open)
        setSaved(r.registration)
        setView(r.registration ? { kind: 'done', justSaved: false, created: false, emailSent: false } : { kind: 'form' })
        setLoadError(null)
      } catch (error) {
        reportError('Cargar días e inscripción', error)
        // 401/403: problema de la cuenta (sesión caducada, sin permiso), no de la red.
        const account = error instanceof ApiError && (error.status === 401 || error.status === 403)
        if (!cancelled) setLoadError({ account, message: account ? error.message : t.genericError })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [uid, getIdToken, attempt])

  const kind: RegistrationViewKind = loadError ? 'error' : !sessions ? 'loading' : view.kind
  useEffect(() => onViewChange?.(kind), [kind, onViewChange])
  // Los errores de cuenta no son de conexión: ni «está tardando» ni contador de fallos de red.
  const phase = useLoadPhase(!sessions && !loadError, Boolean(loadError && !loadError.account))

  if (!auth.user) return null
  if (loadError?.account) {
    // Reintentar daría el mismo error: la salida es volver a entrar.
    return (
      <div role="alert" className="rounded-2xl border border-error p-5">
        <p className="font-bold">{t.accountProblemTitle}</p>
        <p className="mt-1 text-sm text-texto-suave">{loadError.message}</p>
        <button type="button" className={`${primary} mt-4`} onClick={() => void auth.signOut()}>
          {t.signOutAndRetry}
        </button>
      </div>
    )
  }
  if (phase) {
    return (
      <ConnectionNotice
        phase={phase}
        onRetry={() => {
          setLoadError(null)
          setAttempt((n) => n + 1)
        }}
      />
    )
  }
  if (!sessions) return null

  const submit = async (input: FormInput) => {
    const token = await auth.getIdToken()
    try {
      const result = await api<{ registration: SavedRegistration; created: boolean; emailSent: boolean | null }>('registration', {
        method: 'POST',
        body: input,
        token,
      })
      setSaved(result.registration)
      setView({ kind: 'done', justSaved: true, created: result.created, emailSent: result.emailSent })
      onSaved?.()
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
        <p role="status" className="mb-6 text-lg">{t.success.cancelled}</p>
        <button type="button" className={primary} onClick={() => setView({ kind: 'form' })}>
          {t.success.newRegistration}
        </button>
      </>
    )
  }

  if (view.kind === 'done' && saved) {
    return (
      <>
        <div role="status" className="mb-8 rounded-2xl border border-borde bg-superficie p-6">
          <h2 className="text-2xl font-bold">{view.justSaved && !view.created ? t.success.updated : t.success.created}</h2>
          {view.justSaved && view.emailSent !== null && (
            <p className="mt-2 text-texto-suave">{view.emailSent ? t.success.emailSent(saved.email) : t.success.emailFailed}</p>
          )}
        </div>
        <h3 className="mb-3 font-bold">{t.success.summary}</h3>
        <RegistrationSummary data={saved.data} sessions={sessions} className="mb-8" />
        {!open && !auth.isAdmin && <p className="mb-4 text-sm text-texto-suave">{t.closedChanges}</p>}
        <div className="flex flex-wrap gap-3">
          {/* Con el plazo cerrado, «Modificar» llevaría a un aviso sin salida: solo cancelar. */}
          {(open || auth.isAdmin) && (
            <button type="button" className={primary} onClick={() => setView({ kind: 'form' })}>
              {t.success.edit}
            </button>
          )}
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

  // Cerradas: ni alta ni cambios (el servidor también lo impide); cancelar sigue disponible en el resumen.
  if (!open && !auth.isAdmin) {
    return (
      <p role="status" className="rounded-2xl border border-borde bg-superficie p-6 text-lg">
        {t.closed}
      </p>
    )
  }

  // Sin inscripción y todos los días completos: el formulario no tendría ningún día que elegir.
  const days = sessions.filter((s) => s.kind === 'day')
  if (!saved && days.length > 0 && days.every((s) => s.remaining <= 0)) {
    return (
      <p role="status" className="rounded-2xl border border-borde bg-superficie p-6 text-lg">
        {t.allFull}
      </p>
    )
  }

  return (
    <>
      {/* Al modificar: salida al resumen sin guardar. */}
      {saved && (
        <button
          type="button"
          className="mb-6 min-h-11 text-sm font-bold text-acento-texto underline underline-offset-4"
          onClick={() => setView({ kind: 'done', justSaved: false, created: false, emailSent: false })}
        >
          ← {t.backToSummary}
        </button>
      )}
      <RegistrationForm
        key={saved ? 'update' : 'create'}
        email={auth.user.email}
        sessions={sessions}
        ownSessionIds={saved?.data.sessionIds ?? []}
        initial={initialValues(saved?.data ?? null, auth.user.displayName)}
        isUpdate={Boolean(saved)}
        onSubmit={submit}
        wide={wide}
      />
    </>
  )
}

