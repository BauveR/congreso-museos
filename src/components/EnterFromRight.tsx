import { useRef, type ReactNode } from 'react'
import { useMotionEffect } from '../app/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface EnterFromRightProps {
  children: ReactNode
  className?: string
  /** Cuándo empieza (ScrollTrigger): por defecto, con el elemento al 75 % de la pantalla. */
  start?: string
}

/**
 * Elemento que entra deslizándose desde fuera de la página (borde derecho)
 * hasta su sitio, una vez, al llegar a él. Oculto hasta que cargan las
 * animaciones (data-reveal) para que no aparezca en su sitio y luego salte.
 * Con reduced motion, quieto. La sección que lo contiene debe recortar el
 * desbordamiento lateral (overflow-x-clip) para no crear scroll horizontal.
 */
export function EnterFromRight({ children, className = '', start = 'top 75%' }: EnterFromRightProps) {
  const box = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    ({ gsap }) => {
      const el = box.current
      if (!el) return
      gsap.from(el, {
        // Distancia hasta salir por la derecha, medida sin el desplazamiento ya aplicado.
        x: () => window.innerWidth - (el.getBoundingClientRect().left - Number(gsap.getProperty(el, 'x'))),
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start, once: true, invalidateOnRefresh: true },
      })
    },
    [start],
    !reducedMotion,
  )

  return (
    <div ref={box} data-reveal="" className={className}>
      {children}
    </div>
  )
}
