import { useEffect } from 'react'
import { EVENT } from '../../shared/event'

/** Título de la portada (y sufijo del resto de páginas). */
export const SITE_TITLE = EVENT.name

/**
 * Título de la pestaña y dirección canónica de cada página (la web es una
 * sola página HTML: sin esto, todas compartirían título y Google no sabría
 * cuál es la dirección buena). La canónica es siempre la del dominio
 * público, también desde vistas previas. `noindex` para páginas privadas.
 */
export function usePageMeta(title?: string, { noindex = false }: { noindex?: boolean } = {}) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_TITLE}` : SITE_TITLE
    setHeadTag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' })).setAttribute(
      'href',
      EVENT.url + window.location.pathname,
    )
    const robots = document.head.querySelector('meta[name="robots"]')
    if (noindex) setHeadTag('meta[name="robots"]', () => Object.assign(document.createElement('meta'), { name: 'robots' })).setAttribute('content', 'noindex')
    else robots?.remove()
  }, [title, noindex])
}

function setHeadTag(selector: string, create: () => HTMLElement): HTMLElement {
  const existing = document.head.querySelector<HTMLElement>(selector)
  if (existing) return existing
  const tag = create()
  document.head.append(tag)
  return tag
}
