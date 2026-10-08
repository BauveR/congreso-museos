import { useRef, useState } from 'react'
import { useMotionEffect } from '../../../app/motion'
import { DisplayHeading } from '../../../components/DisplayHeading'
import { Expandable } from '../../../components/ExpandableText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import type { ProgramItem } from '../../../content/types'
import { useReducedMotion } from '../../../hooks/useReducedMotion'

/*
 * Programa: tarjeta a ancho completo (edge) con fondo salvia que entra desde
 * abajo al llegar a la sección. Texto oscuro (#111311 sobre #89976f: 5,97:1).
 * - Escritorio: tres columnas, una por día.
 * - Móvil: botones de día y se ve un día a la vez (tres días completos en una
 *   columna serían interminables). Título y días forman una barra fija bajo
 *   el nav mientras se recorre la tarjeta (patrón de las agendas de eventos):
 *   siempre se ve el día elegido y se cambia sin volver arriba.
 * - Comunicaciones de cada mesa plegadas en todos los tamaños.
 */

function Item({ item }: { item: ProgramItem }) {
  const { program } = site
  return (
    <li className="grid grid-cols-[4.25rem_1fr] gap-x-3 border-t border-acento-contraste/20 py-4 first:border-t-0 first:pt-0">
      <span className="pt-0.5 text-sm font-bold tabular-nums">{item.time}</span>
      <div className="flex flex-col gap-3">
        {item.entries.map((entry) => (
          <div key={entry.title}>
            <p className="leading-snug font-semibold text-pretty">{entry.title}</p>
            {entry.notes?.map((note) => (
              <p key={note} className="mt-1 text-sm leading-snug text-pretty">
                {note}
              </p>
            ))}
            {entry.list && (
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-sm leading-snug">
                {entry.list.map((place) => (
                  <li key={place}>{place}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {item.talks && (
          <Expandable
            expandOnDesktop={false}
            moreLabel={program.showTalks(item.talks.length)}
            lessLabel={program.hideTalks}
            buttonClassName="-mt-2 text-acento-contraste underline underline-offset-4"
            head={null}
            rest={
              <ol className="flex flex-col gap-3 pt-1">
                {item.talks.map((talk) => (
                  <li key={talk.title} className="text-sm leading-snug text-pretty">
                    <span className="font-semibold">{talk.authors}:</span> {talk.title}
                  </li>
                ))}
              </ol>
            }
          />
        )}
      </div>
    </li>
  )
}

export function Program() {
  const { program } = site
  const [day, setDay] = useState(0)
  const card = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  /** Cambiar de día; si ya se había bajado por el anterior, empezar el nuevo desde arriba. */
  const selectDay = (i: number) => {
    setDay(i)
    const barBottom = bar.current?.getBoundingClientRect().bottom ?? 0
    const top = list.current?.getBoundingClientRect().top ?? 0
    if (top < barBottom) window.scrollBy({ top: top - barBottom })
  }

  // La tarjeta entra desde abajo al llegar a la sección (una vez).
  useMotionEffect(
    ({ gsap }) => {
      gsap.from(card.current, {
        y: 160,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: card.current, start: 'top 92%', once: true },
      })
    },
    [],
    !reducedMotion,
  )

  return (
    <Section id="agenda" className="py-24 sm:py-32">
      <div className="edge">
        <div ref={card} className="rounded-3xl bg-salvia p-5 text-acento-contraste sm:p-8 lg:p-10">
          {/* Móvil: barra fija (título + días) bajo el nav, con el fondo de la tarjeta
              y a sangre de su relleno. Escritorio: solo el título, sin fijar. */}
          <div
            ref={bar}
            className="sticky top-16 z-10 -mx-5 -mt-5 mb-8 rounded-t-3xl border-b border-acento-contraste/20 bg-salvia px-5 pt-5 pb-4 sm:-mx-8 sm:-mt-8 sm:px-8 sm:pt-8 lg:static lg:m-0 lg:mb-10 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
          >
            {/* Título dentro de la tarjeta, en oscuro (el salvia no se vería sobre salvia). */}
            <DisplayHeading color="text-acento-contraste" className="mb-4 lg:mb-0">
              {program.title}
            </DisplayHeading>
            <div role="group" aria-label={program.daysLabel} className="grid grid-cols-3 gap-2 lg:hidden">
              {program.days.map((d, i) => (
                <button
                  key={d.date}
                  type="button"
                  aria-pressed={day === i}
                  aria-controls={`programa-${d.date}`}
                  onClick={() => selectDay(i)}
                  className="min-h-11 rounded-full border border-acento-contraste/40 text-sm font-bold uppercase aria-pressed:bg-acento-contraste aria-pressed:text-salvia"
                >
                  {d.short}
                </button>
              ))}
            </div>
          </div>

          <div ref={list} className="grid gap-10 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-acento-contraste/25">
            {program.days.map((d, i) => (
              <div
                key={d.date}
                id={`programa-${d.date}`}
                className={`${day === i ? 'block' : 'hidden'} lg:block lg:px-8 lg:first:pl-0 lg:last:pr-0`}
              >
                <h3 className="font-wordmark text-3xl font-normal lg:text-4xl">
                  <time dateTime={d.date}>{d.label}</time>
                </h3>
                {d.parts.map((part) => (
                  <div key={part.title} className="mt-8">
                    <h4 className="mb-4 border-b-2 border-acento-contraste pb-2 text-xs font-bold tracking-wide uppercase">
                      {part.title}
                    </h4>
                    <ol className="flex flex-col">
                      {part.items.map((item) => (
                        <Item key={item.time + item.entries[0]?.title} item={item} />
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
