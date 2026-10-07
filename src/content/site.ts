import { participants } from './participantes'
import { program } from './programa'
import type { SiteContent } from './types'

/*
 * Contenido de relleno. Todos los textos de la web viven aquí; los
 * componentes solo los renderizan. Sustituir por el contenido definitivo.
 */

export const site: SiteContent = {
  meta: {
    title: 'V Congreso de Museos de Canarias',
    description: 'Encuentro profesional sobre museos, patrimonio y públicos.',
    lang: 'es',
  },

  a11y: {
    skipLink: 'Saltar al contenido',
  },

  ui: {
    readMore: 'Leer más',
    readLess: 'Leer menos',
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
    logo: { label: 'V Congreso de Museos de Canarias, inicio', href: '#hero', mark: 'CM' },
    linksLeft: [
      { label: 'El Congreso', href: '#presentacion' },
      { label: 'Programa', href: '#agenda' },
      { label: 'Participantes', href: '#ponentes' },
    ],
    linksRight: [
      // Provisional: aún no hay sección de información práctica; apunta a la sede.
      { label: 'Información práctica', href: '#umbral' },
      { label: 'Inscripción', href: '#inscripciones' },
      { label: 'Contacto', href: '#contacto' },
    ],
  },

  hero: {
    edition: 'V',
    eventName: 'Congreso de Museos de Canarias',
    headline: 'Museos en un tiempo de cambios. Diagnosis y perspectiva',
    dateLabel: '19-21 de noviembre de 2026',
    dateTime: '2026-11-19',
    location: 'San Sebastián de La Gomera',
    intro: [
      'Los museos de Canarias atraviesan en la actualidad un momento decisivo, marcado por profundas transformaciones sociales, culturales, tecnológicas y territoriales que interpelan a sus funciones comunes y a los modos de relación con la ciudadanía o, lo que es lo mismo, a su razón de ser. En este contexto, la celebración del V Congreso de Museos de Canarias, que va a celebrarse entre el 19 y 21 de noviembre de 2026 en la isla de La Gomera, se concibe como un espacio estratégico de reflexión colectiva, debate profesional y construcción compartida de horizontes futuros.',
      'Lejos de entenderse únicamente como contenedores de bienes culturales, los museos se reconocen hoy como agentes activos del territorio, instituciones vivas que participan en la configuración de identidades, los procesos educativos, la mediación cultural y las dinámicas de desarrollo local. Esta evolución conceptual, alineada con los debates internacionales más recientes en torno a foros o congresos del sector, adquiere en las islas una dimensión específica por los efectos que generan sus desajustes territoriales, una diversidad cultural evidente, la historia diferenciada, una clara fragilidad medioambiental y, sobre todo, la necesidad de implementar modelos de desarrollo sostenibles.',
      'La elección de La Gomera como sede del V Congreso no es casual. Se trata de una isla donde la relación entre patrimonio cultural, paisaje, memoria colectiva y comunidad local resulta especialmente visible. En ella, la escala territorial permite pensar el museo no como una institución aislada, sino como parte de un ecosistema cultural interdependiente. Desde luego, dicha circunstancia se revela como una oportunidad única para La Gomera.',
      'El V Congreso de Museos aspira, por tanto, a convertirse en un laboratorio de ideas desde el que repensar el papel de los museos de Canarias en el siglo XXI.',
    ],
    scrollHint: ['Desliza', 'para explorar'],
    descriptor: ['Encuentro profesional sobre museos,', 'patrimonio y públicos'],
    ctas: [
      { label: 'Inscripciones', href: '#inscripciones', icon: 'ticket' },
      { label: 'Agenda', href: '#agenda', icon: 'calendar' },
    ],
    poster: {
      src: '/media/poster.svg',
      alt: '',
      width: 1600,
      height: 900,
    },
  },

  committees: {
    scientific: {
      title: 'Comité científico',
      intro:
        'Como es costumbre, el V Congreso de Museos cuenta con un comité científico que garantiza su desarrollo y la selección de las propuestas recibidas. En esta ocasión lo integran representantes de los museos isleños por medio de una representación diversa de su totalidad o diferente naturaleza:',
      members: [
        { name: 'Daniel Pérez Estévez', affiliation: 'El Museo Canario, Las Palmas de Gran Canaria' },
        { name: 'María José Alcántara Palop', affiliation: 'MIAC, Arrecife' },
        { name: 'Carmen Gloria Rodríguez Santana', affiliation: 'Casa de Colón, Las Palmas de Gran Canaria' },
        { name: 'Isabel Santos Gómez', affiliation: 'Museo Insular, Santa Cruz de La Palma' },
        { name: 'Juan Carlos Hernández Marrero', affiliation: 'Museo Arqueológico, San Sebastián de La Gomera' },
        { name: 'Carla Armas de León', affiliation: 'Fundación Cristino de Vera, San Cristóbal de La Laguna' },
        { name: 'Isidoro Hernández Sánchez', affiliation: 'Museo Arqueológico de Fuerteventura, Betancuria' },
        { name: 'Carlos Pallés Darias', affiliation: 'OAMC, Santa Cruz de Tenerife' },
        { name: 'Lorea Arija Bartolomé', affiliation: 'OAMC, Santa Cruz de Tenerife' },
        { name: 'Ruth Azcárate Miguel', affiliation: 'Casa de Carta-MHAT, Valle de Guerra' },
      ],
    },
    organizing: {
      title: 'Comité organizador',
      groups: [
        {
          role: 'Presidencia',
          members: [
          { name: 'Miguel Ángel Clavijo Redondo', affiliation: 'Director general de Cultura y Patrimonio Cultural, Gobierno de Canarias' },
          { name: 'Rosa Elena García Meneses', affiliation: 'Consejera de Cultura, Cabildo Insular de La Gomera' },
          ],
        },
        {
          role: 'Coordinación general e institucional',
          members: [
          { name: 'Guillermo J. de Diego Romero', affiliation: 'Jefe de Área de Cultura y Patrimonio Cultural, Gobierno de Canarias' },
          { name: 'Claudia Bethéncourt Bethéncourt', affiliation: 'Jefa de Servicio de Patrimonio Cultural, Gobierno de Canarias' },
          ],
        },
        {
          role: 'Secretaría general',
          members: [
          { name: 'Juan Alejandro Lorenzo Lima', affiliation: 'Personal técnico de Patrimonio Cultural, Gobierno de Canarias' },
          ],
        },
        {
          role: 'Secretaría técnica',
          members: [
          { name: 'Patricia Dávila Mamely', affiliation: 'Personal técnico de Gestión y Planeamiento Territorial y Medioambiental-Gesplan' },
          ],
        },
        {
          role: 'Colaboración en tareas de coordinación',
          members: [
          { name: 'Agapito Curbelo Sanz', affiliation: 'Jefe de Servicio de Cultura, Cabildo Insular de La Gomera' },
          { name: 'Juan Carlos Hernández Marrero', affiliation: 'Personal técnico de Patrimonio Cultural, Cabildo Insular de La Gomera' },
          ],
        },
        {
          role: 'Prensa y comunicación',
          members: [
          { name: 'Olga Patricia Maset Paredes', affiliation: 'Viceconsejería de Cultura y Patrimonio Cultural, Gobierno de Canarias' },
          { name: 'Claudia Pais García', affiliation: 'Personal técnico de Gestión y Planeamiento Territorial y Medioambiental-Gesplan' },
          ],
        },
      ],
    },
  },

  organization: {
    title: '¿Cómo nos organizaremos?',
    intro: [
      'El V Congreso de Museos de Canarias va a estructurarse en torno a tres ámbitos o bloques de contenidos, que vertebrarán primero seis alegatorios o conversatorios (dos en cada sesión de trabajo) y luego tres mesas temáticas o plenarias (una en cada sesión de trabajo). Por consiguiente, está previsto el desarrollo de dos mesas redondas en paralelo y, con posterioridad, una mesa plenaria de trabajo conjunto para todos los asistentes.',
      'Como es costumbre, las mesas plenarias posibilitarán la presentación o defensa de comunicaciones. Sus contenidos guardan relación con los tres bloques de contenidos, mientras que las mesas redondas o alegatorios contarán con una introducción y conducción por parte de los responsables o coordinadores. De este modo podrá profundizarse en temas concretos, dentro de las muchas posibilidades que genera el marco establecido.',
      'Las propuestas realizadas en torno a mesas redondas y mesas plenarias no se conciben como compartimentos estancos, sino, más bien, como ejes interrelacionados que permitirán abordar la complejidad del museo contemporáneo desde distintas perspectivas. Todas ellas comparten una preocupación común: el destino de los museos en los momentos de profundo cambio que vivimos.',
    ],
    steps: [
      {
        title: 'Contenidos',
        body: [
          { p: 'Los tres ámbitos o bloques de contenidos generales darán nombre a las tres mesas plenarias y estarán distribuidos en tres sesiones de trabajo. Se corresponden con estos asuntos generales:' },
          { list: ['Ámbito I: Narrativas y medios', 'Ámbito II: En torno a los objetos', 'Ámbito III: Contexto e interacción'] },
          { p: 'De acuerdo a lo señalado, durante el congreso tendrán lugar primero dos mesas redondas o alegatorios simultáneos y posteriormente nos uniremos todos en la mesa plenaria, cuyo objetivo final es desarrollar otro debate a modo de conclusión. Procederemos así en cada una de las tres sesiones previstas (jueves tarde, viernes mañana y viernes tarde).' },
          { p: 'Por eso es muy importante ser disciplinados en la participación y respetar los tiempos. De esta manera, al final de cada alegatorio y al comienzo de cada mesa podremos hacer un pequeño descanso estando todos y todas juntas. Los alegatorios estarán dirigidos por dos personas: una secretaria y una conductora, además de aquellos invitados a exponer brevemente su pensamiento sobre los temas propuestos. Los asuntos o contenidos de los alegatorios serán los siguientes:' },
        ],
        cards: [
          {
            title: 'Sesión I',
            groups: [
              {
                title: 'Alegatorio I.1: Museos en plural. El reto de la juventud',
                points: ['El museo en plural: las voces invisibilizadas', '¿Cómo llegar a la juventud sin TikTok?'],
              },
              {
                title: 'Alegatorio I.2: Ética y discursos en el contexto insular',
                points: ['La responsabilidad ética de los museos de Canarias'],
              },
            ],
          },
          {
            title: 'Sesión II',
            groups: [
              {
                title: 'Alegatorio II.1: El componente intangible. El museo de lo que no se ve',
                points: ['Narrar lo invisible. El patrimonio inmaterial en los museos de Canarias'],
              },
              {
                title: 'Alegatorio II.2: Políticas de conservación e investigación',
                points: [
                  'Políticas de conservación: ¿qué, por qué y para quién?',
                  'La investigación: un ámbito imprescindible en la identidad del museo',
                ],
              },
            ],
          },
          {
            title: 'Sesión III',
            groups: [
              {
                title: 'Alegatorio III.1: El desafío de la transformación en un entorno desigual',
                points: [
                  'Los museos ¿somos realmente transformadores? ¿hasta dónde llegamos?',
                  'Museos o centros de interpretación rurales en Canarias: ¿un pez fuera del agua?',
                ],
              },
              {
                title: 'Alegatorio III.2: Repensando… ¿recurso turístico o institución cultural?',
                points: ['El museo ¿recurso turístico o institución cultural?'],
              },
            ],
          },
        ],
      },
      {
        // Título añadido por paralelismo con "Contenidos" (no venía en el texto original).
        title: 'Mesas plenarias',
        body: [
          { p: 'Por otra parte, las mesas plenarias estarán compuestas por las comunicaciones seleccionadas previamente, teniendo cada intervención una duración de 10 minutos cada una. A su vez, las mesas estarán dirigidas por dos personas: una secretaria y una presidenta.' },
          { p: 'Como es de esperar, los contenidos de las tres mesas plenarias guardan relación con los alegatorios o mesas redondas previas. Sus temas se corresponden con:' },
        ],
        cards: [
          {
            kicker: 'Mesa plenaria I',
            title: 'Narrativas y medios',
            lead: 'Centrada en asuntos transversales como comunicación, educación y tecnologías.',
            body: [
              'A través de un enfoque interdisciplinar, se propone examinar los fundamentos que sustentan las prácticas comunicativas en los museos actuales. El debate permitirá explorar estrategias que articulen tecnología y didáctica desde una perspectiva integradora, incorporando el rigor científico. El objetivo de esta mesa reside en promover una reflexión crítica sobre el uso responsable, ético y contextualizado de la tecnología en los museos de Canarias, atendiendo a la realidad de los centros y las necesidades de sus públicos.',
            ],
          },
          {
            kicker: 'Mesa plenaria II',
            title: 'En torno a los objetos',
            lead: 'Prevista en torno a la democratización del acceso a la información: objeto, conservación, colecciones, seguridad.',
            body: [
              'La presente mesa trabajará las relaciones entre objeto, conservación, colecciones y seguridad, en diálogo con los paradigmas de acceso abierto y transparencia informativa. A través del intercambio de experiencias profesionales y marcos teóricos, se busca contribuir a la construcción de modelos de gestión que integren la salvaguarda del patrimonio con su función social y educativa.',
            ],
          },
          {
            kicker: 'Mesa plenaria III',
            title: 'Contexto e interacción',
            lead: 'Reivindica aspectos asociados con el museo fuera del museo: redes, sostenibilidad y contexto.',
            body: [
              'La inclusión de esta mesa de trabajo refuerza el carácter del V Congreso como un espacio no solo de exposición teórica, sino para identificar e intercambiar líneas estratégicas, formular recomendaciones y sentar las bases para futuras colaboraciones interinstitucionales. Partimos de la premisa de que ningún museo o centro de interpretación existe al margen de su contexto. En Canarias, donde la escala territorial y la diversidad insular condicionan de manera decisiva la acción cultural, esta relación adquiere una relevancia particular. En ese sentido, la mesa III se revela como una llamada para avanzar hacia museos más abiertos, conectados y comprometidos con la población y el desarrollo de Canarias.',
            ],
          },
        ],
      },
    ],
  },

  participants,

  kinetic: {
    fragments: ['Una frase', 'partida en', 'fragmentos que', 'se revelan', 'con el scroll.'],
  },

  threshold: {
    word: 'INSCRÍBETE',
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

  // Programa completo en programa.ts (es largo).
  program,

  access: {
    title: 'Inscríbete',
    intro:
      'Crea tu cuenta para reservar tu plaza. Con ella podrás consultar, modificar o cancelar tu inscripción cuando quieras.',
    loading: 'Cargando…',
  },

  registration: {
    open: true,
    headline: ['Reserva', 'tu plaza'],
    body: 'Texto de relleno que invita a inscribirse y resume condiciones y plazos.',
    cta: { label: 'Inscribirme', href: '/inscripcion', icon: 'ticket' },
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
    legal: '© 2026 V Congreso de Museos de Canarias. Contenido provisional.',
    privacy: { label: 'Política de privacidad', href: '/privacidad' },
  },
}
