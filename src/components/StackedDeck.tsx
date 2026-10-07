import { X } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { loadMotion, useMotionEffect } from '../app/motion'
import { site } from '../content/site'
import { useEnhancedMotion } from '../hooks/useEnhancedMotion'

/** Desplazamiento diagonal entre tarjetas apiladas (grandes: poco desfase). */
const STACK_X_REM = 2.5
const STACK_Y_REM = 1.25
/** El escenario se fija a esta distancia del borde superior (bajo el nav). */
const STAGE_TOP_REM = 5.5
/** Margen inferior mínimo con la pantalla. */
const STAGE_BOTTOM_REM = 2
/** Scroll (en alturas de ventana) que consume la entrada de cada tarjeta. */
const SCROLL_PER_CARD = 0.7
/** Parte de ese tramo que dura la entrada (el resto, la tarjeta quieta). */
const ENTER = 0.6
/** Pausa final (en tarjetas) para leer la última antes de soltar el pin. */
const HOLD = 0.7
/** Scroll (px) con la tarjeta desplegada a partir del cual se cierra sola. */
const CLOSE_ON_SCROLL = 60
/** Escala mínima del texto desplegado para que quepa entero (sin scroll). */
const MIN_FIT = 0.72

const remPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize)

/** Alto disponible (px) para la tarjeta `i`: bajo el nav y su desfase, sin pasar de la pantalla. */
const availablePx = (i: number) => window.innerHeight - (STAGE_TOP_REM + STAGE_BOTTOM_REM + i * STACK_Y_REM) * remPx()

/** Estado de cada tarjeta que recibe `renderItem`. */
export interface DeckCardState {
  /** Modo pila (escritorio con movimiento). */
  stacked: boolean
  /** Desplegada sobre toda la pila con todo su texto a la vista (solo en modo pila). */
  expanded: boolean
  toggle: () => void
}

interface StackedDeckProps<T> {
  items: readonly T[]
  getKey: (item: T, index: number) => string
  /** Contenido de cada tarjeta. */
  renderItem: (item: T, index: number, state: DeckCardState) => ReactNode
  /** Fondo, borde y color de las tarjetas. */
  cardClassName: string
  className?: string
}

/** Ratón con la rueda animada: indica «desplázate» (patrón habitual en escritorio). */
function MouseHint() {
  return (
    <span aria-hidden className="relative flex h-7 w-[1.125rem] shrink-0 justify-center rounded-full border-2 border-current pt-1.5">
      <span className="h-1.5 w-0.5 animate-wheel rounded-full bg-current motion-reduce:animate-none" />
    </span>
  )
}

/**
 * Tarjetas grandes apiladas con el scroll.
 * - Escritorio: el escenario se fija bajo el nav y mide lo que la tarjeta con
 *   más contenido (todas cerradas usan ese alto). La primera ya está al
 *   llegar; las demás entran desde abajo con un leve desfase. Al final, una
 *   pausa para leer la última antes de soltar el pin. La timeline se crea una
 *   sola vez; los cambios de alto solo recalculan posiciones (refresh).
 * - Desplegar (`toggle`): la tarjeta cubre toda la pila y muestra su texto
 *   completo a la vista (en columnas; reducido si hace falta): nunca hay un
 *   segundo scroll. Se cierra con Cerrar, Esc o al seguir haciendo scroll, y
 *   la pila continúa con normalidad.
 * - Móvil y reduced motion: tarjetas una debajo de otra (`expanded` siempre
 *   false: cada sección usa su hoja de lectura).
 */
export function StackedDeck<T>({ items, getKey, renderItem, cardClassName, className = '' }: StackedDeckProps<T>) {
  const { ui } = site
  const stage = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const stacked = useEnhancedMotion()
  const count = items.length
  /** Alto natural (px) de cada tarjeta cerrada (contenido + relleno + borde). */
  const [heights, setHeights] = useState<number[]>([])
  /** Tarjeta desplegada. */
  const [open, setOpen] = useState<number | null>(null)
  const [viewport, setViewport] = useState(0)

  useEffect(() => {
    const onResize = () => setViewport(window.innerHeight)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const el = list.current
    if (!stacked || !el) return
    const cards = Array.from(el.children) as HTMLElement[]
    const measure = () => {
      const next = cards.map((li) => {
        const content = li.firstElementChild as HTMLElement | null
        const style = getComputedStyle(li)
        const chrome = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
        return Math.ceil((content?.offsetHeight ?? 0) + chrome)
      })
      setHeights((prev) => (prev.length === next.length && prev.every((h, i) => Math.abs(h - (next[i] ?? 0)) < 1) ? prev : next))
    }
    // El contenido no se estira con la tarjeta: su tamaño es el natural.
    const observer = new ResizeObserver(measure)
    cards.forEach((li) => li.firstElementChild && observer.observe(li.firstElementChild))
    return () => observer.disconnect()
  }, [stacked])

  // Alto común: la tarjeta cerrada con más contenido (la desplegada no cuenta).
  const closed = heights.filter((_, i) => i !== open)
  const common = closed.length ? Math.max(...closed) : null
  const max = stacked && viewport ? availablePx(count - 1) : 0
  const cardPx = common === null ? max : Math.min(common, max)
  /** Desplegada: todo el escenario visible (desde la primera tarjeta). */
  const openPx = stacked && viewport ? availablePx(0) : 0

  // Cambia la altura del escenario: recalcular posiciones de todos los triggers.
  useEffect(() => {
    if (stacked && cardPx) void loadMotion().then(({ ScrollTrigger }) => ScrollTrigger.refresh())
  }, [stacked, cardPx])

  useMotionEffect(
    ({ gsap, ScrollTrigger }) => {
      const entering = Array.from(list.current?.children ?? []).slice(1)
      if (!stage.current || !entering.length) return
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage.current,
          pin: true,
          start: () => `top ${STAGE_TOP_REM * remPx()}px`,
          end: () => `+=${(entering.length + HOLD) * SCROLL_PER_CARD * window.innerHeight}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      // La primera ya está al llegar (sin hueco vacío); entran las demás.
      entering.forEach((el, k) => {
        tl.from(el, { y: () => window.innerHeight, opacity: 0, ease: 'power2.out', duration: ENTER }, k)
      })
      tl.to({}, { duration: HOLD }, entering.length)
      // El pin añade altura: recolocar el resto de triggers en orden de página.
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
      // Las fuentes web cambian alturas: recalcular cuando estén cargadas.
      void document.fonts?.ready.then(() => ScrollTrigger.refresh())
    },
    [stacked],
    stacked,
  )

  const toggle = useCallback((i: number) => setOpen((current) => (current === i ? null : i)), [])

  // Desplegada: Esc o seguir con el scroll la cierran (el scroll nunca se bloquea).
  useEffect(() => {
    if (open === null) return
    const startY = window.scrollY
    const close = () => setOpen(null)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    const onScroll = () => Math.abs(window.scrollY - startY) > CLOSE_ON_SCROLL && close()
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [open])

  // Que el texto desplegado quepa entero: si desborda, se reduce (zoom) hasta
  // caber, con un mínimo legible. Las columnas se recolocan en cada paso.
  useLayoutEffect(() => {
    if (open === null || !stacked) return
    const li = list.current?.children[open] as HTMLElement | undefined
    const content = li?.firstElementChild as HTMLElement | undefined
    if (!li || !content) return
    const style = getComputedStyle(li)
    const room = openPx - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
    // Alto visible (incluye el zoom). Con columnas, reducir el zoom gana
    // ancho y alto a la vez: el alto baja ~zoom², de ahí la raíz.
    const visible = () => content.getBoundingClientRect().height
    const apply = (z: number) => content.style.setProperty('zoom', String(z))
    let zoom = 1
    apply(zoom)
    for (let step = 0; step < 6 && visible() > room && zoom > MIN_FIT; step++) {
      zoom = Math.max(MIN_FIT, zoom * Math.sqrt(room / visible()))
      apply(zoom)
    }
    return () => {
      content.style.removeProperty('zoom')
    }
  }, [open, stacked, openPx])

  const stackX = `${STACK_X_REM}rem`
  const stackY = `${STACK_Y_REM}rem`
  const full = 'calc(100vw - 2 * var(--wrap-inset))'
  const cardStyle = (i: number): CSSProperties | undefined => {
    if (!stacked) return undefined
    return open === i
      ? // Desplegada: cubre toda la pila, por encima de las demás.
        { left: 'var(--wrap-inset)', top: 0, width: full, height: `${openPx}px`, zIndex: 20 }
      : {
          left: `calc(var(--wrap-inset) + ${i} * ${stackX})`,
          top: `calc(${i} * ${stackY})`,
          width: `calc(${full} - ${count - 1} * ${stackX})`,
          height: `${cardPx}px`,
        }
  }

  return (
    <div
      ref={stage}
      style={stacked ? { height: `calc(${cardPx}px + ${count - 1} * ${stackY})` } : undefined}
      className={`${stacked ? 'relative' : 'wrap'} ${className}`}
    >
      <ol ref={list} className={stacked ? '' : 'flex flex-col gap-6'}>
        {items.map((item, i) => (
          <li
            key={getKey(item, i)}
            style={cardStyle(i)}
            className={`rounded-3xl p-5 shadow-xl sm:p-8 ${cardClassName} ${
              stacked ? 'absolute overflow-hidden transition-[left,top,width,height] duration-500 ease-out motion-reduce:transition-none lg:p-10' : ''
            }`}
          >
            <div>{renderItem(item, i, { stacked, expanded: stacked && open === i, toggle: () => toggle(i) })}</div>
          </li>
        ))}
      </ol>

      {stacked &&
        open !== null &&
        // Indicaciones: todo está a la vista; seguir con el scroll cierra y continúa.
        // En <body>: el escenario fijado no debe hacer de contenedor de `fixed`.
        createPortal(
          <div
            role="status"
            className="theme-dark fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 animate-fade-in items-center gap-4 rounded-full py-2 pr-2 pl-5 text-sm shadow-2xl motion-reduce:animate-none"
          >
            <MouseHint />
            <span className="font-semibold whitespace-nowrap">{ui.scrollToContinue}</span>
            <kbd className="rounded border border-borde px-1.5 py-0.5 font-sans text-xs text-texto-suave">Esc</kbd>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-acento px-4 text-xs font-bold tracking-wide text-acento-contraste uppercase hover:bg-acento/85"
            >
              <X aria-hidden className="size-4" />
              {ui.close}
            </button>
          </div>,
          document.body,
        )}
    </div>
  )
}
