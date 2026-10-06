import { site } from '../../content/site'

interface PreloaderProps {
  /** 0–100, o `null` mientras no hay progreso medible (descarga del chunk). */
  progress: number | null
  done: boolean
}

/**
 * Indicador de carga del 3D. No bloquea la página: el contenido y el póster
 * ya están visibles (el póster es el LCP); solo informa de la carga del modelo.
 * Es una barra fina en el borde superior de la pantalla (encima del nav), así
 * no tapa el wordmark ni la fila inferior del hero. El texto queda para
 * lectores de pantalla.
 */
export function Preloader({ progress, done }: PreloaderProps) {
  const label = site.preloader.label
  const value = progress === null ? null : Math.round(progress)

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value ?? undefined}
      aria-hidden={done || undefined}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden transition-opacity duration-500 motion-reduce:transition-none ${done ? 'opacity-0' : 'opacity-100'}`}
    >
      <span
        className={`absolute inset-y-0 left-0 bg-acento transition-[width] duration-300 ${value === null ? 'w-1/3 animate-pulse' : ''}`}
        style={value === null ? undefined : { width: `${value}%` }}
      />
    </div>
  )
}
