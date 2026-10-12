import { ArrowLeft, MailCheck } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { TextInput } from '../../components/form'
import { accessText, registrationText } from '../../content/inscripcion'
import { useAuth } from '../../lib/auth/context'
import { authErrorCode } from '../../lib/auth/types'
import { reportError } from '../../lib/diagnostics'

const t = accessText
const r = accessText.reset

/** Segundos antes de poder reenviar el enlace (evita envíos repetidos y el bloqueo de Firebase). */
const RESEND_AFTER = 60

const primary =
  'inline-flex h-12 w-full items-center justify-center rounded-lg bg-acento px-6 text-sm font-bold tracking-wide text-acento-contraste uppercase hover:bg-acento/85 disabled:opacity-60'
const secondary =
  'inline-flex h-12 w-full items-center justify-center rounded-lg border border-acento-texto px-6 text-sm font-bold tracking-wide uppercase hover:bg-acento-texto/10 disabled:opacity-60'
const link = 'min-h-11 text-sm font-semibold text-acento-texto underline underline-offset-4'

/**
 * Recuperar la contraseña en su propia pantalla, en dos pasos: escribir el
 * correo (rellenado con el que ya se hubiera escrito) y «Revisa tu correo»,
 * con ayuda si no llega, reenvío tras una espera y vuelta a «Entrar». El
 * título recibe el foco en cada paso (lectores de pantalla).
 */
export function PasswordReset({ initialEmail, onBack }: { initialEmail: string; onBack: (email: string) => void }) {
  const auth = useAuth()
  const [email, setEmail] = useState(initialEmail)
  /** Correo al que se envió el enlace: null mientras se está en el primer paso. */
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wait, setWait] = useState(0)
  const heading = useRef<HTMLHeadingElement>(null)

  useEffect(() => heading.current?.focus(), [sentTo])

  useEffect(() => {
    if (wait <= 0) return
    const id = setTimeout(() => setWait((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [wait])

  const send = async (to: string) => {
    setBusy(true)
    setError(null)
    try {
      await auth.resetPassword(to)
      setSentTo(to.trim())
      setWait(RESEND_AFTER)
    } catch (e) {
      reportError('Recuperar contraseña', e)
      setError(t.errors[authErrorCode(e)] ?? registrationText.genericError)
    } finally {
      setBusy(false)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    void send(email)
  }

  const back = (
    <button type="button" onClick={() => onBack(sentTo ?? email)} className={`${link} inline-flex items-center gap-1.5 self-start no-underline`}>
      <ArrowLeft aria-hidden className="size-4" />
      {r.back}
    </button>
  )

  if (sentTo) {
    return (
      <div className="flex flex-col gap-4">
        {back}
        <MailCheck aria-hidden className="size-10 text-acento-texto" />
        <h3 ref={heading} tabIndex={-1} className="font-display text-2xl font-semibold outline-none">
          {r.sentTitle}
        </h3>
        <p role="status" className="text-pretty">
          {r.sentBody.before}
          <strong className="break-all">{sentTo}</strong>
          {r.sentBody.after}
        </p>
        <p className="rounded-lg bg-superficie p-3 text-sm text-pretty text-texto-suave">{r.sentHelp}</p>
        {error && (
          <p role="alert" className="text-sm font-semibold text-error">
            {error}
          </p>
        )}
        <button type="button" className={secondary} disabled={busy || wait > 0} onClick={() => void send(sentTo)}>
          {wait > 0 ? r.resendIn(wait) : r.resend}
        </button>
        <button
          type="button"
          className={`${link} self-center`}
          onClick={() => {
            setSentTo(null)
            setError(null)
          }}
        >
          {r.otherEmail}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {back}
      <h3 ref={heading} tabIndex={-1} className="font-display text-2xl font-semibold outline-none">
        {r.title}
      </h3>
      <p className="text-pretty text-texto-suave">{r.intro}</p>
      <TextInput id="resetEmail" label={t.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      {error && (
        <p role="alert" className="text-sm font-semibold text-error">
          {error}
        </p>
      )}
      <button type="submit" className={primary} disabled={busy}>
        {busy ? r.sending : r.submit}
      </button>
      <p className="text-sm text-pretty text-texto-suave">{r.googleNote}</p>
    </form>
  )
}
