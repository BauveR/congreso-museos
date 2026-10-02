import { useThree } from '@react-three/fiber'
import { useLayoutEffect, useMemo } from 'react'
import { MathUtils, type PerspectiveCamera } from 'three'

/** Fracción del semieje menor del viewport que ocupa el radio del objeto. */
const FILL = 0.5

export interface FitView {
  distance: number
  /** Semiancho y semialto visibles en el plano z = 0. */
  halfWidth: number
  halfHeight: number
}

/**
 * Coloca la cámara a la distancia necesaria para que un objeto de radio
 * `radius` ocupe la misma proporción de pantalla en vertical y en
 * horizontal: se ajusta al FOV del eje más estrecho.
 */
export function useFitCamera(radius: number, fill = FILL): FitView {
  const get = useThree((s) => s.get)
  const fov = (useThree((s) => s.camera) as PerspectiveCamera).fov
  const width = useThree((s) => s.size.width)
  const height = useThree((s) => s.size.height)
  const invalidate = useThree((s) => s.invalidate)

  const view = useMemo(() => {
    const aspect = width / height
    const tanV = Math.tan(MathUtils.degToRad(fov) / 2)
    const tanH = tanV * aspect
    const distance = radius / (fill * Math.min(tanV, tanH))
    return { distance, halfWidth: distance * tanH, halfHeight: distance * tanV }
  }, [fov, width, height, radius, fill])

  useLayoutEffect(() => {
    const camera = get().camera as PerspectiveCamera
    camera.position.set(0, 0, view.distance)
    camera.near = view.distance / 100
    camera.far = view.distance * 10
    camera.updateProjectionMatrix()
    invalidate()
  }, [get, view, invalidate])

  return view
}
