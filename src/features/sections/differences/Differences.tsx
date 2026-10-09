import { useRef } from 'react'
import { useMotionEffect } from '../../../app/motion'
import { CollapsibleCard } from '../../../components/CollapsibleCard'
import { DisplayHeading } from '../../../components/DisplayHeading'
import { ExpandableText } from '../../../components/ExpandableText'
import { ScrollLit } from '../../../components/ScrollLitText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/** Subtítulos de los dos apartados (Kola, salvia). */
const subheading = 'max-w-4xl font-wordmark text-2xl leading-tight font-normal text-balance text-salvia-texto sm:text-3xl lg:text-4xl'

/**
 * Declaración de intenciones (título en Kola, color claro), en dos apartados.
 * «¿Qué será distinto…?»: los tres rasgos del congreso en tarjetas con el
 * título destacado y vista previa del texto (una columna en móvil, tres en
 * escritorio). Después, «¿A qué aspira…?»: texto que se enciende con el
 * scroll y, a su derecha, un cierre en grande a modo de llamada final que
 * entra desde la derecha de la página.
 */
export function Differences() {
  const { heading, title, items, aspiration } = site.differences
  const closing = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  // El cierre entra desde la derecha de la página al llegar a él (una vez), frase a frase.
  useMotionEffect(
    ({ gsap }) => {
      const lines = closing.current?.children
      if (!lines?.length) return
      gsap.from(lines, {
        x: () => window.innerWidth * 0.5,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.18,
        scrollTrigger: { trigger: closing.current, start: 'top 85%', once: true },
      })
    },
    [],
    !reducedMotion,
  )

  return (
    // overflow-x-clip: el cierre entra desde fuera de la pantalla sin crear scroll horizontal.
    <Section id="distinto" className="overflow-x-clip py-24 sm:py-32">
      <div className="wrap">
        <DisplayHeading color="text-claro" className="uppercase">
          {heading}
        </DisplayHeading>

        <h3 className={`mt-12 lg:mt-16 ${subheading}`}>
          {title}
        </h3>

        <div className="mt-10 grid items-start gap-4 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {items.map((item) => (
            <CollapsibleCard key={item.kicker} kicker={item.kicker} title={item.title} meta={item.subtitle} featured peek="14rem">
              <div className="flex flex-col gap-4 text-[0.9375rem] leading-relaxed text-pretty">
                {item.body.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </CollapsibleCard>
          ))}
        </div>

        <div className="mt-24 lg:mt-32">
          <h3 className={subheading}>
            {aspiration.title}
          </h3>
          {/* Escritorio: texto a la izquierda y la llamada final a su derecha; móvil: debajo. */}
          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-16">
            <ScrollLit className="max-w-prose text-lg leading-relaxed text-pretty text-texto lg:text-xl">
              <ExpandableText paragraphs={aspiration.body} />
            </ScrollLit>
            <div
              ref={closing}
              className="flex flex-col gap-5 font-display text-2xl leading-snug font-semibold text-balance text-acento-texto lg:text-3xl xl:text-4xl"
            >
              {aspiration.closing.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
