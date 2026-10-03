import { useThree } from '@react-three/fiber'
import { useImperativeHandle, useMemo, useRef, type Ref } from 'react'
import { BufferAttribute, BufferGeometry, MathUtils, type Group, type PerspectiveCamera, type PointsMaterial } from 'three'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useTheme } from '../../hooks/useTheme'
import type { ModelController } from './ModelController'

const COUNT = { mobile: 250, desktop: 600 } as const
/** Recorrido vertical del campo a lo largo de toda la página (en alturas visibles). */
const TRAVEL = 2

/** Generador pseudoaleatorio con semilla: el mismo campo en cada carga. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Campo de partículas con parallax vertical ligado al scroll (solo tier 2).
 * Las posiciones son normalizadas (-1…1) y el grupo se escala al área visible
 * de la cámara, así ocupa la pantalla en cualquier viewport.
 */
export function Particles({ ref }: { ref: Ref<ModelController> }) {
  const group = useRef<Group>(null)
  const material = useRef<PointsMaterial>(null)
  const count = COUNT[useBreakpoint()]
  const theme = useTheme()
  const get = useThree((s) => s.get)

  const geometry = useMemo(() => {
    const random = mulberry32(42)
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = random() * 2 - 1
      positions[i + 1] = (random() * 2 - 1) * (1 + TRAVEL)
      positions[i + 2] = random() * 2 - 1
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(positions, 3))
    return g
  }, [count])

  useImperativeHandle(
    ref,
    () => ({
      setProgress(progress) {
        const g = group.current
        if (!g) return
        const { camera, size } = get()
        const distance = camera.position.z
        const halfHeight = distance * Math.tan(MathUtils.degToRad((camera as PerspectiveCamera).fov) / 2)
        const halfWidth = halfHeight * (size.width / size.height)
        g.scale.set(halfWidth * 1.2, halfHeight, distance * 0.6)
        g.position.y = (progress - 0.5) * TRAVEL * 2 * halfHeight
        if (material.current) material.current.size = distance * 0.004
      },
    }),
    [get],
  )

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <pointsMaterial
          ref={material}
          color={theme === 'light' ? '#4a4f45' : '#d1e132'}
          transparent
          opacity={0.5}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}
