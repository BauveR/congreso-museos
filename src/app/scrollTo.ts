import type Lenis from 'lenis'

/** Instancia de Lenis activa (la registra SmoothScroll; null con reduced motion). */
let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

/**
 * Lleva el scroll a una posición (px) o a un elemento (respeta el
 * scroll-padding-top del nav) y avisa al llegar. Con Lenis, scroll suave;
 * sin él (reduced motion), salto inmediato.
 */
export function scrollToTarget(target: number | HTMLElement, onComplete?: () => void) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.2, onComplete: () => onComplete?.() })
    return
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'auto' })
  else target.scrollIntoView({ behavior: 'auto', block: 'start' })
  onComplete?.()
}
