import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ConnectionNotice } from '../../../components/ConnectionNotice'
import { ErrorBoundary } from '../../../components/ErrorBoundary'
import { Loader } from '../../../components/Loader'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { returningFromGoogle } from '../../../lib/auth/redirectFlow'
import { SECTION_PARAM } from '../../../lib/inAppBrowser'

/** Momentos (ms) en que se baja a la sección al llegar directamente a ella. */
const SETTLE_MS = [0, 400, 1200]

/** ¿Hay que ir directamente a esta sección al cargar? */
const goHere = () => returningFromGoogle() || new URLSearchParams(window.location.search).get(SECTION_PARAM) === 'acceso'

// Auth, Firebase y el resumen llegan en un chunk aparte, al acercarse la sección.
const AccessPanel = lazy(() => import('./AccessPanel'))

/** Antelación (en alturas de pantalla) con la que se carga el panel. */
const PRELOAD = '150%'

/**
 * Acceso a la inscripción, justo después del umbral (pantalla en claro):
 * sin sesión, crear cuenta o entrar (Google o correo y contraseña); con
 * sesión, la tarjeta con el resumen de la inscripción.
 */
export function Access() {
  const section = useRef<HTMLElement>(null)
  // Llegar directo a la inscripción: al volver de Google por redirección o al abrir la web
  // desde una app con ?seccion=acceso. La página carga arriba: se carga el panel ya y se baja hasta él.
  // Se decide una vez al crear el componente (el doble montaje de StrictMode ya no ve el parámetro).
  const [arriving] = useState(goHere)
  const [near, setNear] = useState(arriving)

  useEffect(() => {
    if (!arriving) return
    const url = new URL(window.location.href)
    if (url.searchParams.has(SECTION_PARAM)) {
      url.searchParams.delete(SECTION_PARAM)
      window.history.replaceState(null, '', url)
    }
    // Lo de arriba (fuentes, imágenes, animaciones) aún se coloca y puede desplazar la sección:
    // se repite durante el primer segundo, salvo que la persona haga scroll por su cuenta.
    const go = () => section.current?.scrollIntoView({ block: 'start' })
    const timers = SETTLE_MS.map((ms) => setTimeout(go, ms))
    const stop = () => timers.forEach(clearTimeout)
    const input = ['wheel', 'touchstart', 'keydown'] as const
    input.forEach((type) => window.addEventListener(type, stop, { once: true, passive: true }))
    return () => {
      stop()
      input.forEach((type) => window.removeEventListener(type, stop))
    }
  }, [arriving])

  useEffect(() => {
    const el = section.current
    if (!el || near) return
    const observer = new IntersectionObserver(([entry]) => entry?.isIntersecting && setNear(true), { rootMargin: `${PRELOAD} 0px` })
    observer.observe(el)
    return () => observer.disconnect()
  }, [near])

  const placeholder = (
    <Loader text={site.access.loading} className="wrap" />
  )

  return (
    <Section id="acceso" ref={section} className="min-h-[calc(var(--svh)*100)] overflow-x-clip pt-10 pb-24 sm:py-32">
      {near ? (
        <ErrorBoundary fallback={<ConnectionNotice phase="error" onRetry={() => window.location.reload()} />}>
          <Suspense fallback={placeholder}>
            <AccessPanel />
          </Suspense>
        </ErrorBoundary>
      ) : (
        placeholder
      )}
    </Section>
  )
}
