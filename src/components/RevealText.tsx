import { useRef, type ElementType, type ReactNode } from 'react'
import { useMotionEffect } from '../app/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface RevealTextProps {
  as?: ElementType
  className?: string
  children: ReactNode
}

/**
 * Revela el texto línea a línea al entrar en el viewport. SplitText con
 * máscara por línea; autoSplit vuelve a partir al cambiar el ancho o al
 * cargar fuentes. Con reduced motion el texto se muestra sin animación.
 */
export function RevealText({ as: Tag = 'div', className, children }: RevealTextProps) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    ({ gsap, SplitText }) => {
      const el = ref.current
      if (!el) return
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        // Devolver la animación permite a autoSplit recrearla al re-partir.
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }),
      })
    },
    [],
    !reducedMotion,
  )

  return (
    <Tag ref={ref} data-reveal="" className={className}>
      {children}
    </Tag>
  )
}
