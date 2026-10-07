import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { loadMotion } from '../../../app/motion'
import { DisplayHeading } from '../../../components/DisplayHeading'
import { registrationText } from '../../../content/inscripcion'
import { site } from '../../../content/site'
import { AuthProvider } from '../../../lib/auth/AuthProvider'
import { useAuth } from '../../../lib/auth/context'
import { AuthCard } from '../../registration/AuthCard'
import { RegistrationFlow, type RegistrationViewKind } from '../../registration/RegistrationFlow'

/** Duración (s) del cambio de altura de la tarjeta. */
const MORPH = 0.6

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Una sola tarjeta que se transforma, sin salir de la página: acceso (crear
 * cuenta / entrar) → formulario de inscripción → resumen (modificar o
 * cancelar). Sin sesión: texto a la izquierda y la tarjeta de acceso a la
 * derecha. Con sesión: la tarjeta se despliega a ancho completo (edge) con
 * el formulario. Al cambiar de contenido anima su altura desde la anterior
 * y el contenido nuevo aparece con un fundido.
 */
function AccessFlow() {
  const auth = useAuth()
  const { access } = site
  const card = useRef<HTMLDivElement>(null)
  const lastHeight = useRef(0)
  const [kind, setKind] = useState<RegistrationViewKind>('loading')

  const step = auth.loading ? 'loading' : auth.user ? kind : 'signedOut'
  const onViewChange = useCallback((k: RegistrationViewKind) => setKind(k), [])

  // Altura vigente de la tarjeta (el ResizeObserver avisa después del layout:
  // en el useLayoutEffect de un cambio de paso aún guarda la anterior).
  useEffect(() => {
    const el = card.current
    if (!el) return
    const observer = new ResizeObserver(() => void (lastHeight.current = el.offsetHeight))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const el = card.current
    const from = lastHeight.current
    const refresh = () => void loadMotion().then(({ ScrollTrigger }) => ScrollTrigger.refresh())
    if (!el || !from || reducedMotion()) return refresh()
    void loadMotion().then(({ gsap }) => {
      gsap.fromTo(el, { height: from, overflow: 'hidden' }, { height: 'auto', duration: MORPH, ease: 'power2.inOut', clearProps: 'height,overflow', onComplete: refresh })
    })
  }, [step])

  /** Tras guardar: el resultado arriba de la tarjeta. */
  const onSaved = useCallback(() => {
    card.current?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }, [])

  const signedIn = Boolean(auth.user)

  return (
    // La tarjeta es siempre el mismo elemento: solo cambia el contenedor.
    <div className={signedIn ? 'edge' : 'wrap grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16'}>
      {!signedIn && (
        <header className="lg:pt-6">
          <DisplayHeading>{access.title}</DisplayHeading>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-pretty">{access.intro}</p>
        </header>
      )}

      <div
        ref={card}
        className={`w-full rounded-3xl border border-borde bg-superficie p-5 sm:p-8 ${signedIn ? 'lg:p-12' : 'max-w-xl lg:justify-self-end'}`}
      >
        <div key={signedIn ? 'flow' : 'access'} className="animate-fade-in motion-reduce:animate-none">
          {auth.loading && (
            <p role="status" className="text-texto-suave">
              {access.loading}
            </p>
          )}
          {!auth.loading && !auth.user && <AuthCard framed={false} />}
          {auth.user && (
            <div className="mx-auto max-w-5xl">
              <p className="mb-8 flex flex-wrap items-center gap-x-3 border-b border-borde pb-6 text-sm text-texto-suave">
                <span>
                  {registrationText.signIn.signedInAs} <strong className="text-texto">{auth.user.email}</strong>
                </span>
                <button type="button" onClick={() => void auth.signOut()} className="min-h-11 font-bold text-acento-texto underline underline-offset-4">
                  {registrationText.signIn.signOut}
                </button>
              </p>
              <RegistrationFlow key={auth.user.uid} onSaved={onSaved} onViewChange={onViewChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AccessPanel() {
  return (
    <AuthProvider>
      <AccessFlow />
    </AuthProvider>
  )
}
