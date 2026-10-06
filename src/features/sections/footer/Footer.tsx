import { Section } from '../../../components/Section'
import { SplitHeadline } from '../../../components/SplitHeadline'
import { site } from '../../../content/site'

export function Footer() {
  const { footer } = site
  return (
    <Section id="contacto" as="footer" className="border-t border-borde py-16">
      <div className="wrap mb-20 flex flex-col gap-12">
        {footer.headlines.map((headline) => (
          <SplitHeadline key={headline.lines.join(' ')} lines={headline.lines} align={headline.align} as="p" />
        ))}
      </div>
      <div className="wrap grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">{footer.title}</h2>
          <p className="mt-4 text-texto-suave">
            {footer.emailLabel}{' '}
            <a href={`mailto:${footer.email}`} className="text-acento-texto underline underline-offset-4">
              {footer.email}
            </a>
          </p>
          <address className="mt-2 text-texto-suave not-italic">{footer.address}</address>
        </div>
        <nav aria-label={footer.socialLabel} className="md:justify-self-end">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.social.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="inline-block py-2 text-texto-suave transition-colors hover:text-acento-texto">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="wrap mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-texto-suave">
        <span>{footer.legal}</span>
        <a href={footer.privacy.href} className="underline underline-offset-4 hover:text-acento-texto">
          {footer.privacy.label}
        </a>
      </p>
    </Section>
  )
}
