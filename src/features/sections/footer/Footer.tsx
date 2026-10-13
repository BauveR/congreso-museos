import { InstitutionLogos } from '../../../components/InstitutionLogos'
import { site } from '../../../content/site'

/** Pie en verde oscuro: logos de las instituciones, redes, aviso legal y privacidad (el contacto tiene su propia sección). */
export function Footer() {
  const { footer } = site
  return (
    <footer className="theme-dark py-12">
      <InstitutionLogos className="wrap mb-10 border-b border-borde/40 pb-10" />
      <div className="wrap flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-texto-suave">
          <span>{footer.legal}</span>
          <a href={footer.privacy.href} className="underline underline-offset-4 hover:text-acento-texto">
            {footer.privacy.label}
          </a>
        </p>
        <nav aria-label={footer.socialLabel}>
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
    </footer>
  )
}
