import { useEffect, useState, type RefObject } from 'react'

/** `true` mientras el elemento está (aunque sea en parte) en el viewport. */
export function useInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false))
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return inView
}
