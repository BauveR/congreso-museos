import { useSyncExternalStore } from 'react'
import { getTheme, subscribeTheme, type Theme } from '../app/theme'

export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, getTheme)
}
