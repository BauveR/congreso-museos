import { Bug } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ReadingSheet } from '../../components/ReadingSheet'
import { diagnosticsText as t } from '../../content/inscripcion'
import { useAuth } from '../../lib/auth/context'
import { captureGlobalErrors, clearDiagnostics, useDiagnostics, type DiagnosticEntry } from '../../lib/diagnostics'

const label = 'text-xs font-bold tracking-widest text-texto-suave uppercase'
const action = 'inline-flex h-10 items-center rounded-full border border-borde px-4 text-xs font-bold tracking-wide uppercase hover:border-texto'

const time = (d: Date) => d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

function Entry({ entry }: { entry: DiagnosticEntry }) {
  return (
    <li className="border-t border-borde py-4 first:border-t-0 first:pt-0">
      <p className="flex flex-wrap items-baseline gap-x-3 text-sm">
        <span className="font-mono text-texto-suave tabular-nums">{time(entry.time)}</span>
        <span className="font-semibold">{entry.context}</span>
      </p>
      <p className="mt-1 text-error">{entry.message}</p>
      <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        {entry.status !== undefined && (
          <div className="flex gap-2">
            <dt className="text-texto-suave">{t.status}</dt>
            <dd className="font-mono">{entry.status || t.noConnection}</dd>
          </div>
        )}
        {entry.code && (
          <div className="flex gap-2">
            <dt className="text-texto-suave">{t.code}</dt>
            <dd className="font-mono">{entry.code}</dd>
          </div>
        )}
        {entry.ref && (
          <div className="flex gap-2" title={t.refHelp}>
            <dt className="text-texto-suave">{t.ref}</dt>
            <dd className="font-mono select-all">{entry.ref}</dd>
          </div>
        )}
      </dl>
      {entry.detail && (
        <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-superficie p-3 text-xs leading-relaxed whitespace-pre-wrap">
          {entry.detail}
        </pre>
      )}
    </li>
  )
}

/**
 * Botón flotante «Diagnóstico» para cuentas de administración: abre los
 * errores registrados en la pestaña (API, acceso, no capturados) con el
 * contexto de la sesión, y permite copiarlos como informe. El resto de
 * personas no lo ve.
 */
export function DiagnosticsButton() {
  const auth = useAuth()
  const entries = useDiagnostics()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Registrar desde el principio, aunque aún no se sepa si la cuenta es de administración.
  useEffect(captureGlobalErrors, [])

  if (!auth.isAdmin) return null

  const context = {
    [t.contextLabels.mode]: auth.mode,
    [t.contextLabels.account]: auth.user?.email ?? '—',
    [t.contextLabels.uid]: auth.user?.uid ?? '—',
    [t.contextLabels.url]: window.location.href,
    [t.contextLabels.browser]: navigator.userAgent,
  }

  const copy = () => {
    const report = JSON.stringify({ context, errors: entries }, null, 2)
    void navigator.clipboard.writeText(report).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="fixed bottom-4 left-4 z-50 inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-texto px-3 sm:pr-4 text-xs font-bold tracking-wide text-fondo uppercase shadow-xl"
      >
        <Bug aria-hidden className="size-5" />
        {/* Móvil: solo el icono, para tapar lo menos posible. */}
        <span className="max-sm:sr-only">{t.button}</span>
        {entries.length > 0 && (
          <span className="grid min-w-5 place-items-center rounded-full bg-error px-1.5 text-[0.6875rem] text-fondo tabular-nums">
            {entries.length}
          </span>
        )}
      </button>

      <ReadingSheet open={open} kicker={t.kicker} title={t.title} closeLabel={t.close} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-2">
            <button type="button" className={action} onClick={copy}>
              {copied ? t.copied : t.copy}
            </button>
            <button type="button" className={action} onClick={clearDiagnostics} disabled={!entries.length}>
              {t.clear}
            </button>
          </div>

          <section>
            <h3 className={`mb-3 ${label}`}>{t.context}</h3>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              {Object.entries(context).map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-texto-suave">{k}</dt>
                  <dd className="font-mono break-all">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h3 className={`mb-3 ${label}`}>{t.errors}</h3>
            {entries.length ? (
              <ol>
                {entries.map((entry) => (
                  <Entry key={entry.id} entry={entry} />
                ))}
              </ol>
            ) : (
              <p className="text-texto-suave">{t.empty}</p>
            )}
            <p className="mt-4 text-sm text-texto-suave">{t.refHelp}</p>
          </section>
        </div>
      </ReadingSheet>
    </>
  )
}
