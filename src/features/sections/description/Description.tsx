import { Section } from '../../../components/Section'
import { site } from '../../../content/site'

export function Description() {
  const { description } = site
  return (
    <Section id="descripcion" className="py-24 sm:py-32">
      <div className="wrap">
        <p className="max-w-3xl text-xl leading-relaxed text-texto-suave sm:text-2xl">{description.body}</p>
      </div>
    </Section>
  )
}
