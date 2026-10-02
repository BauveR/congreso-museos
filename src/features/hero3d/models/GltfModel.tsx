import { Center, useGLTF } from '@react-three/drei'
import { useEffect, useImperativeHandle, useMemo, type Ref } from 'react'
import { AnimationMixer, Box3, MathUtils, Sphere } from 'three'
import type { SectionId } from '../../../content/types'
import type { ModelController } from '../ModelController'
import { scrollState } from '../scrollState'
import { sampleSections } from '../timeline'
import { useFitCamera } from '../useFitCamera'

/** Tiempo del clip (s) en el que debe estar cada sección. */
type SectionTimes = Partial<Record<SectionId, number>>

/** Lee `extras.sections` del glTF (llega como scene.userData.sections). */
function readSectionTimes(userData: Record<string, unknown>): SectionTimes | null {
  const sections = userData.sections
  if (!sections || typeof sections !== 'object') return null
  const entries = Object.entries(sections).filter(([, v]) => typeof v === 'number')
  return entries.length > 0 ? (Object.fromEntries(entries) as SectionTimes) : null
}

interface GltfModelProps {
  url: string
  ref: Ref<ModelController>
}

/**
 * Carga un GLB y mapea el progreso al tiempo de su primer clip (acción
 * pausada + action.time). Si el glTF trae un mapa de secciones en extras,
 * se interpola entre los tiempos de cada sección; si no, es lineal.
 */
export function GltfModel({ url, ref }: GltfModelProps) {
  const { scene, animations } = useGLTF(url)
  const radius = useMemo(() => new Box3().setFromObject(scene).getBoundingSphere(new Sphere()).radius, [scene])
  useFitCamera(radius || 1)

  const mixer = useMemo(() => new AnimationMixer(scene), [scene])
  const clip = animations[0]
  const action = useMemo(() => {
    if (!clip) return null
    const a = mixer.clipAction(clip)
    a.play()
    a.paused = true
    return a
  }, [mixer, clip])
  const sectionTimes = useMemo(() => readSectionTimes(scene.userData), [scene])

  useEffect(() => () => void mixer.stopAllAction(), [mixer])

  useImperativeHandle(
    ref,
    () => ({
      setProgress(progress) {
        if (!action || !clip) return
        const sample = sectionTimes ? sampleSections(progress, scrollState.sections) : null
        const from = sample ? sectionTimes?.[sample.from] : undefined
        const to = sample ? sectionTimes?.[sample.to] : undefined
        action.time =
          sample && from !== undefined && to !== undefined
            ? MathUtils.lerp(from, to, sample.t)
            : progress * clip.duration
        mixer.update(0)
      },
    }),
    [action, clip, mixer, sectionTimes],
  )

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}
