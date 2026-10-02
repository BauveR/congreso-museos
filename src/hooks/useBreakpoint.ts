import { useSyncExternalStore } from 'react'

export type Breakpoint = 'mobile' | 'desktop'

/** Coincide con el breakpoint `lg` de Tailwind (64rem). */
const DESKTOP_QUERY = '(min-width: 64rem)'

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

const getSnapshot = (): Breakpoint => (window.matchMedia(DESKTOP_QUERY).matches ? 'desktop' : 'mobile')

export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, getSnapshot)
}
