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
  | 'umbral'
  | 'descripcion'
  | 'agenda'
  | 'inscripciones'
  | 'contacto'

/** Icono del botón (ver el mapa en components/ButtonLink.tsx). */
export type LinkIcon = 'arrow' | 'ticket' | 'calendar' | 'mail'

export interface Link {
  label: string
  href: string
  icon?: LinkIcon
}

export interface ImageAsset {
  src: string
  alt: string
  width: number
  height: number
}

export interface NavContent {
  ariaLabel: string
  menuLabel: string
  closeLabel: string
  /** `mark` es el monograma del logo; `label` su nombre accesible. */
  logo: Link & { mark: string }
  /** En escritorio: enlaces a la izquierda y a la derecha del logo centrado. */
  linksLeft: Link[]
  linksRight: Link[]
}

export interface HeroContent {
  /** Edición del congreso: se muestra en tamaño gigante (p. ej. "V"). */
  edition: string
  eventName: string
  /** Fecha legible para humanos. */
  dateLabel: string
  /** Fecha ISO para el elemento <time>. */
  dateTime: string
  location: string
  /** Indicador de scroll en dos líneas. */
  scrollHint: [string, string]
  /** Texto corto en dos líneas de la fila inferior del hero. */
  descriptor: [string, string]
  /** Botones de la fila inferior del hero. */
  ctas: Link[]
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

export interface TextSegment {
  text: string
  /** Se muestra en color de acento. */
  highlight?: boolean
}

/** Transición con zoom a través de la palabra y paso a tema claro. */
export interface ThresholdContent {
  word: string
}

export interface DescriptionContent {
  /** Párrafo por segmentos para poder destacar palabras. */
  body: TextSegment[]
}

/** Titular de dos líneas; la segunda va en color de acento. */
export type TwoLineHeadline = [string, string]

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
  headline: TwoLineHeadline
  body: string
  cta: Link
  comingSoonLabel: string
  comingSoonBody: string
}

export interface FooterContent {
  headlines: { lines: TwoLineHeadline; align: 'left' | 'right' }[]
  title: string
  emailLabel: string
  email: string
  address: string
  socialLabel: string
  social: Link[]
  legal: string
}

export interface UnderConstructionContent {
  /** Flag: con `true` se muestra la página en construcción en lugar de la landing. */
  enabled: boolean
  title: string
  body: string
}

export interface SiteContent {
  meta: { title: string; description: string; lang: string }
  a11y: { skipLink: string }
  preloader: { label: string }
  underConstruction: UnderConstructionContent
  nav: NavContent
  hero: HeroContent
  intro: IntroContent
  whyAttend: WhyAttendContent
  carousel: CarouselContent
  kinetic: KineticContent
  threshold: ThresholdContent
  description: DescriptionContent
  agenda: AgendaContent
  registration: RegistrationContent
  footer: FooterContent
}
