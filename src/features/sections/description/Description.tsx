import { useRef } from 'react'
import { useMotionEffect } from '../../../app/motion'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/** Párrafo grande que se "enciende" palabra a palabra con el scroll. */
export function Description() {
  const { description } = site
  const ref = useRef<HTMLParagraphElement>(null)
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    ({ gsap, SplitText }) => {
      const el = ref.current
      if (!el) return
      const { words } = SplitText.create(el, { type: 'words' })
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
    <Section id="descripcion" className="py-24 sm:py-32">
      <div className="wrap">
        <p
          ref={ref}
          data-exit-fade=""
          className="max-w-5xl text-[clamp(1.75rem,4.5vw,3.5rem)] leading-[1.15] font-medium tracking-tight"
        >
          {description.body.map((segment, i) => (
            <span key={i} className={segment.highlight ? 'text-acento-texto' : undefined}>
              {segment.text}
            </span>
          ))}
        </p>
      </div>
    </Section>
  )
}
