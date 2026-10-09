import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { registrationText } from '../content/inscripcion'
import { site } from '../content/site'
import { SiteLogo } from './SiteLogo'

/** Marco de las páginas interiores (inscripción, administración, legal). */
export function PageShell({ title, wide = false, children }: { title: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className="min-h-svh">
      <header className="border-b border-borde">
        <div className="edge flex h-16 items-center justify-between">
          <Link
            to="/"
            aria-label={site.nav.logo.label}
            className="block"
          >
            <SiteLogo />
          </Link>
          <Link to="/" className="text-sm font-bold tracking-wide uppercase hover:text-acento-texto">
            {registrationText.backHome}
          </Link>
        </div>
      </header>
      <main id="main" className={`wrap py-12 sm:py-16 ${wide ? '' : 'max-w-3xl'}`}>
        <h1 className="mb-8 text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
        {children}
      </main>
    </div>
  )
}
