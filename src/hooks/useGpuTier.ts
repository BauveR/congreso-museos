import { useEffect, useState } from 'react'

export type GpuTier = 0 | 1 | 2

export interface GpuInfo {
  tier: GpuTier
  isMobile: boolean
}

// Benchmarks de detect-gpu servidos desde nuestro propio origen (chunks de
// Vite cargados bajo demanda) en lugar del CDN por defecto.
const benchmarks = import.meta.glob<{ default: unknown }>(
  '/node_modules/detect-gpu/dist/benchmarks/*.json',
)

async function detect(): Promise<GpuInfo> {
  const { getGPUTier } = await import('detect-gpu')
  const result = await getGPUTier({
    override: {
      loadBenchmarks: async (file) => {
        const load = benchmarks[`/node_modules/detect-gpu/dist/benchmarks/${file}`]
        if (!load) throw new Error(`detect-gpu: benchmark no encontrado (${file})`)
        return (await load()).default as never
      },
    },
  })
  return { tier: Math.min(result.tier, 2) as GpuTier, isMobile: result.isMobile ?? false }
}

let pending: Promise<GpuInfo> | undefined

/**
 * Clasifica la GPU (0 = sin 3D, 1 = básica, 2 = buena). Devuelve `null`
 * mientras detecta. Si la detección falla se asume tier 1.
 */
export function useGpuTier(): GpuInfo | null {
  const [info, setInfo] = useState<GpuInfo | null>(null)

  useEffect(() => {
    let cancelled = false
    pending ??= detect().catch(() => ({ tier: 1, isMobile: false }))
    pending.then((result) => !cancelled && setInfo(result))
    return () => {
      cancelled = true
    }
  }, [])

  return info
}
