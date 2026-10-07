import type { ProgramContent, ProgramItem } from './types'

/*
 * Programa del V Congreso. Cada día tiene franjas (Mañana / Tarde y noche)
 * con sus horas; una hora puede tener varias actividades en paralelo
 * (alegatorios) y las mesas plenarias, sus comunicaciones.
 */

const t = (time: string, title: string, notes?: string[], extra: Partial<ProgramItem> = {}): ProgramItem => ({
  time,
  entries: [{ title, ...(notes ? { notes } : {}) }],
  ...extra,
})

export const program: ProgramContent = {
  title: 'Programa',
  daysLabel: 'Elige el día',
  showTalks: (n) => `Ver comunicaciones (${n})`,
  hideTalks: 'Ocultar comunicaciones',
  days: [
    {
      date: '2026-11-19',
      short: '19 nov',
      label: '19 de noviembre',
      parts: [
        {
          title: 'Mañana',
          items: [
            t('10:00 h', 'Recepción'),
            t('10:45 h', 'Inauguración institucional', ['Gobierno de Canarias y Cabildo Insular de La Gomera']),
            t('11:15 h', 'Ponencia inaugural', ['XXXXXXX (Ministerio de Cultura, Madrid): título pendiente']),
            t('11:45 h', 'Descanso'),
            t('12:15 h', 'Presentación y explicación organizativa', [
              'Juan Carlos Hernández Marrero (Cabildo, La Gomera): Un congreso sobre museos en La Gomera… ¿Qué hacemos aquí?',
            ]),
            t('12:45 h', 'Conferencia', ['Javier E. Marrero Acosta (ULL): título pendiente']),
            t('14:00 h', 'Almuerzo'),
          ],
        },
        {
          title: 'Tarde y noche',
          items: [
            {
              time: '16:00 h',
              entries: [
                {
                  title: 'Alegatorio I.1: Museos en plural. El reto de la juventud',
                  notes: ['Responsables: Ruth Azcárate (Casa de Carta-MHAT) / Echedey Basso (Educación, Gobierno de Canarias)'],
                },
                {
                  title: 'Alegatorio I.2: Ética y discursos en el contexto insular',
                  notes: ['Responsables: Carmen Gloria Rodríguez (Casa de Colón) / Alejandro Vitaubet (Cultura, Gobierno de Canarias)'],
                },
              ],
            },
            t(
              '17:30 h',
              'Mesa plenaria I: Narrativa y medios',
              ['Coordinadores: Ruth Azcárate (Casa de Carta-MHAT) / Alejandro Vitaubet (Cultura, Gobierno de Canarias)'],
              {
                talks: [
                  { authors: 'Daniel Pérez Estévez (El Museo Canario)', title: 'Enfoque decolonial y patrimonio disperso. De Canarias a París' },
                  {
                    authors: 'Delia García Castro y Lorea Arija Bartolomé (OAMC)',
                    title: 'La contratación de servicios educativos en los museos: hacia modelos que garanticen la función educativa institucional',
                  },
                  {
                    authors: 'Alejandro de Vera Hernández (MUNA)',
                    title:
                      'El secreto para cautivar al público se esconde en lo más profundo del océano: conectando a las nuevas generaciones con el patrimonio natural marino a través del fenómeno viral del pez diablo',
                  },
                  {
                    authors: 'Juan Ismael Santana Ramírez y Roberto García Guerra (Casa Museo León y Castillo)',
                    title:
                      'De la necesidad educativa a la innovación museística: un modelo de transferencia entre la educación formal y la Casa Museo León y Castillo',
                  },
                  {
                    authors: 'Francisco J. Carreras Riudavets y Gregorio Rodríguez Herrera (ULPGC)',
                    title: 'Humanidades Digitales en la práctica museística canaria: del procesamiento textual al patrimonio inmaterial sonoro',
                  },
                  {
                    authors:
                      'Adassa Herrera Arteaga, Carmen Delia Armas Jerez, Esteban Llarena Arteaga, Vanessa Negrín, Juan Carlos Hernández Marrero y José Miguel Trujillo Mora (La Gomera)',
                    title: 'La acción patrimonial comunitaria, una oportunidad para los museos-cenicienta de Canarias',
                  },
                ],
              },
            ),
            {
              time: '19:30 h',
              entries: [
                {
                  title: 'Actividades en el centro de San Sebastián de La Gomera (visitas libres)',
                  list: [
                    'Videoinstalación Yo, Guirre de Yapci Ramos (Cabildo de La Gomera)',
                    'Exposición Arqueología de la mirada. La obra fotográfica de Luis Diego Cuscoy (Casa de Colón)',
                    'Colección permanente Museo Arqueológico de La Gomera',
                    'Parroquia de Nuestra Señora de la Asunción',
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      date: '2026-11-20',
      short: '20 nov',
      label: '20 de noviembre',
      parts: [
        {
          title: 'Mañana',
          items: [
            {
              time: '9:30 h',
              entries: [
                {
                  title: 'Alegatorio II.1: El componente intangible. El museo de lo que no se ve',
                  notes: ['Responsables: Mari Carmen Naranjo (ICDC) / Eliseo G. Izquierdo (LM Arte Colección)'],
                },
                {
                  title: 'Alegatorio II.2: Políticas de conservación e investigación',
                  notes: ['Responsables: María García (MUNA) / Juan Carlos Hernández (Cabildo La Gomera)'],
                },
              ],
            },
            t('11:00 h', 'Descanso'),
            t(
              '11:30 h',
              'Mesa plenaria II: En torno a los objetos',
              ['Coordinadores: Mari Carmen Naranjo (ICDC) / Eliseo G. Izquierdo (LM Arte Colección)'],
              {
                talks: [
                  {
                    authors: 'Milagros Álvarez Sosa (Casa Museo Cayetano Gómez Felipe)',
                    title: 'La melancolía de los objetos. Experiencias emocionales en lo aparentemente irrelevante',
                  },
                  {
                    authors: 'Javier Soler Segura y Josué Ramos Martín (Cultania)',
                    title:
                      '¿Una casa para lo intangible? Viabilidad, características y necesidades de un centro de interpretación para la salvaguarda de La Librea de El Palmar (Buenavista del Norte)',
                  },
                  { authors: 'Ruth María Rufino García (MUNA)', title: 'Dos cañones y una parábola' },
                  {
                    authors: 'Cristina Déniz Sosa, Mari Carmen Rodríguez Quintana y Beatriz Sánchez Montesdeoca (CAAM)',
                    title:
                      'Aproximación al proyecto de investigación «Iluminar el silencio. La investigación como herramienta para transformar la colección y el relato museístico»',
                  },
                  {
                    authors: 'Irene Cáceres Barrera, Mariano N. Hernández Ferrer, Marta Sansón y Nereida María Rancel Rodríguez (MUNA / ULL)',
                    title: 'Más allá de lo visible: hacia una colección de referencia de diatomeas en el Museo de Ciencias Naturales de Tenerife',
                  },
                  { authors: 'María García Morales (MUNA)', title: 'Los museos canarios desde la perspectiva de una caja' },
                ],
              },
            ),
            t('13:00 h', 'Presentación y defensa de los pósteres', ['Coordinadora: Milagros Álvarez Sosa']),
            t('13:30 h', 'Almuerzo'),
          ],
        },
        {
          title: 'Tarde y noche',
          items: [
            {
              time: '16:00 h',
              entries: [
                {
                  title: 'Alegatorio III.1: El desafío de la transformación en un entorno desigual',
                  notes: ['Responsables: Conchi Fagundo (centros La Gomera) / Ricardo Suárez (CEMFAC)'],
                },
                {
                  title: 'Alegatorio III.2: Repensando… ¿recurso turístico o institución cultural?',
                  notes: ['Responsables: Isidoro Hernández (MUAB) / Maite Aldunate (Diócesis de Canarias)'],
                },
              ],
            },
            t(
              '17:30 h',
              'Mesa plenaria III: Contexto e interacción',
              ['Coordinadores: Isidoro Hernández (MUAB) / Maite Aldunate (Diócesis de Canarias)'],
              {
                talks: [
                  {
                    authors: 'Belén del Pino Hurtado (El Museo Canario)',
                    title: 'Laboratorio de Innovación Cultural de El Museo Canario: experiencias de innovación social aplicadas al patrimonio',
                  },
                  {
                    authors: 'Inmaculada Hernández Chinea, Lorena García Noda, Jennifer Jara García y Alba Isabel Plasencia Ventura (La Gomera)',
                    title: 'Sobre puertas y ventanas: el enfoque comunitario en la gestión de los centros de interpretación de la isla de La Gomera',
                  },
                  {
                    authors: 'Estefanía González (MACEW) y Alfredo Díaz Gutiérrez (Fundación César Manrique)',
                    title: '¿Qué pintan los museos en la sociedad actual? ¿Hay que convertirlos en casitas de Bad Bunny?',
                  },
                  {
                    authors: 'María Cantó Domínguez (Cueva Pintada)',
                    title: 'Patrimonio y equidad: una experiencia para reducir las desigualdades en el acceso a la cultura',
                  },
                  { authors: 'Ruth Azcárate Miguel y Carmen Benito Mateo (OAMC)', title: '¿Hasta cuándo esperar para ser museos (im)pertinentes?' },
                  {
                    authors: 'AA VV (La Gomera)',
                    title: 'Una red de café y galletas. Las personas que conectan los museos y centros públicos de La Gomera',
                  },
                ],
              },
            ),
            t('19:30 h', 'Actividades en el centro de San Sebastián de La Gomera (visitas libres)'),
            t('20:00 h', 'Concierto Pieles', ['Plaza de la Parroquia de Nuestra Señora de la Asunción, San Sebastián de La Gomera']),
          ],
        },
      ],
    },
    {
      date: '2026-11-21',
      short: '21 nov',
      label: '21 de noviembre',
      parts: [
        {
          title: 'Mañana',
          items: [
            t('9:30 h', 'Conferencia', [
              'En clave interna: más alicientes para la red',
              'Organización, planificación e información actualizada sobre la Red de Museos',
              'Juan Alejandro Lorenzo Lima (Patrimonio, Gobierno de Canarias)',
            ]),
            t('10:30 h', 'Presentación y debate sobre conclusiones'),
            t('11:00 h', 'Descanso'),
            t('12:00 h', 'Ponencia de clausura', [
              'Aina Ferrero Horrach (Museu del Calçat i de la Indústria, Ajuntament Inca): Desacralizar el museo. 12+1 herejías para acercarnos a la sociedad',
            ]),
            t('13:00 h', 'Clausura'),
          ],
        },
      ],
    },
  ],
}
