import { Center } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useImperativeHandle, useRef, type Ref } from 'react'
import type { Group } from 'three'
import { useBreakpoint } from '../../../hooks/useBreakpoint'
import type { ModelController } from '../ModelController'
import { scrollState } from '../scrollState'
import { sampleSections } from '../timeline'
import { lerpPose, timeline } from '../timeline.config'
import { useFitCamera } from '../useFitCamera'

const RADIUS = 1

/** Geometría procedural animada por los keyframes de timeline.config. */
export function PlaceholderModel({ ref }: { ref: Ref<ModelController> }) {
  const group = useRef<Group>(null)
  const view = useFitCamera(RADIUS)
  const keyframes = timeline[useBreakpoint()]
  const invalidate = useThree((s) => s.invalidate)

  useImperativeHandle(
    ref,
    () => ({
      setProgress(progress) {
        const g = group.current
        const sample = sampleSections(progress, scrollState.sections)
        if (!g) return
        const pose = sample
          ? lerpPose(keyframes[sample.from], keyframes[sample.to], sample.t)
          : keyframes[scrollState.section]
        g.position.set(pose.x * view.halfWidth, pose.y * view.halfHeight, 0)
        g.rotation.set(pose.rotX, pose.rotY, pose.rotZ)
        g.scale.setScalar(pose.scale)
      },
    }),
    [keyframes, view],
  )

  // Al cambiar de breakpoint o de tamaño hay que recolocar el modelo.
  useEffect(() => invalidate(), [keyframes, view, invalidate])

  return (
    <group ref={group}>
      <Center>
        <mesh>
          <icosahedronGeometry args={[RADIUS, 0]} />
          <meshPhysicalMaterial
            color="#6b7262"
            metalness={0.2}
            roughness={0.35}
            clearcoat={1}
            clearcoatRoughness={0.1}
            flatShading
          />
        </mesh>
      </Center>
    </group>
  )
}
