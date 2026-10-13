/**
 * Indicador de carga: aro que gira y texto. Con reduced motion, el aro queda
 * quieto (el texto ya dice que está cargando).
 */
export function Loader({ text, className = '' }: { text: string; className?: string }) {
  return (
    <p role="status" className={`flex items-center gap-3 text-texto-suave ${className}`}>
      <span aria-hidden className="size-5 shrink-0 animate-spin rounded-full border-2 border-current border-t-acento motion-reduce:animate-none" />
      {text}
    </p>
  )
}
