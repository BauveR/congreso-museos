import { MathUtils } from 'three'
import type { SectionId } from '../../content/types'

export interface SectionSample {
  from: SectionId
  to: SectionId
  /** Avance entre `from` y `to` (0–1), con easing aplicado. */
  t: number
}

/**
 * Traduce el progreso (0–1) a un tramo entre dos secciones. El keyframe de
 * cada sección está en su centro: (i + 0.5) / n.
 */
export function sampleSections(progress: number, sections: readonly SectionId[]): SectionSample | null {
  const count = sections.length
  if (count === 0) return null
  const position = MathUtils.clamp(progress * count - 0.5, 0, count - 1)
  const index = Math.floor(position)
  const from = sections[index]
  const to = sections[Math.min(index + 1, count - 1)]
  if (!from || !to) return null
  return { from, to, t: MathUtils.smoothstep(position - index, 0, 1) }
}
