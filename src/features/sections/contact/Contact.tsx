import { ButtonLink } from '../../../components/ButtonLink'
import { DisplayHeading } from '../../../components/DisplayHeading'
import { EnterFromRight } from '../../../components/EnterFromRight'
import { ScrollLitText } from '../../../components/ScrollLitText'
import { Section } from '../../../components/Section'
import { site } from '../../../content/site'
import { imagekitPicture } from '../../../services/imagekit'

/**
 * Contacto: título, texto que se enciende con el scroll, botón y correo,
 * en una tarjeta con el verde oscuro del fondo de la web (theme-dark: sus
 * colores de texto y botón, aunque la sección esté en el tema claro). En
 * escritorio, una ilustración en la mitad derecha, a su tamaño real, que
 * entra desde fuera de la página.
 */
export function Contact() {
  const { contact } = site
  const picture = imagekitPicture(contact.art.src, [contact.art.width], 60)
  return (
    // overflow-x-clip: la ilustración entra desde fuera de la página sin crear scroll lateral.
    <Section id="contacto" className="overflow-x-clip py-24 sm:py-32">
      <div className="wrap">
        <div className="theme-dark grid items-center gap-12 rounded-3xl px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <DisplayHeading>{contact.title}</DisplayHeading>
            <ScrollLitText paragraphs={[contact.intro]} className="mt-6" />
            <ButtonLink href={contact.cta.href} className="mt-10">
              {contact.cta.label}
            </ButtonLink>
            <p className="mt-8 text-texto-suave">
              <a href={`mailto:${contact.email}`} className="text-acento-texto underline underline-offset-4">
                {contact.email}
              </a>
            </p>
          </div>
          {/* Centrada en la mitad derecha (no pegada al borde); entra desde fuera de la página. */}
          <EnterFromRight className="hidden justify-self-center lg:block">
            <picture aria-hidden>
              <source type="image/avif" srcSet={picture.avif} />
              <img
                src={picture.src}
                srcSet={picture.webp}
                alt=""
                width={contact.art.width}
                height={contact.art.height}
                loading="lazy"
                decoding="async"
                className="h-auto w-[12.5rem]"
              />
            </picture>
          </EnterFromRight>
        </div>
      </div>
    </Section>
  )
}
