import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'

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
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = section.current
    if (!el || near) return
    const observer = new IntersectionObserver(([entry]) => entry?.isIntersecting && setNear(true), { rootMargin: `${PRELOAD} 0px` })
    observer.observe(el)
    return () => observer.disconnect()
  }, [near])

  const placeholder = (
    <p role="status" className="wrap text-texto-suave">
      {site.access.loading}
    </p>
  )

  return (
    <Section id="acceso" ref={section} className="min-h-svh py-24 sm:py-32">
      {near ? <Suspense fallback={placeholder}><AccessPanel /></Suspense> : placeholder}
    </Section>
  )
}
