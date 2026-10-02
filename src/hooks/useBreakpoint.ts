import { useMediaQuery } from './useMediaQuery'

export type Breakpoint = 'mobile' | 'desktop'

/** Coincide con el breakpoint `lg` de Tailwind (64rem). */
export function useBreakpoint(): Breakpoint {
  return useMediaQuery('(min-width: 64rem)') ? 'desktop' : 'mobile'
}
