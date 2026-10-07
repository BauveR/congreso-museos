import type { PreviousContent } from './types'

/*
 * Previos: mesas técnicas convocadas en 2026 antes del congreso, con sus
 * entidades participantes y, en su caso, la comunicación asociada.
 */

const DG_CULTURA =
  'Dirección General de Cultura y Patrimonio Cultural. Consejería de Universidades, Ciencia e Innovación y Cultura, Gobierno de Canarias'
const OAMC = 'Organismo Autónomo de Museos y Centros. Cabildo de Tenerife'
const MUSEOS_GC = 'Servicio de Museos. Cabildo de Gran Canaria'
const RED_FV = 'Red de Museos y Centros. Cabildo de Fuerteventura'

export const previous: PreviousContent = {
  title: 'Previos',
  body: [
    'Por primera vez, el Congreso de Museos de Canarias posibilitó el desarrollo de mesas técnicas para abordar cuestiones monográficas con profesionales del sector de los museos y representantes de administraciones públicas, empresas o perfiles especializados, acordes al tema que se trata en ellas. Sus conclusiones, recogidas con la antelación suficiente en un documento a modo de decálogo, serán divulgadas en una de las conferencias previstas en el congreso, durante el sábado 21 de noviembre. En ella se expondrán también los avances operados en torno a la Red de Museos de Canarias.',
  ],
  lead: 'De acuerdo a la planificación previa, las mesas técnicas convocadas durante el año 2026 se corresponden con:',
  readPaper: 'Leer completa',
  showAll: (n) => `Ver las ${n} entidades`,
  showLess: 'Ver menos',

  tables: [
    {
      kicker: 'Mesa de trabajo',
      title: 'Educación y museos en Canarias',
      place: 'Archivo Histórico Provincial de Santa Cruz de Tenerife',
      date: '9 de junio de 2026',
      dateTime: '2026-06-09',
      participantsIntro: 'En ella participan los representantes y delegados de:',
      participants: [
        'Área de Patrimonio Natural, Social y Cultural Canario. Servicio de Innovación Educativa. Consejería de Educación, Formación Profesional, Actividad Física y Deportes, Gobierno de Canarias',
        DG_CULTURA,
        OAMC,
        MUSEOS_GC,
        RED_FV,
        'Cabildo de La Gomera',
        'LM Arte Colección',
        'Fundación Cristino de Vera',
        'Universidad de La Laguna',
      ],
    },
    {
      kicker: 'Mesa de trabajo',
      title: 'Turismo y museos en Canarias',
      place: 'Archivo Histórico Provincial de Las Palmas de Gran Canaria',
      date: '29 de septiembre de 2026',
      dateTime: '2026-09-29',
      participantsIntro: 'Cuenta con la participación de los representantes y delegados de:',
      participants: [
        'Gesprotur',
        'Promotur. Turismo de Islas Canarias',
        DG_CULTURA,
        OAMC,
        MUSEOS_GC,
        'Centros de Arte, Cultura y Turismo de Lanzarote. Cabildo de Lanzarote',
        RED_FV,
        'Cabildo de La Gomera',
        'Cabildo de La Palma',
        'Ayuntamiento de Los Llanos de Aridane',
        'Diócesis de Canarias',
        'Monasterio de Santa Clara de Asís, San Cristóbal de La Laguna',
        'FEDAC. Cabildo de Gran Canaria',
        'Fundación CajaCanarias',
        'Fundación César Manrique',
      ],
      paper: {
        intro: 'Dado su contenido, en ella tiene cabida la siguiente comunicación del V Congreso de Museos de Canarias:',
        item: {
          kicker: 'Comunicación',
          org: 'Museo Insular de La Palma',
          sharedBio: [
            'Las autoras desarrollan su actividad profesional en el Museo Insular de La Palma, institución museística dependiente del Cabildo Insular de La Palma.',
            'Ambas desarrollan labores de conservación, investigación, gestión y difusión del patrimonio cultural, así como proyectos vinculados a la museología, la mediación cultural y la puesta en valor de las colecciones y del patrimonio insular.',
          ],
          authors: [
            {
              name: 'Isabel Santos Gómez',
              bio: [
                'Licenciada en Historia del Arte por la Universidad de La Laguna y titulada en Conservación y Restauración de Bienes Culturales, especialidad en pintura y escultura policromada, por la Escuela Superior de Conservación y Restauración de Bienes Culturales de Madrid.',
              ],
            },
            {
              name: 'Zara Rodríguez Martín',
              bio: [
                'Conservadora-restauradora de Bienes Culturales y gestora cultural, graduada por la Universidad de Barcelona, Máster en Conservación y Restauración por la Universitat Politècnica de València y Máster en Gestión Cultural por la Universitat Oberta de Catalunya.',
              ],
            },
          ],
          title: '¿Museo recurso turístico o institución cultural? El Museo Insular de La Palma ante los desafíos de los museos canarios en un tiempo de transformación',
          abstract: [
            'En un territorio donde el turismo constituye uno de los principales motores económicos, los museos se enfrentan al reto de compatibilizar su función cultural con una creciente demanda vinculada al consumo turístico del patrimonio. Frente a planteamientos que presentan ambas dimensiones como realidades contrapuestas, esta comunicación analiza hasta qué punto es posible desarrollar modelos de gestión que integren la atención a los visitantes turísticos sin renunciar a la función social, educativa e identitaria del museo.',
            'Metodológicamente, el trabajo combina una aproximación teórica a las relaciones entre patrimonio, turismo e identidad cultural con el análisis de los datos de visitantes del Museo Insular de La Palma correspondientes a los años 2024 y 2025. El estudio permite observar el peso que tiene el público extranjero en la actividad de la institución, así como la evolución paralela del público local y regional.',
            'A partir de estos datos, se plantea una reflexión sobre el impacto del turismo en la gestión cotidiana de los museos, la adaptación de los discursos y recursos de mediación a públicos diversos y la necesidad de mantener estrategias de vinculación con la comunidad más allá de la afluencia de visitantes. El caso del Museo Insular de La Palma se presenta, así como un ejemplo representativo de los desafíos y oportunidades que afrontan los museos canarios en un contexto de transformación, marcado por la creciente interacción entre patrimonio, comunidad y turismo.',
          ],
        },
      },
    },
    {
      kicker: 'Mesa de trabajo',
      title: 'Arqueología y museos en Canarias: entrega de depósitos, conservación y consulta',
      place: 'Sociedad Científica El Museo Canario',
      date: '27 de octubre de 2026',
      dateTime: '2026-10-27',
      participantsIntro: 'En ella se contempla la participación de los representantes y delegados de:',
      participants: [
        'Sociedad Científica El Museo Canario',
        'Gobierno de Canarias',
        'Cabildo de La Palma',
        'Cabildo de La Gomera',
        'Cabildo de El Hierro',
        'Cabildo de Lanzarote',
        'Cabildo de Fuerteventura',
        'Cabildo de Tenerife',
        'Cabildo de Gran Canaria',
        'Universidad de La Laguna',
        'Universidad de Las Palmas de Gran Canaria',
        'Ayuntamiento de Puerto de la Cruz',
        'PRORED Sociedad Cooperativa',
        'Cultania. Gestión integral de la Cultura y el Patrimonio Histórico',
        'Tibicena. Arqueología y Patrimonio',
        'Arqueocanaria SL',
        'Arqueometra',
        'Tegue. Arqueología y gestión del Patrimonio',
        'Serventía. Patrimonio, innovación, comunicación',
      ],
      paper: {
        intro:
          'A tenor de su contenido, la ponencia marco de esta mesa técnica se corresponde con una propuesta de comunicación que fue aprobada para su participación en el V Congreso de Museos de Canarias:',
        item: {
          kicker: 'Ponencia marco',
          org: 'El Museo Canario',
          authors: [
            {
              name: 'María del Carmen Cruz de Mercadal',
              bio: [
                'Licenciada en Geografía e Historia, posee experiencia laboral desde el año 1995 en el Área Museística de la Sociedad Científica El Museo Canario. Es responsable de los fondos museísticos de dicha institución y ha trabajado de manera exclusiva desarrollando funciones documentales y de conservación preventiva, complementadas con las de investigación, difusión y exhibición.',
              ],
            },
          ],
          title: 'Los depósitos de materiales arqueológicos a través del caso de El Museo Canario: pasado, presente y futuro',
          abstract: [
            'En el año 2016, con motivo del primer Congreso de Museos de Canarias, El Museo Canario participó con una comunicación que abordaba los problemas en torno a los depósitos de materiales arqueológicos procedentes de las intervenciones arqueológicas realizadas en la isla de Gran Canaria. El objetivo de la ponencia, de diez minutos, era mostrar a los asistentes a esa primera reunión de profesionales de museos un análisis de los depósitos efectuados durante el intervalo de los años 2000–2016. Para ello, se plantearon los problemas detectados hasta entonces y se propuso una serie de posibles soluciones, que conllevaban un compromiso formal por parte de cada uno de los agentes implicados (Dirección General de Cultura y Patrimonio Cultural del Gobierno de Canarias, arqueólogos y museos receptores).',
            'Diez años después a aquel primer congreso de museos del año 2016, nada ha cambiado. Los museos continúan recibiendo cientos de cajas al año con problemas relacionados, en muchos de los casos, con la conservación preventiva y la documentación de las piezas; problemas que se activan en el momento en el que el objeto aflora a la superficie a raíz de una intervención arqueológica.',
            'Para este V Congreso de museos, se propone mostrar aquella situación de hace una década y la problemática actual, así como sugerir para el futuro un paquete mayor de posibles soluciones que conlleven, una vez más, una colaboración formal de cada una de las partes implicadas. A la par, la declaración de intenciones es posible por un principio rector de su planteamiento: «Esta convocatoria intentará combinar el análisis de la realidad museística actual con una reflexión orientada al futuro», por lo que podría darse el marco idóneo para establecer un proyecto colectivo futuro entre los museos arqueológicos insulares.',
          ],
        },
      },
    },
  ],
}
