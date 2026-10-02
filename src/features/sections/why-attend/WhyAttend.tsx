import { Card } from '../../../components/Card'
import { Section } from '../../../components/Section'
import { SectionHeading } from '../../../components/SectionHeading'
import { site } from '../../../content/site'

export function WhyAttend() {
  const { whyAttend } = site
  return (
    <Section id="por-que" className="py-24 sm:py-32">
      <div className="wrap">
        <div className="max-w-2xl">
          <SectionHeading>{whyAttend.title}</SectionHeading>
          <p className="mt-6 text-lg text-texto-suave">{whyAttend.intro}</p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyAttend.cards.map((card) => (
            <li key={card.title}>
              <Card title={card.title} body={card.body} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
