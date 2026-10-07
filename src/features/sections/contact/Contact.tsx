import { ButtonLink } from '../../../components/ButtonLink'
import { DisplayHeading } from '../../../components/DisplayHeading'
import { ScrollLitText } from '../../../components/ScrollLitText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'

/** Contacto: título, texto que se enciende con el scroll, correo y dirección. */
export function Contact() {
  const { contact } = site
  return (
    <Section id="contacto" className="py-24 sm:py-32">
      <div className="wrap">
        <div className="rounded-3xl border border-borde bg-superficie px-6 py-12 sm:px-12 sm:py-16">
          <DisplayHeading>{contact.title}</DisplayHeading>
          <ScrollLitText paragraphs={[contact.intro]} className="mt-6" />
          <ButtonLink href={contact.cta.href} icon={contact.cta.icon} className="mt-10">
            {contact.cta.label}
          </ButtonLink>
          <p className="mt-8 text-texto-suave">
            <a href={`mailto:${contact.email}`} className="text-acento-texto underline underline-offset-4">
              {contact.email}
            </a>
          </p>
          <address className="mt-2 text-texto-suave not-italic">{contact.address}</address>
        </div>
      </div>
    </Section>
  )
}
