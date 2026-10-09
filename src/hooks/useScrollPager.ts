import { useEffect, useRef, useState } from 'react'

/**
 * Fila con scroll horizontal nativo: sabe si está al principio o al final
 * (para desactivar las flechas) y avanza de pantalla en pantalla.
 * Uso: `ref` en el contenedor con overflow-x y `measure` en su onScroll.
 */
export function useScrollPager<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const measure = () => {
    const el = ref.current
    if (!el) return
    const start = el.scrollLeft <= 4
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }))
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const page = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: smooth ? 'smooth' : 'auto' })
  }

  return { ref, edges, measure, page }
}
