import { InstitutionLogos } from '../../../components/InstitutionLogos'
import { site } from '../../../content/site'

/** Pie en verde oscuro: logos de las instituciones, © y páginas legales (el contacto tiene su propia sección). En móvil, todo centrado. */
export function Footer() {
  const { footer } = site
  return (
    <footer className="theme-dark py-12">
      <InstitutionLogos centerMobile className="wrap mb-10 border-b border-borde/40 pb-10" />
      <div className="wrap flex flex-col gap-4 text-sm text-texto-suave max-md:items-center max-md:text-center md:flex-row md:items-center md:justify-between">
        <p>{footer.legal}</p>
        <nav aria-label={footer.linksLabel}>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 max-md:justify-center">
            {footer.links.map((link) => (
              <li key={link.href}>
                {/* Enlace normal (carga completa): la página legal se abre arriba, no a la altura del pie. */}
                <a href={link.href} className="inline-block py-2 underline underline-offset-4 transition-colors hover:text-acento-texto">
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
