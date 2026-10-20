import { Check, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EVENT } from '../../../../shared/event'
import { site } from '../../../content/site'
import type { ParallelActivity } from '../../../content/types'
import { activityPath } from './openActivity'

/** Tiempo (ms) que se muestra «Enlace copiado». */
const COPIED_MS = 2500

/**
 * Compartir una actividad: en móvil (y donde exista), el menú nativo del
 * sistema (WhatsApp, correo…); si no, copia el enlace y lo confirma. El
 * enlace es siempre el del dominio público (con su propia vista previa).
 * `compact`: en móvil, solo el icono (cabecera de la tarjeta).
 */
export function ShareButton({ item, compact = false, className = '' }: { item: ParallelActivity; compact?: boolean; className?: string }) {
  const { activities } = site
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(timer)
  }, [copied])

  const share = async () => {
    const url = EVENT.url + activityPath(item.id)
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: `${item.title} · ${EVENT.name}`, url })
        return
      } catch (error) {
        // Cancelado por la persona: nada más que hacer.
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      // Sin portapapeles: abrir el enlace, desde donde se puede copiar.
      window.open(url, '_blank', 'noopener')
    }
  }

  return (
    <button
      type="button"
      onClick={() => void share()}
      className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-current/40 px-4 text-xs ${compact ? 'max-sm:w-10 max-sm:px-0' : ''} font-bold tracking-wide uppercase transition-colors hover:border-current ${className}`}
    >
      {copied ? <Check aria-hidden className="size-4" /> : <Share2 aria-hidden className="size-4" />}
      <span aria-live="polite" className={compact ? 'max-sm:sr-only' : ''}>
        {copied ? activities.copied : activities.share}
      </span>
      <span className="sr-only">: {item.title}</span>
    </button>
  )
}
