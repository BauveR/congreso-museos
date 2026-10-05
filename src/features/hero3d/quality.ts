import type { GpuInfo } from '../../hooks/useGpuTier'

export interface Quality {
  tier: 1 | 2
  /** Rango de DPR [mín, máx]; el máximo se reduce si cae el rendimiento. */
  dpr: [number, number]
}

/** Calidad según capacidad de la GPU, no según tamaño de pantalla. */
export function qualityFor({ tier, isMobile }: GpuInfo): Quality | null {
  if (tier === 0) return null
  if (tier === 1) return { tier: 1, dpr: [1, 1] }
  const max = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
  return { tier: 2, dpr: [1, Math.max(1, max)] }
}
