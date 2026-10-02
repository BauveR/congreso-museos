/**
 * Identificadores de sección. Se usan como `id` (anclas del nav) y como
 * valor de `data-section` (rangos de scroll para ScrollTrigger y el 3D).
 */
export type SectionId =
  | 'hero'
  | 'presentacion'
  | 'por-que'
  | 'ponentes'
  | 'cinetico'
  | 'descripcion'
  | 'agenda'
  | 'inscripciones'
  | 'contacto'

export interface Link {
  label: string
  href: string
}

export interface ImageAsset {
  src: string
  alt: string
  width: number
  height: number
}

export interface NavContent {
  logo: { label: string; href: string }
  links: Link[]
}

export interface HeroContent {
  eventName: string
  /** Fecha legible para humanos. */
  dateLabel: string
  /** Fecha ISO para el elemento <time>. */
  dateTime: string
  location: string
  scrollHint: string
  poster: ImageAsset
}

export interface IntroContent {
  title: string
  subtitle: string
  primaryCta: Link
  secondaryCta: Link
}

export interface FeatureCard {
  title: string
  body: string
}

export interface WhyAttendContent {
  title: string
  intro: string
  cards: FeatureCard[]
}

export interface CarouselItem {
  name: string
  role: string
  image: ImageAsset
  /** Video opcional que se reproduce al hover en dispositivos con puntero fino. */
  video?: string
}

export interface CarouselContent {
  bridge: string
  ariaLabel: string
  items: CarouselItem[]
}

export interface KineticContent {
  /** Fragmentos de la frase; cada uno se revela por separado con el scroll. */
  fragments: string[]
}

export interface DescriptionContent {
  body: string
}

export interface AgendaItem {
  title: string
  time: string
  description: string
}

export interface AgendaContent {
  title: string
  items: AgendaItem[]
}

export interface RegistrationContent {
  /** Flag: con `false` se muestra el estado "Próximamente". */
  open: boolean
  title: string
  body: string
  cta: Link
  comingSoonLabel: string
  comingSoonBody: string
}

export interface FooterContent {
  title: string
  email: string
  address: string
  social: Link[]
  legal: string
}

export interface SiteContent {
  meta: { title: string; description: string; lang: string }
  nav: NavContent
  hero: HeroContent
  intro: IntroContent
  whyAttend: WhyAttendContent
  carousel: CarouselContent
  kinetic: KineticContent
  description: DescriptionContent
  agenda: AgendaContent
  registration: RegistrationContent
  footer: FooterContent
}
