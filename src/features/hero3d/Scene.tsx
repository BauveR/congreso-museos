import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState, type ComponentType, type Ref } from 'react'
import { MathUtils } from 'three'
import { usePageVisible } from '../../hooks/usePageVisible'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import type { ModelController } from './ModelController'
import { Particles } from './Particles'
import type { Quality } from './quality'
import { scrollState, subscribeScroll } from './scrollState'

/** Velocidad de la amortiguación (mayor = alcanza antes el scroll). */
const DAMPING = 4
/** Tope de delta: tras un rato sin renderizar no debe saltar de golpe. */
const MAX_DELTA = 1 / 30
const EPSILON = 1e-4

interface SceneProps {
  model: ComponentType<{ ref: Ref<ModelController> }>
  quality: Quality
  /** Factor de rendimiento (0–1) de PerformanceMonitor, solo tier 2. */
  onPerformanceFactor: (factor: number) => void
}

/**
 * Lleva el progreso de scroll al modelo con amortiguación. Solo pide frames
 * (frameloop "demand") cuando cambia el scroll o la amortiguación no ha
 * terminado. Con reduced motion salta a la pose estática de cada sección.
 */
export function Scene({ model: Model, quality, onPerformanceFactor }: SceneProps) {
  const controller = useRef<ModelController>(null)
  const particles = useRef<ModelController>(null)
  const current = useRef(scrollState.progress)
  const movingRef = useRef(false)
  const [moving, setMoving] = useState(false)
  const [factor, setFactor] = useState(1)
  const reducedMotion = useReducedMotion()
  const invalidate = useThree((s) => s.invalidate)
  const visible = usePageVisible()

  useEffect(() => subscribeScroll(invalidate), [invalidate])
  // Al volver a la pestaña (frameloop pasa de "never" a "demand") hay que pedir un frame.
  useEffect(() => invalidate(), [reducedMotion, visible, invalidate])

  useFrame((state, delta) => {
    const { sectionIndex, sections, progress } = scrollState
    const target = reducedMotion ? (sectionIndex + 0.5) / Math.max(sections.length, 1) : progress

    current.current = reducedMotion
      ? target
      : MathUtils.damp(current.current, target, DAMPING, Math.min(delta, MAX_DELTA))
    if (Math.abs(target - current.current) < EPSILON) current.current = target
    controller.current?.setProgress(current.current)
    particles.current?.setProgress(current.current)

    const isMoving = current.current !== target
    if (isMoving) {
      // Tier 1: baja la resolución mientras se mueve (AdaptiveDpr la restaura).
      if (quality.tier === 1) state.performance.regress()
      invalidate()
    }
    if (isMoving !== movingRef.current) {
      movingRef.current = isMoving
      setMoving(isMoving)
    }
  })

  return (
    <>
      {/* Con frameloop "demand" las pausas entre frames falsearían los fps:
          el monitor solo se monta mientras hay movimiento continuo. */}
      {quality.tier === 2 && moving && (
        <PerformanceMonitor
          factor={factor}
          iterations={4}
          onChange={(api) => {
            setFactor(api.factor)
            onPerformanceFactor(api.factor)
          }}
        />
      )}
      {quality.tier === 1 && <AdaptiveDpr />}
      {quality.tier === 2 && <Particles ref={particles} />}
      <Model ref={controller} />
    </>
  )
}
