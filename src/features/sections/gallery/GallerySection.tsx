import { Section } from '../../../components/Section'
import { Gallery } from './Gallery'

/**
 * Galería de fotos del congreso anterior, antes de Contacto. Conserva el id
 * «cinetico» (antes llevaba la frase cinética): la esfera 3D tiene su pose y
 * su color asociados a ese id en hero3d/timeline.config.ts.
 */
export function GallerySection() {
  return (
    <Section id="cinetico" className="overflow-x-clip py-10 sm:py-32">
      <Gallery />
    </Section>
  )
}
