import { lazy, Suspense, useCallback, useState } from 'react'
import { site } from '../../content/site'
import { useGpuTier } from '../../hooks/useGpuTier'
import { Haze } from '../atmosphere/Haze'
import { useTheme } from '../../hooks/useTheme'
import { Preloader } from './Preloader'
import { qualityFor } from './quality'

// three.js, r3f y drei llegan en chunks aparte, después del contenido.
const Hero3D = lazy(() => import('./Hero3D'))

/**
 * Capa fija detrás del contenido. El póster se pinta siempre (es el LCP y
 * el fallback de tier 0); el canvas aparece con un fundido cuando está listo.
 * Altura 100lvh: no salta al ocultarse la barra del navegador móvil.
 */
export function Background() {
  const { poster } = site.hero
  const gpu = useGpuTier()
  const theme = useTheme()
  const quality = gpu && qualityFor(gpu)
  const [ready, setReady] = useState(false)
  // El póster es oscuro: en tema claro se oculta (también en tier 0).
  const showPoster = !ready && theme === 'dark'
  const [progress, setProgress] = useState<number | null>(null)
  const onReady = useCallback(() => setReady(true), [])

  const fade = 'absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none'

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh">
        <img
          src={poster.src}
          alt={poster.alt}
          width={poster.width}
          height={poster.height}
          fetchPriority="high"
          className={`${fade} size-full object-cover ${showPoster ? 'opacity-100' : 'opacity-0'}`}
        />
        {quality && (
          <div className={`${fade} ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <Suspense fallback={null}>
              <Hero3D quality={quality} onReady={onReady} onProgress={setProgress} />
            </Suspense>
          </div>
        )}
        <Haze />
      </div>
      {quality && <Preloader progress={progress} done={ready} />}
    </>
  )
}
