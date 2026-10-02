import { Section } from '../../../components/Section'
import { site } from '../../../content/site'

/** Fase 2: fragmentos estáticos. El revelado por scroll llega en la fase 3. */
export function KineticHeadline() {
  const { kinetic } = site
  return (
    <Section id="cinetico" className="py-24 sm:py-32">
      <h2 className="wrap text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
        {kinetic.fragments.map((fragment, i) => (
          <span key={i} className="block">
            {fragment}{' '}
          </span>
        ))}
      </h2>
    </Section>
  )
}
