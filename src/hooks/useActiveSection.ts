import { useSyncExternalStore } from 'react'
import type { SectionId } from '../content/types'
import { scrollState, subscribeScroll } from '../features/hero3d/scrollState'

/** Sección activa. Solo re-renderiza cuando cambia de sección, no en cada scroll. */
export function useActiveSection(): SectionId {
  return useSyncExternalStore(subscribeScroll, () => scrollState.section)
}
