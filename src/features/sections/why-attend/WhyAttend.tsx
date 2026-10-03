import { Card } from '../../../components/Card'
import { RevealText } from '../../../components/RevealText'
import { Section } from '../../../components/Section'
import { SectionHeading } from '../../../components/SectionHeading'
import { site } from '../../../content/site'

/**
 * En escritorio el título queda fijo (sticky) a la izquierda mientras las
 * tarjetas pasan por la derecha y se desvanecen al salir por arriba.
 */
export function WhyAttend() {
  const { whyAttend } = site
  return (
    <Section id="por-que" className="py-24 sm:py-32">
      <div className="wrap lg:grid lg:grid-cols-2 lg:gap-16">
        <div className="max-w-2xl lg:sticky lg:top-32 lg:self-start">
          <SectionHeading>{whyAttend.title}</SectionHeading>
          <RevealText as="p" className="mt-6 text-lg text-texto-suave">
            {whyAttend.intro}
          </RevealText>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:grid-cols-1 lg:gap-[25svh] lg:py-[15svh]">
          {whyAttend.cards.map((card) => (
            <li key={card.title} data-exit-fade="">
              <Card title={card.title} body={card.body} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
