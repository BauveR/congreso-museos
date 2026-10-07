import { useRef, type ReactNode } from 'react'
import { useMotionEffect } from '../app/motion'
import { useReducedMotion } from '../hooks/useReducedMotion'

/**
 * Envoltorio que «enciende» palabra a palabra, con el scroll, los párrafos y
 * elementos de lista que contiene (sin cambiar su estilo).
 */
export function ScrollLit({ children, className = '', exitFade = false }: { children: ReactNode; className?: string; exitFade?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    ({ gsap, SplitText }) => {
      const el = ref.current
      if (!el) return
      const { words } = SplitText.create(el.querySelectorAll('p, li'), { type: 'words' })
      gsap.from(words, {
        opacity: 0.15,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      })
    },
    [],
    !reducedMotion,
  )

  return (
    <div ref={ref} data-exit-fade={exitFade ? '' : undefined} className={className}>
      {children}
    </div>
  )
}

/** Párrafos grandes que se «encienden» palabra a palabra con el scroll. */
export function ScrollLitText({ paragraphs, className = '' }: { paragraphs: readonly string[]; className?: string }) {
  return (
    <ScrollLit exitFade className={`flex max-w-5xl flex-col gap-6 text-xl leading-snug font-medium text-pretty sm:text-2xl lg:text-3xl ${className}`}>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </ScrollLit>
  )
}
