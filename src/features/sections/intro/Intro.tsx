import { ButtonLink } from '../../../components/ButtonLink'
import { Section } from '../../../components/Section'
import { SectionHeading } from '../../../components/SectionHeading'
import { site } from '../../../content/site'

export function Intro() {
  const { intro } = site
  return (
    <Section id="presentacion" className="py-24 sm:py-32">
      <div className="wrap">
        <div className="max-w-3xl">
          <SectionHeading>{intro.title}</SectionHeading>
          <p className="mt-6 text-lg text-texto-suave sm:text-xl">{intro.subtitle}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={intro.primaryCta.href}>{intro.primaryCta.label}</ButtonLink>
            <ButtonLink href={intro.secondaryCta.href} variant="secondary">
              {intro.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  )
}
