import { site } from '../../content/site'

interface PreloaderProps {
  /** 0–100, o `null` mientras no hay progreso medible (descarga del chunk). */
  progress: number | null
  done: boolean
}

/**
 * Indicador de carga del 3D. No bloquea la página: el contenido y el póster
 * ya están visibles (el póster es el LCP); solo informa de la carga del modelo.
 * Va en el centro de la pantalla, donde aparecerá la esfera: ahí no tapa el
 * wordmark ni la fila inferior del hero.
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
      className={`pointer-events-none fixed top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 rounded-full border border-borde bg-fondo/90 px-4 py-2 text-xs text-texto-suave transition-opacity duration-500 motion-reduce:transition-none ${done ? 'opacity-0' : 'opacity-100'}`}
    >
      <span>{label}</span>
      <span className="relative h-1 w-16 overflow-hidden rounded-full bg-borde">
        <span
          className={`absolute inset-y-0 left-0 rounded-full bg-acento transition-[width] duration-300 ${value === null ? 'w-1/3 animate-pulse' : ''}`}
          style={value === null ? undefined : { width: `${value}%` }}
        />
      </span>
      {value !== null && <span className="w-8 text-right tabular-nums">{value}%</span>}
    </div>
  )
}
