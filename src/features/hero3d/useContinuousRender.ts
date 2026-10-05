import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

/**
 * Pide frames a ritmo fijo (`fps`) mientras `enabled`. Complementa el
 * frameloop "demand": el scroll sigue pidiendo frames a 60 fps cuando hay
 * movimiento; esto solo mantiene vivas las animaciones propias (el pulso).
 */
export function useContinuousRender(fps: number, enabled: boolean) {
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    if (!enabled) return
    const interval = 1000 / fps
    let last = 0
    let id = 0
    const loop = (time: number) => {
      // Margen de 2 ms para no saltarse frames por el redondeo del vsync.
      if (time - last >= interval - 2) {
        last = time
        invalidate()
      }
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [fps, enabled, invalidate])
}
