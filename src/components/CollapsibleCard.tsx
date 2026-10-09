import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { loadMotion } from '../app/motion'
import { site } from '../content/site'
import { ExpandButton } from './ExpandButton'

interface CollapsibleCardProps {
  /** Antetítulo pequeño sobre el título (p. ej. la letra del apartado). */
  kicker?: string
  title: string
  /** Título destacado: más grande (tarjetas protagonistas). */
  featured?: boolean
  /** Resumen bajo el título (p. ej. «10 personas»). */
  meta?: string
  /** Alto de la vista previa plegada (CSS), con el final difuminado. */
  peek?: string
  children: ReactNode
  className?: string
}

const refreshTriggers = () => void loadMotion().then(({ ScrollTrigger }) => ScrollTrigger.refresh())
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Tarjeta semiplegada: muestra el principio del contenido, difuminado, y
 * «Ver todo» la despliega. La altura se anima con max-height al alto real
 * del contenido (medido; se actualiza si cambia, p. ej. al girar el móvil).
 * Si todo cabe en la vista previa, no hay botón ni difuminado.
 */
export function CollapsibleCard({ kicker, title, featured = false, meta, peek = '11rem', children, className = '' }: CollapsibleCardProps) {
  const id = useId()
  const content = useRef<HTMLDivElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [height, setHeight] = useState<number | null>(null)
  const [fits, setFits] = useState(false)

  useEffect(() => {
    const el = content.current
    if (!el) return
    const measure = () => {
      setHeight(el.scrollHeight)
      setFits(el.scrollHeight <= (preview.current?.clientHeight ?? 0) + 1)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const toggle = () => {
    setOpen((o) => !o)
    // Sin transición (reduced motion) no hay transitionend.
    if (reducedMotion()) refreshTriggers()
  }

  const collapsed = !open && !fits

  return (
    <section className={`rounded-2xl border border-borde bg-superficie p-5 sm:p-6 ${className}`}>
      {kicker && <p className="mb-2 text-xs font-bold tracking-widest text-acento-texto uppercase">{kicker}</p>}
      <h3 className="flex flex-col gap-1">
        <span className={`font-display leading-snug text-balance ${featured ? 'text-2xl font-semibold lg:text-3xl' : 'text-xl'}`}>{title}</span>
        {meta && <span className={featured ? 'text-base text-texto-suave' : 'text-sm text-texto-suave'}>{meta}</span>}
      </h3>

      <div
        ref={preview}
        id={id}
        onTransitionEnd={(e) => e.target === e.currentTarget && refreshTriggers()}
        style={{ maxHeight: collapsed ? peek : height ? `${height}px` : 'none' }}
        className="relative mt-5 overflow-hidden transition-[max-height] duration-500 ease-out motion-reduce:transition-none"
      >
        <div ref={content}>{children}</div>
        {/* Difuminado al color de la tarjeta: indica que sigue. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-superficie to-transparent transition-opacity duration-300 ${collapsed ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      {!fits && (
        <ExpandButton
          expanded={open}
          controls={id}
          label={site.ui.seeAll}
          expandedLabel={site.ui.seeLess}
          srContext={title}
          onClick={toggle}
          className="mt-3 text-acento-texto"
        />
      )}
    </section>
  )
}
