import { ArrowDown, ArrowRight, Check, Circle, Eye, EyeOff } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { checkPassword, PASSWORD_MIN, passwordOk, type PasswordChecks } from '../../../shared/password'
import { FieldShell, TextInput } from '../../components/form'
import { fieldDomId } from '../../components/formIds'
import { accessText, registrationText } from '../../content/inscripcion'
import { useAuth } from '../../lib/auth/context'
import { authErrorCode } from '../../lib/auth/types'
import { reportConnectivity } from '../../lib/connectivity'
import { reportError } from '../../lib/diagnostics'

const t = accessText

type Mode = 'signUp' | 'signIn'

/** Llamadas a crear cuenta con correo (en el rojo del sitio, para que destaquen). */
const institutional =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-error px-5 py-2 text-center text-sm font-bold text-error hover:bg-error/10'

const primary =
  'inline-flex h-12 w-full items-center justify-center rounded-lg bg-acento px-6 text-sm font-bold tracking-wide text-acento-contraste uppercase hover:bg-acento/85 disabled:opacity-60'

/** Navegadores integrados en apps (redes sociales, mensajería): Google no deja iniciar sesión en ellos. */
const IN_APP_BROWSER = /FBAN|FBAV|FB_IAB|Instagram|LinkedInApp|Line\/|Twitter|TikTok|Snapchat|Pinterest/i
const inAppBrowser = () => typeof navigator !== 'undefined' && IN_APP_BROWSER.test(navigator.userAgent)

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

interface PasswordInputProps {
  value: string
  onChange: (v: string) => void
  autoComplete: string
  /** Solo al crear la cuenta; al entrar, cualquier longitud (contraseñas anteriores de 6–7). */
  minLength?: number
  /** id de la lista de comprobación que describe el campo. */
  describedBy?: string
}

function PasswordInput({ value, onChange, autoComplete, minLength, describedBy }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const id = 'authPassword'
  return (
    <FieldShell id={id} label={t.password}>
      <div className="relative">
        <input
          id={fieldDomId(id)}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          aria-describedby={describedBy}
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

/** Aviso con los requisitos de la contraseña nueva, visible desde el principio y marcado en vivo al escribir. */
function PasswordRules({ id, checks, touched }: { id: string; checks: PasswordChecks; touched: boolean }) {
  const rules = [
    [checks.length, t.passwordRules.length],
    [checks.notCommon, t.passwordRules.notCommon],
    [checks.notPersonal, t.passwordRules.notPersonal],
  ] as const
  return (
    <div id={id} className={`-mt-1 rounded-lg border p-3 text-sm ${touched && !passwordOk(checks) ? 'border-error' : 'border-borde'}`}>
      <p className="mb-2 font-bold">{t.passwordRules.title}</p>
      <ul className="flex flex-col gap-1">
        {rules.map(([ok, label]) => (
          <li key={label} className={`flex items-center gap-2 ${ok ? 'text-texto' : touched ? 'text-error' : 'text-texto-suave'}`}>
            {ok ? <Check aria-hidden className="size-4 shrink-0 text-acento-texto" /> : <Circle aria-hidden className="size-3.5 shrink-0" />}
            <span>
              {label}
              <span className="sr-only">{ok ? ': sí' : ': todavía no'}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
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
  /** Google falló o se cerró su ventana: se ofrece crear la cuenta con correo. */
  const [googleHelp, setGoogleHelp] = useState(false)
  /** Se intentó crear la cuenta con una contraseña que no cumple: los requisitos pendientes, en rojo. */
  const [passwordTouched, setPasswordTouched] = useState(false)
  const checks = checkPassword(password, { email, firstName, lastName })

  const run = async (action: () => Promise<void>, { google = false } = {}) => {
    setBusy(true)
    setError(null)
    setNotice(null)
    setGoogleHelp(false)
    try {
      await action()
    } catch (e) {
      if (google) setGoogleHelp(true)
      // Red que bloquea el acceso (Google o Firebase): contador anónimo para el panel.
      if (authErrorCode(e) === 'auth/network-request-failed') reportConnectivity('auth-network')
      // Cerrar la ventana de Google no es un error que mostrar (basta la ayuda).
      if (authErrorCode(e) !== 'auth/popup-closed-by-user' && authErrorCode(e) !== 'auth/cancelled-popup-request') {
        reportError('Acceso (Google o correo)', e)
        setError(errorMessage(e))
      }
    } finally {
      setBusy(false)
    }
  }

  const changeMode = (value: Mode) => {
    setMode(value)
    setError(null)
    setNotice(null)
  }

  /** Ir a «Crear cuenta» con el cursor en Nombre. */
  const toSignUp = () => {
    changeMode('signUp')
    setGoogleHelp(false)
    requestAnimationFrame(() => document.getElementById(fieldDomId('authFirstName'))?.focus())
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    // Al crear la cuenta, las reglas de la contraseña antes de llamar a Firebase.
    if (mode === 'signUp' && !passwordOk(checks)) {
      setPasswordTouched(true)
      setNotice(null)
      setError(t.passwordInvalid)
      document.getElementById(fieldDomId('authPassword'))?.focus()
      return
    }
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
      onClick={() => changeMode(value)}
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

      {inAppBrowser() && (
        <p role="note" className="mt-6 flex items-start gap-3 rounded-lg bg-error/10 p-3 text-sm leading-snug">
          <ArrowDown aria-hidden className="mt-0.5 size-5 shrink-0 text-error" />
          {t.inAppBrowser}
        </p>
      )}

      <button
        type="button"
        disabled={busy}
        onClick={() => void run(auth.signInWithGoogle, { google: true })}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-[#747775] bg-white px-6 text-sm font-semibold text-[#1f1f1f] hover:bg-[#f2f2f2] disabled:opacity-60"
      >
        <GoogleLogo />
        {t.google}
      </button>

      {googleHelp && (
        <div role="status" className="mt-4 rounded-2xl border-2 border-error p-4">
          <p className="font-bold">{t.googleHelpTitle}</p>
          <p className="mt-1 text-sm text-texto-suave">{t.googleHelpBody}</p>
          <button type="button" onClick={toSignUp} className={`${institutional} mt-3`}>
            {t.googleHelpButton}
            <ArrowRight aria-hidden className="size-4 shrink-0" />
          </button>
        </div>
      )}

      {mode === 'signIn' && !googleHelp && (
        <button type="button" onClick={toSignUp} className={`${institutional} mt-4`}>
          {t.institutionalCta}
          <ArrowRight aria-hidden className="size-4 shrink-0" />
        </button>
      )}

      <p className="my-6 flex items-center gap-4 text-xs font-bold tracking-widest text-texto-suave uppercase before:h-px before:flex-1 before:bg-borde after:h-px after:flex-1 after:bg-borde">
        {t.or}
      </p>

      {mode === 'signUp' && (
        <p className="-mt-2 mb-5 flex items-start gap-3 rounded-lg bg-error/10 p-3 text-sm leading-snug">
          <ArrowDown aria-hidden className="mt-0.5 size-5 shrink-0 animate-bounce text-error motion-reduce:animate-none" />
          {t.signUpHint}
        </p>
      )}

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
          minLength={mode === 'signUp' ? PASSWORD_MIN : undefined}
          describedBy={mode === 'signUp' ? 'authPasswordRules' : undefined}
        />
        {mode === 'signUp' && <PasswordRules id="authPasswordRules" checks={checks} touched={passwordTouched} />}

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
