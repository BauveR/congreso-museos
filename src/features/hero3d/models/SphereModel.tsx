import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useImperativeHandle, useMemo, useRef, type Ref } from 'react'
import { Color, MathUtils, type Group, type ShaderMaterial } from 'three'
import type { SectionId } from '../../../content/types'
import { useBreakpoint } from '../../../hooks/useBreakpoint'
import { usePageVisible } from '../../../hooks/usePageVisible'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import type { ModelController } from '../ModelController'
import { scrollState } from '../scrollState'
import { sampleSections } from '../timeline'
import { lerpPose, PULSE, SPHERE_BLUR, sectionColors, THRESHOLD_FILL, timeline } from '../timeline.config'
import { useContinuousRender } from '../useContinuousRender'
import { useFitCamera } from '../useFitCamera'

const RADIUS = 1

/**
 * Esfera de luz desenfocada: más luminosa en el centro y transparente hacia
 * la silueta (sin contorno visible), fundida con el halo. El pulso hace
 * respirar el brillo del núcleo.
 */
const sphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const sphereFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPulse;
  uniform float uEdge;
  uniform float uFalloff;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec3 n = normalize(vNormal);
    // facing = 0 en la silueta y 1 en el centro.
    float facing = max(dot(n, normalize(vView)), 0.0);
    float light = 0.75 + 0.25 * max(dot(n, normalize(vec3(0.4, 0.6, 0.7))), 0.0);
    vec3 color = uColor * light * (0.9 + (0.15 + 0.1 * uPulse) * facing);
    float alpha = pow(smoothstep(0.0, max(uEdge, 0.001), facing), uFalloff);
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`

/** Halo: plano detrás de la esfera con degradado radial (la cámara no rota). */
const haloVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const haloFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uSoftness;
  varying vec2 vUv;

  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float alpha = pow(1.0 - smoothstep(uSoftness, 1.0, d), 2.0) * uIntensity;
    if (alpha <= 0.001) discard;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`

/**
 * Esfera pulsante: posición y tamaño por sección (timeline.config), color
 * interpolado entre secciones (sectionColors) y pulso continuo a PULSE.fps.
 * Sin pulso con reduced motion o con la pestaña oculta.
 */
export function SphereModel({ ref }: { ref: Ref<ModelController> }) {
  const group = useRef<Group>(null)
  const pulseGroup = useRef<Group>(null)
  const sphereMaterial = useRef<ShaderMaterial>(null)
  const haloMaterial = useRef<ShaderMaterial>(null)
  const view = useFitCamera(RADIUS)
  const keyframes = timeline[useBreakpoint()]
  const invalidate = useThree((s) => s.invalidate)
  const reducedMotion = useReducedMotion()
  const visible = usePageVisible()

  const pulsing = !reducedMotion && visible
  useContinuousRender(PULSE.fps, pulsing)

  const fillColor = useMemo(() => new Color(THRESHOLD_FILL.color), [])
  const colors = useMemo(
    () => Object.fromEntries(Object.entries(sectionColors).map(([id, hex]) => [id, new Color(hex)])) as Record<SectionId, Color>,
    [],
  )
  const uniforms = useMemo(
    () => ({
      sphere: {
        uColor: { value: new Color() },
        uPulse: { value: 0.5 },
        uEdge: { value: SPHERE_BLUR.edge },
        uFalloff: { value: SPHERE_BLUR.falloff },
      },
      halo: {
        uColor: { value: new Color() },
        uIntensity: { value: SPHERE_BLUR.haloIntensity },
        uSoftness: { value: SPHERE_BLUR.haloSoftness },
      },
    }),
    [],
  )

  useImperativeHandle(
    ref,
    () => ({
      setProgress(progress) {
        const g = group.current
        if (!g) return
        const sample = sampleSections(progress, scrollState.sections)
        const pose = sample
          ? lerpPose(keyframes[sample.from], keyframes[sample.to], sample.t)
          : keyframes[scrollState.section]
        // Umbral: hacia el centro, más grande, más opaca y del color claro.
        const fill = scrollState.fill
        const lerp = MathUtils.lerp
        g.position.set(lerp(pose.x, 0, fill) * view.halfWidth, lerp(pose.y, 0, fill) * view.halfHeight, 0)
        g.scale.setScalar(lerp(pose.scale, THRESHOLD_FILL.scale, fill))
        uniforms.sphere.uEdge.value = lerp(SPHERE_BLUR.edge, THRESHOLD_FILL.edge, fill)
        uniforms.sphere.uFalloff.value = lerp(SPHERE_BLUR.falloff, THRESHOLD_FILL.falloff, fill)

        const color = uniforms.sphere.uColor.value
        if (sample) color.lerpColors(colors[sample.from], colors[sample.to], sample.t)
        else color.copy(colors[scrollState.section])
        color.lerp(fillColor, fill)
        uniforms.halo.uColor.value.copy(color)
      },
    }),
    [keyframes, view, colors, fillColor, uniforms],
  )

  // Con la esfera activa, ella hace la transición del umbral (sin el velo CSS).
  useEffect(() => {
    document.documentElement.dataset.sphere = ''
    return () => void delete document.documentElement.dataset.sphere
  }, [])

  // Al cambiar de breakpoint o de tamaño hay que recolocar el modelo.
  useEffect(() => invalidate(), [keyframes, view, invalidate])

  // El pulso se aplica vía refs (los uniforms del material son los de `uniforms`).
  useFrame(({ clock }) => {
    const wave = pulsing ? Math.sin((clock.elapsedTime / PULSE.period) * Math.PI * 2) : 0
    pulseGroup.current?.scale.setScalar(1 + PULSE.amplitude * wave)
    if (sphereMaterial.current) sphereMaterial.current.uniforms.uPulse!.value = 0.5 + 0.5 * wave
    if (haloMaterial.current) haloMaterial.current.uniforms.uIntensity!.value = SPHERE_BLUR.haloIntensity * (1 + 0.3 * wave)
  })

  return (
    <group ref={group}>
      <group ref={pulseGroup}>
        <mesh position-z={-RADIUS}>
          <planeGeometry args={[RADIUS * SPHERE_BLUR.haloSize, RADIUS * SPHERE_BLUR.haloSize]} />
          <shaderMaterial
            ref={haloMaterial}
            uniforms={uniforms.halo}
            vertexShader={haloVertex}
            fragmentShader={haloFragment}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[RADIUS, 64, 64]} />
          <shaderMaterial
            ref={sphereMaterial}
            uniforms={uniforms.sphere}
            vertexShader={sphereVertex}
            fragmentShader={sphereFragment}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}
