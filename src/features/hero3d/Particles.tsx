import { useThree } from '@react-three/fiber'
import { useEffect, useImperativeHandle, useMemo, useRef, type Ref } from 'react'
import { BufferAttribute, BufferGeometry, Color, MathUtils, type Group, type PerspectiveCamera } from 'three'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { useTheme } from '../../hooks/useTheme'
import { PARTICLE_COLOR, PARTICLE_DEPTH_FADE } from './atmosphere'
import type { ModelController } from './ModelController'

const COUNT = { mobile: 250, desktop: 600 } as const
/** Recorrido vertical del campo a lo largo de toda la página (en alturas visibles). */
const TRAVEL = 2
/** Tamaño de un punto enfocado, relativo a la distancia de cámara. */
const SIZE = 0.004
/** Multiplicador de tamaño de un punto totalmente desenfocado. */
const MAX_BLUR = 9
/** Opacidad relativa de un punto totalmente desenfocado (más alto = bokeh más visible). */
const BLUR_OPACITY = 0.3
/** Distancia al plano de foco (relativa a la de cámara) para desenfoque máximo. */
const BLUR_RANGE = 0.5

/** Generador pseudoaleatorio con semilla: el mismo campo en cada carga. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/*
 * Bokeh: el plano de foco está a la distancia del objeto. Fuera de foco, el
 * punto crece, se suaviza y pierde opacidad (el brillo total se mantiene).
 * Las más lejanas se apagan con la profundidad (misma fórmula que FogExp2).
 */
const vertexShader = /* glsl */ `
  uniform float uSize;
  uniform float uScale;
  uniform float uFocus;
  uniform float uRange;
  uniform float uMaxBlur;
  uniform float uDepthFade;
  uniform float uBlurOpacity;
  attribute float aSeed;
  varying float vBlur;
  varying float vAlpha;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float depth = -mv.z;
    vBlur = clamp(abs(depth - uFocus) / uRange, 0.0, 1.0);
    float fade = 1.0 - exp(-pow(uDepthFade * depth, 2.0));
    vAlpha = mix(1.0, uBlurOpacity, vBlur) * (1.0 - fade * 0.8) * (0.5 + 0.5 * aSeed);
    gl_PointSize = uSize * (1.0 + vBlur * (uMaxBlur - 1.0)) * uScale / depth;
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vBlur;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = 1.0 - smoothstep(mix(0.3, 0.0, vBlur), 0.5, d);
    if (alpha <= 0.0) discard;
    gl_FragColor = vec4(uColor, alpha * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`

/**
 * Campo de partículas con parallax vertical ligado al scroll y desenfoque por
 * profundidad (solo tier 2). Posiciones normalizadas (-1…1); el grupo se
 * escala al área visible de la cámara, así ocupa la pantalla en cualquier viewport.
 */
export function Particles({ ref }: { ref: Ref<ModelController> }) {
  const group = useRef<Group>(null)
  const count = COUNT[useBreakpoint()]
  const theme = useTheme()
  const get = useThree((s) => s.get)
  const invalidate = useThree((s) => s.invalidate)

  const geometry = useMemo(() => {
    const random = mulberry32(42)
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = random() * 2 - 1
      positions[i * 3 + 1] = (random() * 2 - 1) * (1 + TRAVEL)
      positions[i * 3 + 2] = random() * 2 - 1
      seeds[i] = random()
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(positions, 3))
    g.setAttribute('aSeed', new BufferAttribute(seeds, 1))
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uSize: { value: 0 },
      uScale: { value: 1 },
      uFocus: { value: 1 },
      uRange: { value: 1 },
      uMaxBlur: { value: MAX_BLUR },
      uBlurOpacity: { value: BLUR_OPACITY },
      uDepthFade: { value: 0 },
      uColor: { value: new Color() },
      uOpacity: { value: 0.6 },
    }),
    [],
  )

  useEffect(() => {
    uniforms.uColor.value.set(PARTICLE_COLOR[theme])
    invalidate()
  }, [theme, uniforms, invalidate])

  useImperativeHandle(
    ref,
    () => ({
      setProgress(progress) {
        const g = group.current
        if (!g) return
        const { camera, size, viewport } = get()
        const distance = camera.position.z
        const halfHeight = distance * Math.tan(MathUtils.degToRad((camera as PerspectiveCamera).fov) / 2)
        const halfWidth = halfHeight * (size.width / size.height)
        g.scale.set(halfWidth * 1.2, halfHeight, distance * 0.6)
        g.position.y = (progress - 0.5) * TRAVEL * 2 * halfHeight

        uniforms.uSize.value = distance * SIZE
        uniforms.uScale.value = (size.height * viewport.dpr) / 2
        uniforms.uFocus.value = distance
        uniforms.uRange.value = distance * BLUR_RANGE
        uniforms.uDepthFade.value = PARTICLE_DEPTH_FADE / distance
      },
    }),
    [get, uniforms],
  )

  return (
    <group ref={group}>
      <points geometry={geometry}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  )
}
