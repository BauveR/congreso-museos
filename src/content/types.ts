/**
 * Identificadores de sección. Se usan como `id` (anclas del nav) y como
 * valor de `data-section` (rangos de scroll para ScrollTrigger y el 3D).
 */
export type SectionId =
  | 'hero'
  | 'acceso'
  | 'presentacion'
  | 'distinto'
  | 'por-que'
  | 'ponentes'
  | 'cinetico'
  | 'umbral'
  | 'sede'
  | 'previos'
  | 'saber-mas'
  | 'agenda'
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
  /** Logo (imagen) que enlaza al inicio; `label` es su nombre accesible. */
  logo: Link & { src: string; width: number; height: number }
  /** En escritorio: enlaces a la izquierda y a la derecha del logo centrado. */
  linksLeft: Link[]
  linksRight: Link[]
}

/** Presentación del congreso (sección bajo el hero). */
export interface PresentationContent {
  title: string
  /** Un elemento por párrafo. */
  body: string[]
}

/** Sede: tarjeta con foto y enlace a su web. */
export interface VenueContent {
  title: string
  name: string
  place: string
  /** Web de la sede (se abre en otra pestaña). */
  link: Link
  /** Foto en dos tamaños (WebP): `src` la grande y `srcSmall` la de móvil. */
  image: ImageAsset & { srcSmall: string; widthSmall: number }
}

/** Rasgo diferencial del congreso (tarjeta con título destacado). */
export interface DifferenceItem {
  /** Letra del rasgo (a, b, c). */
  kicker: string
  title: string
  /** Lo que sigue a los dos puntos del título. */
  subtitle: string
  body: string[]
}

/** «¿Qué será distinto…?» y «¿A qué aspira…?». */
export interface DifferencesContent {
  /** Título de la sección (Kola, color claro). */
  heading: string
  /** Primer apartado: «¿Qué será distinto…?». */
  title: string
  items: DifferenceItem[]
  aspiration: {
    title: string
    body: string[]
    /** Cierre destacado (llamada final). */
    closing: string[]
  }
}

export interface HeroContent {
  /** Edición del congreso: se muestra en tamaño gigante (p. ej. "V"). */
  edition: string
  eventName: string
  /** Lema del congreso: el titular grande del hero (una línea en escritorio). */
  headline: string
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

export interface CommitteeMember {
  name: string
  /** Cargo, institución y lugar. */
  affiliation: string
}

export interface CommitteesContent {
  scientific: {
    title: string
    intro: string
    members: CommitteeMember[]
  }
  organizing: {
    title: string
    groups: { role: string; members: CommitteeMember[] }[]
  }
}

/** Bloque de texto enriquecido: párrafo o lista. */
export type RichBlock = { p: string } | { list: string[] }

/** Tarjeta de la sección de organización (sesión con alegatorios o mesa plenaria). */
export interface OrganizationCard {
  /** Antetítulo pequeño (p. ej. "Mesa plenaria I"). */
  kicker?: string
  title: string
  /** Frase destacada bajo el título. */
  lead?: string
  body?: string[]
  /** Alegatorios: título y sus temas. */
  groups?: { title: string; points: string[] }[]
}

export interface OrganizationContent {
  title: string
  intro: string[]
  /** Tramos: texto fijo a la izquierda y tarjetas que suben a la derecha. */
  steps: { title: string; body: RichBlock[]; cards: OrganizationCard[] }[]
}

export interface ParticipantAuthor {
  name: string
  /** Semblanza (uno o varios párrafos); vacía si falta. */
  bio?: string[]
}

export interface Participant {
  /** Antetítulo de la tarjeta: tipo de conferencia o mesa. */
  kicker?: string
  /** Institución o procedencia. */
  org?: string
  authors: ParticipantAuthor[]
  /** Mostrar todos los nombres en la tarjeta (por defecto, con más de tres: dos y «y N más»). */
  allNames?: boolean
  /** Semblanza común a todos los autores (antes de las individuales). */
  sharedBio?: string[]
  title?: string
  /** Resumen; el primer párrafo sirve de vista previa. */
  abstract?: string[]
}

export interface ParticipantGroup {
  id: string
  label: string
  items: Participant[]
}

export interface ParticipantsContent {
  title: string
  intro: string
  groups: ParticipantGroup[]
  /** Textos de interfaz. */
  pending: string
  bioLabel: string
  abstractLabel: string
  close: string
  prev: string
  next: string
  /** «y N más» en las tarjetas con muchos autores. */
  moreAuthors: (n: number) => string
}

export interface KineticContent {
  /** Fragmentos de la frase; cada uno se revela por separado con el scroll. */
  fragments: string[]
}

/** Foto de la galería: ruta del original (ver services/imagekit.ts) y texto alternativo. */
export interface GalleryImage {
  file: string
  alt: string
}

/** Slider de fotos bajo la frase cinética. */
export interface GalleryContent {
  /** Nombre del carrusel para lectores de pantalla. */
  label: string
  prev: string
  next: string
  images: GalleryImage[]
}

/** Transición con zoom a través de la palabra y paso a tema claro. */
export interface ThresholdContent {
  word: string
}

/** Comunicación o ponencia asociada a una mesa técnica. */
export interface TechnicalTablePaper {
  /** Frase que la presenta («Dado su contenido, en ella tiene cabida…»). */
  intro: string
  item: Participant
}

export interface TechnicalTable {
  kicker: string
  title: string
  place: string
  date: string
  /** Fecha ISO para <time>. */
  dateTime: string
  participantsIntro: string
  participants: string[]
  paper?: TechnicalTablePaper
}

export interface PreviousContent {
  title: string
  /** Párrafos que se «encienden» palabra a palabra con el scroll. */
  body: string[]
  /** Entrada a las tarjetas. */
  lead: string
  /** Mesas técnicas: tarjetas apiladas. */
  tables: TechnicalTable[]
  /** Textos de interfaz. */
  readPaper: string
  showAll: (n: number) => string
  showLess: string
}


/** Una actividad de una franja horaria (puede haber varias en paralelo). */
export interface ProgramEntry {
  title: string
  /** Líneas de detalle: ponente, responsables, coordinación… */
  notes?: string[]
  /** Elementos listados (p. ej. lugares de las visitas libres). */
  list?: string[]
}

/** Comunicación de una mesa plenaria. */
export interface ProgramTalk {
  authors: string
  title: string
}

export interface ProgramItem {
  time: string
  entries: ProgramEntry[]
  talks?: ProgramTalk[]
}

export interface ProgramDay {
  /** Fecha ISO (AAAA-MM-DD). */
  date: string
  /** Etiqueta corta para los botones de día en móvil. */
  short: string
  label: string
  parts: { title: string; items: ProgramItem[] }[]
}

export interface ProgramContent {
  title: string
  /** Texto de los botones de día (móvil). */
  daysLabel: string
  showTalks: (n: number) => string
  hideTalks: string
  days: ProgramDay[]
}

export interface ContactContent {
  title: string
  intro: string
  cta: Link
  email: string
  address: string
}

export interface TopicBlock {
  /** Subtítulo del bloque (los alegatorios tienen uno o dos). */
  heading?: string
  paragraphs: string[]
}

/** Mesa plenaria o alegatorio: preguntas de partida y texto extenso. */
export interface DebateTopic {
  kicker: string
  title: string
  questions?: string[]
  blocks: TopicBlock[]
}

export interface MoreInfoContent {
  title: string
  body: string[]
  plenaryLabel: string
  plenary: DebateTopic[]
  sideLabel: string
  /** Frase que introduce los alegatorios. */
  sideLead: string
  side: DebateTopic[]
  questionsLabel: string
  topicsLabel: string
  readMore: string
  close: string
}

export interface AccessContent {
  title: string
  intro: string
  /** Texto mientras carga el estado de la sesión. */
  loading: string
}

export interface FooterContent {
  socialLabel: string
  social: Link[]
  legal: string
  privacy: Link
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
  /** Textos de interfaz reutilizables (p. ej. desplegables). */
  ui: { readMore: string; readLess: string; seeAll: string; seeLess: string; scrollToContinue: string; close: string }
  preloader: { label: string }
  underConstruction: UnderConstructionContent
  nav: NavContent
  hero: HeroContent
  presentation: PresentationContent
  differences: DifferencesContent
  venue: VenueContent
  committees: CommitteesContent
  organization: OrganizationContent
  participants: ParticipantsContent
  kinetic: KineticContent
  gallery: GalleryContent
  threshold: ThresholdContent
  previous: PreviousContent
  moreInfo: MoreInfoContent
  program: ProgramContent
  access: AccessContent
  contact: ContactContent
  footer: FooterContent
}
