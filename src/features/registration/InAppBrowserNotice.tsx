import { useState } from 'react'
import { accessText } from '../../content/inscripcion'
import { chromeIntentUrl, registrationLink, type InAppBrowser } from '../../lib/inAppBrowser'
import { storedPreviewKey } from '../../lib/previewKey'
import { buttonClass } from '../../components/button'

const t = accessText.inApp

const action = buttonClass({ variant: 'secondary', size: 'sm' })

/** Espera máxima del portapapeles: a veces se queda pendiente sin responder (permisos, apps). */
const CLIPBOARD_WAIT_MS = 1500

/**
 * Copia el enlace. En los navegadores de apps a veces falta la API del
 * portapapeles o no responde: entonces se copia a la antigua.
 */
async function copyLink(href: string): Promise<boolean> {
  try {
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('sin respuesta')), CLIPBOARD_WAIT_MS))
    await Promise.race([navigator.clipboard.writeText(href), timeout])
    return true
  } catch {
    const field = Object.assign(document.createElement('textarea'), { value: href, readOnly: true })
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    const ok = document.execCommand('copy')
    field.remove()
    return ok
  }
}

/**
 * Aviso dentro de apps (Instagram, Facebook, LinkedIn…), donde Google no deja
 * entrar: salir al navegador (en Android, «Abrir en Chrome»; en iPhone, cómo
 * hacerlo desde el menú de la app), copiar el enlace o usar correo y contraseña.
 */
export function InAppBrowserNotice({ id, browser }: { id: string; browser: InAppBrowser }) {
  /** null: sin intentar; true: copiado; false: la app no deja copiar (se muestra el enlace para copiarlo a mano). */
  const [copied, setCopied] = useState<boolean | null>(null)
  // Enlace a la inscripción (en la portada, directo a su sección).
  const href = registrationLink(window.location.href, storedPreviewKey())

  return (
    <div id={id} role="note" className="mt-6 rounded-lg bg-error/10 p-4 text-sm leading-snug">
      <p className="font-bold">{t.title(browser.app)}</p>
      <p className="mt-1">{t.body}</p>
      {browser.platform === 'ios' && <p className="mt-2 text-texto-suave">{t.iosHint}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {browser.platform === 'android' && (
          <a href={chromeIntentUrl(href)} className={action}>
            {t.openChrome}
          </a>
        )}
        <button type="button" className={action} onClick={() => void copyLink(href).then(setCopied)}>
          {t.copy}
        </button>
      </div>
      {copied === true && (
        <p role="status" className="mt-2 font-semibold">
          {t.copied}
        </p>
      )}
      {copied === false && (
        <div role="status" className="mt-2">
          <p>{t.copyFailed}</p>
          <input
            readOnly
            value={href}
            aria-label={t.linkLabel}
            onFocus={(e) => e.currentTarget.select()}
            ref={(el) => el?.select()}
            className="mt-1 w-full rounded-md border border-borde bg-superficie px-3 py-2 text-base text-texto"
          />
        </div>
      )}
    </div>
  )
}
