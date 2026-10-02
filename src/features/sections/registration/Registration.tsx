import { ButtonLink } from '../../../components/ButtonLink'
import { Section } from '../../../components/Section'
import { SectionHeading } from '../../../components/SectionHeading'
import { site } from '../../../content/site'

export function Registration() {
  const { registration } = site
  return (
    <Section id="inscripciones" className="py-24 sm:py-32">
      <div className="wrap">
        <div className="rounded-3xl border border-borde bg-superficie px-6 py-12 sm:px-12 sm:py-16">
          <SectionHeading>{registration.title}</SectionHeading>
          {registration.open ? (
            <>
              <p className="mt-6 max-w-2xl text-lg text-texto-suave">{registration.body}</p>
              <ButtonLink href={registration.cta.href} className="mt-8">
                {registration.cta.label}
              </ButtonLink>
            </>
          ) : (
            <>
              <p className="mt-6 inline-flex rounded-full border border-acento px-4 py-1 text-sm font-semibold text-acento">
                {registration.comingSoonLabel}
              </p>
              <p className="mt-4 max-w-2xl text-lg text-texto-suave">{registration.comingSoonBody}</p>
            </>
          )}
        </div>
      </div>
    </Section>
  )
}
