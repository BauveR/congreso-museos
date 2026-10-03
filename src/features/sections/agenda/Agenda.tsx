import { useRef } from 'react'
import { useMotionEffect } from '../../../app/motion'
import { Section } from '../../../components/Section'
import { SectionHeading } from '../../../components/SectionHeading'
import { site } from '../../../content/site'
import { useEnhancedMotion } from '../../../hooks/useEnhancedMotion'

const pad = (n: number) => String(n).padStart(2, '0')

/** Desplazamiento diagonal entre tarjetas apiladas. */
const STACK_X = '7vw'
const STACK_Y = '2.5rem'
/** Scroll (en alturas de ventana) que consume la entrada de cada tarjeta. */
const SCROLL_PER_CARD = 0.6

/**
 * Escritorio: la sección se fija y las tarjetas 01–07 entran desde abajo y
 * se apilan en cascada diagonal, con el título fijo a la derecha.
 * Móvil y reduced motion: lista numerada normal.
 */
export function Agenda() {
  const { agenda } = site
  const stage = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const stacked = useEnhancedMotion()

  useMotionEffect(
    ({ gsap, ScrollTrigger }) => {
      const cards = list.current?.children
      if (!stage.current || !cards) return
      gsap.from(cards, {
        y: () => window.innerHeight,
        opacity: 0,
        ease: 'power2.out',
        stagger: 1,
        scrollTrigger: {
          trigger: stage.current,
          pin: true,
          start: 'top top',
          end: () => `+=${cards.length * SCROLL_PER_CARD * window.innerHeight}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    },
    [stacked],
    stacked,
  )

  return (
    <Section id="agenda" className={stacked ? '' : 'py-24 sm:py-32'}>
      <div ref={stage} className={stacked ? 'relative h-svh overflow-hidden' : 'wrap'}>
        <div className={stacked ? 'absolute top-24 right-[max(2rem,calc((100vw-72rem)/2+2rem))] text-right' : ''}>
          <SectionHeading>{agenda.title}</SectionHeading>
        </div>
        <ol
          ref={list}
          className={stacked ? '' : 'mt-12 divide-y divide-borde border-y border-borde'}
        >
          {agenda.items.map((item, i) => (
            <li
              key={item.title}
              style={
                stacked
                  ? { left: `calc(max(2rem, (100vw - 72rem) / 2 + 2rem) + ${i} * ${STACK_X})`, top: `calc(6rem + ${i} * ${STACK_Y})` }
                  : undefined
              }
              className={
                stacked
                  ? 'absolute flex h-[min(20rem,45svh)] w-[min(24rem,30vw)] flex-col justify-between border border-borde bg-fondo/80 p-6 backdrop-blur-md'
                  : 'grid grid-cols-[3rem_1fr] gap-x-4 py-6 md:grid-cols-[4rem_6rem_1fr] md:items-baseline'
              }
            >
              <span
                aria-hidden
                className={stacked ? 'text-6xl font-black text-acento-texto tabular-nums' : 'font-mono text-acento-texto tabular-nums'}
              >
                {pad(i + 1)}
              </span>
              <div className={stacked ? '' : 'contents'}>
                <span className="text-sm text-texto-suave tabular-nums md:text-base">{item.time}</span>
                <div className={stacked ? 'mt-2' : 'col-start-2 md:col-start-3'}>
                  <h3 className={stacked ? 'text-2xl font-black uppercase' : 'text-xl font-semibold'}>{item.title}</h3>
                  <p className="mt-1 text-texto-suave">{item.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
