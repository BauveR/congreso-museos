import { connectionText as t, legal } from '../content/inscripcion'
import type { LoadPhase } from '../lib/connectivity'
import { buttonClass } from './button'
import { Loader } from './Loader'

const CONTACT_EMAIL = /^[^\s@[\]]+@[^\s@]+\.[^\s@]+$/

/**
 * Aviso progresivo de carga: «cargando» → «está tardando» → «no hemos podido
 * conectar» con «Reintentar» y el correo de contacto. Nunca una pantalla en
 * blanco o un «cargando» eterno.
 */
export function ConnectionNotice({ phase, onRetry, loadingText = t.loading }: { phase: LoadPhase; onRetry: () => void; loadingText?: string }) {
  if (phase === 'loading') {
    return <Loader text={loadingText} />
  }

  const error = phase === 'error'
  return (
    <div role={error ? 'alert' : 'status'} className={`rounded-2xl border p-5 ${error ? 'border-error' : 'border-borde'}`}>
      <p className="font-bold">{error ? t.errorTitle : t.slowTitle}</p>
      <p className="mt-1 text-sm text-pretty text-texto-suave">{error ? t.errorBody : t.slowBody}</p>
      {error && (
        <>
          <button
            type="button"
            onClick={onRetry}
            className={`mt-4 ${buttonClass({ size: 'sm' })}`}
          >
            {t.retry}
          </button>
          {/* Solo con un correo real (mientras sea el marcador pendiente, no se muestra). */}
          {CONTACT_EMAIL.test(legal.contactEmail) && (
            <p className="mt-4 text-sm text-texto-suave">
              <a href={`mailto:${legal.contactEmail}`} className="underline underline-offset-4">
                {t.contact(legal.contactEmail)}
              </a>
            </p>
          )}
        </>
      )}
    </div>
  )
}
