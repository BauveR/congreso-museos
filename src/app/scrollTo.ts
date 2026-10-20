import type Lenis from 'lenis'

/** Instancia de Lenis activa (la registra SmoothScroll; null con reduced motion). */
let lenis: Lenis | null = null

export function setLenis(instance: Lenis | null) {
  lenis = instance
}

/** Posición (px) que deja el inicio del elemento justo bajo el nav (scroll-padding-top) y `offset` más abajo. */
const topOf = (el: HTMLElement, offset = 0) => {
  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
  return Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - pad - offset))
}

const jump = (y: number) => {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
  else window.scrollTo({ top: y, behavior: 'auto' })
}

/**
 * Lleva el scroll a una posición (px) o al inicio de un elemento (bajo el
 * nav) y avisa al llegar. Con Lenis, scroll suave; sin él (reduced motion),
 * salto inmediato. Con un elemento, al llegar se corrige si algo cambió de
 * alto por el camino (p. ej. un desplegable que se pliega más arriba).
 * `offset`: margen extra bajo el nav (p. ej. una barra fija de la sección).
 */
export function scrollToTarget(target: number | HTMLElement, onComplete?: () => void, offset = 0) {
  const y = typeof target === 'number' ? target : topOf(target, offset)
  const settle = () => {
    if (typeof target !== 'number') {
      const fixed = topOf(target, offset)
      if (Math.abs(fixed - window.scrollY) > 2) jump(fixed)
    }
    onComplete?.()
  }
  if (lenis) lenis.scrollTo(y, { duration: 1.2, onComplete: settle })
  else {
    jump(y)
    settle()
  }
}
