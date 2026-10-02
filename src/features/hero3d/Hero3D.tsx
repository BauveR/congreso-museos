import { Environment, Lightformer } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState, type ComponentType, type Ref } from 'react'
import { usePageVisible } from '../../hooks/usePageVisible'
import { GltfModel } from './models/GltfModel'
import { PlaceholderModel } from './models/PlaceholderModel'
import type { ModelController } from './ModelController'
import type { Quality } from './quality'
import { Scene } from './Scene'
import { MODEL_URL } from './timeline.config'

const modelUrl = MODEL_URL
const Model: ComponentType<{ ref: Ref<ModelController> }> = modelUrl
  ? (props) => <GltfModel url={modelUrl} {...props} />
  : PlaceholderModel

/** Avisa cuando el modelo ha cargado y se ha pintado el primer frame. */
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(onReady))
    return () => cancelAnimationFrame(id)
  }, [onReady])
  return null
}

interface Hero3DProps {
  quality: Quality
  onReady: () => void
}

export default function Hero3D({ quality, onReady }: Hero3DProps) {
  const visible = usePageVisible()
  const [min, max] = quality.dpr
  const [dpr, setDpr] = useState(max)

  return (
    <Canvas
      // Pestaña oculta: no se renderiza nada.
      frameloop={visible ? 'demand' : 'never'}
      dpr={dpr}
      camera={{ fov: 35 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      resize={{ debounce: 200 }}
      performance={{ min: 0.5 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={2.5} />
      <directionalLight position={[-5, -1, 2]} intensity={2} color="#d1e132" />
      {quality.environment && (
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2} position={[0, 3, 2]} scale={[6, 1, 1]} />
          <Lightformer form="rect" intensity={1.5} color="#d1e132" position={[-3, 0, 1]} scale={[1, 4, 1]} />
        </Environment>
      )}
      <Suspense fallback={null}>
        <Scene
          model={Model}
          quality={quality}
          onPerformanceFactor={(f) => setDpr(Math.round((min + (max - min) * f) * 10) / 10)}
        />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
