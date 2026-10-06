import { useState, type FormEvent } from 'react'
import { TextInput, Choice } from '../../components/form'
import { registrationText } from '../../content/inscripcion'
import { useAuth } from '../../lib/auth/context'

const t = registrationText.signIn
const button =
  'inline-flex h-12 items-center justify-center rounded-lg bg-acento px-6 text-sm font-bold tracking-wide text-acento-contraste uppercase hover:bg-acento/85 disabled:opacity-60'

/** Inicio de sesión: Google o enlace por correo (Firebase); formulario simulado en mock. */
export function SignInPanel({ allowAdmin = false }: { allowAdmin?: boolean }) {
  const auth = useAuth()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [admin, setAdmin] = useState(allowAdmin)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const run = async (action: () => Promise<void>, success?: string) => {
    setBusy(true)
    setMessage(null)
    try {
      await action()
      if (success) setMessage(success)
    } catch {
      setMessage(registrationText.genericError)
    } finally {
      setBusy(false)
    }
  }

  if (auth.mode === 'mock') {
    const submit = (e: FormEvent) => {
      e.preventDefault()
      if (name.trim() && /\S+@\S+\.\S+/.test(email)) auth.mockSignIn({ name, email, admin })
    }
    return (
      <form onSubmit={submit} className="flex flex-col gap-5 rounded-2xl border border-borde bg-superficie p-6">
        <div>
          <h2 className="text-xl font-bold">{t.mockTitle}</h2>
          <p className="mt-2 text-sm text-texto-suave">{t.mockHelp}</p>
        </div>
        <TextInput id="mockName" label={t.mockName} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        <TextInput id="mockEmail" label={t.mockEmail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <Choice label={t.mockAdmin} checked={admin} onChange={(e) => setAdmin(e.target.checked)} />
        <button type="submit" className={button}>
          {t.mockSubmit}
        </button>
      </form>
    )
  }

  if (auth.pendingEmailLink) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void run(() => auth.completeEmailLink(email))
        }}
        className="flex flex-col gap-4 rounded-2xl border border-borde bg-superficie p-6"
      >
        <TextInput id="confirmEmail" label={t.emailConfirmLabel} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" className={button} disabled={busy}>
          {t.emailConfirm}
        </button>
        {message && <p role="status">{message}</p>}
      </form>
    )
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-borde bg-superficie p-6">
      <h2 className="text-xl font-bold">{t.title}</h2>
      <button type="button" className={button} disabled={busy} onClick={() => void run(auth.signInWithGoogle)}>
        {t.google}
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void run(() => auth.sendEmailLink(email), t.emailSent)
        }}
        className="flex flex-col gap-3"
      >
        <TextInput
          id="linkEmail"
          label={t.emailLabel}
          type="email"
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <button type="submit" className={`${button} bg-transparent text-texto ring-1 ring-acento-texto hover:bg-acento-texto/10`} disabled={busy}>
          {t.emailSend}
        </button>
      </form>
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
    </div>
  )
}

/** Línea "Sesión iniciada como … · Cerrar sesión". */
export function SignedInBar() {
  const auth = useAuth()
  if (!auth.user) return null
  return (
    <p className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-texto-suave">
      <span>
        {t.signedInAs} <strong className="text-texto">{auth.user.email}</strong>
      </span>
      <button type="button" onClick={() => void auth.signOut()} className="font-bold text-acento-texto underline underline-offset-4">
        {t.signOut}
      </button>
    </p>
  )
}
