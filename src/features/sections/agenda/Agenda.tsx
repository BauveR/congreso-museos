import { Section } from '../../../components/Section'
import { SectionHeading } from '../../../components/SectionHeading'
import { site } from '../../../content/site'

const pad = (n: number) => String(n).padStart(2, '0')

export function Agenda() {
  const { agenda } = site
  return (
    <Section id="agenda" className="py-24 sm:py-32">
      <div className="wrap">
        <SectionHeading>{agenda.title}</SectionHeading>
        <ol className="mt-12 divide-y divide-borde border-y border-borde">
          {agenda.items.map((item, i) => (
            <li
              key={item.title}
              className="grid grid-cols-[3rem_1fr] gap-x-4 py-6 md:grid-cols-[4rem_6rem_1fr] md:items-baseline"
            >
              <span aria-hidden className="font-mono text-acento tabular-nums">
                {pad(i + 1)}
              </span>
              <span className="text-sm text-texto-suave tabular-nums md:text-base">{item.time}</span>
              <div className="col-start-2 md:col-start-3">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-1 text-texto-suave">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
