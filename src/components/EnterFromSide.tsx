import { useRef, type ReactNode } from 'react'
import { useMotionEffect } from '../app/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface EnterFromSideProps {
  children: ReactNode
  className?: string
  /** Borde de la página por el que entra (por defecto, el derecho). */
  from?: 'left' | 'right'
  /** Cuándo empieza (ScrollTrigger): por defecto, con el elemento al 75 % de la pantalla. */
  start?: string
}

/**
 * Elemento que entra deslizándose desde fuera de la página (borde derecho o
 * izquierdo) hasta su sitio, una vez, al llegar a él. Oculto hasta que cargan las
 * animaciones (data-reveal) para que no aparezca en su sitio y luego salte.
 * Con reduced motion, quieto. La sección que lo contiene debe recortar el
 * desbordamiento lateral (overflow-x-clip) para no crear scroll horizontal.
 */
export function EnterFromSide({ children, className = '', from = 'right', start = 'top 75%' }: EnterFromSideProps) {
  const box = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    ({ gsap }) => {
      const el = box.current
      if (!el) return
      gsap.from(el, {
        // Distancia hasta quedar fuera de la página por ese lado, medida sin el desplazamiento ya aplicado.
        x: () => {
          const box = el.getBoundingClientRect()
          const shift = Number(gsap.getProperty(el, 'x'))
          return from === 'right' ? window.innerWidth - (box.left - shift) : -(box.right - shift)
        },
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start, once: true, invalidateOnRefresh: true },
      })
    },
    [start, from],
    !reducedMotion,
  )

  return (
    <div ref={box} data-reveal="" className={className}>
      {children}
    </div>
  )
}
