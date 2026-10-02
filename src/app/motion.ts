import { useEffect, type DependencyList } from 'react'

export type Motion = typeof import('./gsap')
type Context = ReturnType<Motion['gsap']['context']>

let pending: Promise<Motion> | undefined

/**
 * Carga GSAP + plugins en un chunk aparte para que no cuenten en el JS
 * inicial. Al terminar quita `motion-pending` (ver index.html), que oculta
 * los textos con revelado para evitar el parpadeo.
 */
export function loadMotion(): Promise<Motion> {
  const ready = () =>
    requestAnimationFrame(() => document.documentElement.classList.remove('motion-pending'))
  pending ??= import('./gsap').then(
    (m) => {
      ready()
      return m
    },
    (error: unknown) => {
      ready()
      throw error
    },
  )
  return pending
}

/**
 * useEffect que espera a GSAP y ejecuta `setup` dentro de un gsap.context:
 * en el cleanup se revierten tweens, ScrollTriggers y SplitTexts, y se
 * llama a la función de limpieza que devuelva `setup`.
 */
export function useMotionEffect(
  setup: (m: Motion) => void | (() => void),
  deps: DependencyList,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return
    let ctx: Context | undefined
    let cancelled = false
    loadMotion().then((m) => {
      if (!cancelled) ctx = m.gsap.context(() => setup(m))
    })
    return () => {
      cancelled = true
      ctx?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled])
}
