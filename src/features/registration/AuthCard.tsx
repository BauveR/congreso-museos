import { Eye, EyeOff } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { FieldShell, TextInput } from '../../components/form'
import { fieldDomId } from '../../components/formIds'
import { accessText, registrationText } from '../../content/inscripcion'
import { useAuth } from '../../lib/auth/context'
import { authErrorCode } from '../../lib/auth/types'
import { reportError } from '../../lib/diagnostics'

const t = accessText

type Mode = 'signUp' | 'signIn'

const primary =
  'inline-flex h-12 w-full items-center justify-center rounded-lg bg-acento px-6 text-sm font-bold tracking-wide text-acento-contraste uppercase hover:bg-acento/85 disabled:opacity-60'

const errorMessage = (error: unknown) => t.errors[authErrorCode(error)] ?? registrationText.genericError

/** Logo de Google (versión a color de las pautas de marca del botón). */
function GoogleLogo() {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className="size-5">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

function PasswordInput({ value, onChange, autoComplete, help }: { value: string; onChange: (v: string) => void; autoComplete: string; help?: string }) {
  const [visible, setVisible] = useState(false)
  const id = 'authPassword'
  return (
    <FieldShell id={id} label={t.password} help={help}>
      <div className="relative">
        <input
          id={fieldDomId(id)}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={6}
          autoComplete={autoComplete}
          aria-describedby={help ? `${fieldDomId(id)}-help` : undefined}
          className="w-full rounded-lg border border-borde bg-superficie py-3 pr-12 pl-4 text-texto"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t.hidePassword : t.showPassword}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-texto-suave hover:text-texto"
        >
          {visible ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}
        </button>
      </div>
    </FieldShell>
  )
}

/**
 * Acceso: Google o cuenta con correo y contraseña. Pestañas «Crear cuenta»
 * (nombre, apellidos, correo y contraseña) y «Ya tengo cuenta» (correo y
 * contraseña, con recuperación). Errores de Firebase traducidos.
 * `framed={false}`: sin tarjeta propia (la pone el contenedor).
 */
export function AuthCard({ framed = true, className = '' }: { framed?: boolean; className?: string }) {
  const auth = useAuth()
  const [mode, setMode] = useState<Mode>('signUp')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const run = async (action: () => Promise<void>) => {
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await action()
    } catch (e) {
      // Cerrar la ventana de Google no es un error que mostrar.
      if (authErrorCode(e) !== 'auth/popup-closed-by-user' && authErrorCode(e) !== 'auth/cancelled-popup-request') {
        reportError('Acceso (Google o correo)', e)
        setError(errorMessage(e))
      }
    } finally {
      setBusy(false)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    void run(() =>
      mode === 'signUp' ? auth.signUpWithPassword({ firstName, lastName, email, password }) : auth.signInWithPassword(email, password),
    )
  }

  const forgot = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(null)
      setNotice(t.forgotNeedsEmail)
      return
    }
    void run(async () => {
      await auth.resetPassword(email)
      setNotice(t.resetSent(email.trim()))
    })
  }

  const tab = (value: Mode, label: string) => (
    <button
      type="button"
      aria-pressed={mode === value}
      onClick={() => {
        setMode(value)
        setError(null)
        setNotice(null)
      }}
      className="min-h-11 flex-1 rounded-full text-sm font-bold tracking-wide uppercase aria-pressed:bg-texto aria-pressed:text-fondo"
    >
      {label}
    </button>
  )

  return (
    <div className={`${framed ? 'rounded-3xl border border-borde bg-superficie p-5 sm:p-8' : ''} ${className}`}>
      <div className="flex gap-1 rounded-full border border-borde p-1">
        {tab('signUp', t.tabs.signUp)}
        {tab('signIn', t.tabs.signIn)}
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={() => void run(auth.signInWithGoogle)}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-[#747775] bg-white px-6 text-sm font-semibold text-[#1f1f1f] hover:bg-[#f2f2f2] disabled:opacity-60"
      >
        <GoogleLogo />
        {t.google}
      </button>

      <p className="my-6 flex items-center gap-4 text-xs font-bold tracking-widest text-texto-suave uppercase before:h-px before:flex-1 before:bg-borde after:h-px after:flex-1 after:bg-borde">
        {t.or}
      </p>

      <form onSubmit={submit} className="flex flex-col gap-4">
        {mode === 'signUp' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput id="authFirstName" label={t.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoComplete="given-name" />
            <TextInput id="authLastName" label={t.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} required autoComplete="family-name" />
          </div>
        )}
        <TextInput id="authEmail" label={t.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <PasswordInput
          value={password}
          onChange={setPassword}
          autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'}
          help={mode === 'signUp' ? t.passwordHelp : undefined}
        />

        {error && (
          <p role="alert" className="text-sm font-semibold text-error">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="text-sm">
            {notice}
          </p>
        )}

        <button type="submit" className={`${primary} mt-2`} disabled={busy}>
          {mode === 'signUp' ? t.submitSignUp : t.submitSignIn}
        </button>
        {mode === 'signIn' && (
          <button type="button" onClick={forgot} className="min-h-11 self-center text-sm font-semibold text-acento-texto underline underline-offset-4">
            {t.forgot}
          </button>
        )}
      </form>

      {auth.mode === 'mock' && <p className="mt-6 text-xs text-texto-suave">{t.mockNote}</p>}
    </div>
  )
}
