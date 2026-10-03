import type { CarouselItem, SiteContent } from './types'

/*
 * Contenido de relleno. Todos los textos de la web viven aquí; los
 * componentes solo los renderizan. Sustituir por el contenido definitivo.
 */

const placeholderImage = (n: number, alt: string) => ({
  src: `/media/placeholder-${n}.svg`,
  alt,
  width: 600,
  height: 800,
})

const carouselItems: CarouselItem[] = Array.from({ length: 8 }, (_, i) => ({
  name: `Nombre Apellido ${i + 1}`,
  role: i % 2 === 0 ? 'Ponente · Institución' : 'Patrocinador',
  image: placeholderImage((i % 4) + 1, `Retrato de relleno ${i + 1}`),
}))

export const site: SiteContent = {
  meta: {
    title: 'Congreso de Museos',
    description: 'Encuentro profesional sobre museos, patrimonio y públicos.',
    lang: 'es',
  },

  a11y: {
    skipLink: 'Saltar al contenido',
  },

  preloader: {
    label: 'Cargando experiencia 3D',
  },

  underConstruction: {
    enabled: false,
    title: 'Sitio en construcción',
    body: 'Muy pronto estaremos en línea.',
  },

  nav: {
    ariaLabel: 'Principal',
    menuLabel: 'Abrir menú',
    closeLabel: 'Cerrar menú',
    logo: { label: 'Congreso', href: '#hero' },
    links: [
      { label: 'El congreso', href: '#presentacion' },
      { label: 'Por qué asistir', href: '#por-que' },
      { label: 'Ponentes', href: '#ponentes' },
      { label: 'Agenda', href: '#agenda' },
      { label: 'Inscripciones', href: '#inscripciones' },
    ],
  },

  hero: {
    eventName: 'Congreso de Museos',
    dateLabel: '00–00 de mes de 2027',
    dateTime: '2027-01-01',
    location: 'Ciudad, País',
    scrollHint: 'Desliza para explorar',
    poster: {
      src: '/media/poster.svg',
      alt: '',
      width: 1600,
      height: 900,
    },
  },

  intro: {
    title: 'Un titular de presentación que resume la propuesta del evento',
    subtitle:
      'Un subtítulo de apoyo de una o dos líneas que amplía el titular y explica a quién va dirigido el encuentro.',
    primaryCta: { label: 'Reserva tu plaza', href: '#inscripciones' },
    secondaryCta: { label: 'Ver agenda', href: '#agenda' },
  },

  whyAttend: {
    title: 'Por qué asistir',
    intro:
      'Párrafo introductorio de relleno que presenta los motivos principales para participar en el congreso.',
    cards: [
      {
        title: 'Motivo uno',
        body: 'Texto de relleno que describe el primer motivo en dos o tres líneas.',
      },
      {
        title: 'Motivo dos',
        body: 'Texto de relleno que describe el segundo motivo en dos o tres líneas.',
      },
      {
        title: 'Motivo tres',
        body: 'Texto de relleno que describe el tercer motivo en dos o tres líneas.',
      },
      {
        title: 'Motivo cuatro',
        body: 'Texto de relleno que describe el cuarto motivo en dos o tres líneas.',
      },
    ],
  },

  carousel: {
    bridge: 'Una frase puente que da paso a las personas que harán posible el congreso.',
    ariaLabel: 'Ponentes y patrocinadores',
    items: carouselItems,
  },

  kinetic: {
    fragments: ['Una frase', 'partida en', 'fragmentos que', 'se revelan', 'con el scroll.'],
  },

  threshold: {
    word: 'Entra',
  },

  description: {
    body: [
      { text: 'Párrafo descriptivo de relleno sobre el ' },
      { text: 'enfoque del congreso', highlight: true },
      { text: ', su historia y los ' },
      { text: 'ejes temáticos', highlight: true },
      { text: '. Explica a qué público se dirige y qué se llevará cada persona que asista. Debe ocupar entre tres y seis líneas en escritorio.' },
    ],
  },

  agenda: {
    title: 'Agenda',
    items: [
      { time: '09:00', title: 'Acreditaciones', description: 'Descripción breve de la actividad.' },
      { time: '10:00', title: 'Inauguración', description: 'Descripción breve de la actividad.' },
      { time: '11:00', title: 'Ponencia principal', description: 'Descripción breve de la actividad.' },
      { time: '12:30', title: 'Mesa redonda', description: 'Descripción breve de la actividad.' },
      { time: '14:00', title: 'Pausa', description: 'Descripción breve de la actividad.' },
      { time: '15:30', title: 'Talleres', description: 'Descripción breve de la actividad.' },
      { time: '17:30', title: 'Clausura', description: 'Descripción breve de la actividad.' },
    ],
  },

  registration: {
    open: false,
    headline: ['Reserva', 'tu plaza'],
    body: 'Texto de relleno que invita a inscribirse y resume condiciones y plazos.',
    cta: { label: 'Inscribirme', href: '#' },
    comingSoonLabel: 'Próximamente',
    comingSoonBody: 'Las inscripciones se abrirán en breve. Vuelve pronto.',
  },

  footer: {
    headlines: [
      { lines: ['Nos vemos', 'muy pronto'], align: 'left' },
      { lines: ['Abierto a ponentes', 'y patrocinadores'], align: 'right' },
    ],
    title: 'Contacto',
    emailLabel: 'Escríbenos',
    email: 'contacto@example.com',
    address: 'Dirección de relleno, 00000 Ciudad',
    socialLabel: 'Redes sociales',
    social: [
      { label: 'Instagram', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'YouTube', href: '#' },
    ],
    legal: '© 2027 Congreso de Museos. Contenido provisional.',
  },
}
