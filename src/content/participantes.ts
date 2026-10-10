import type { ParticipantsContent } from './types'

/*
 * Participantes: conferencias, comunicaciones (por mesa, en orden de
 * programa) y pósteres. Las instituciones salen del programa.
 */

const MESA_I = 'Mesa I · Narrativa y medios'
const MESA_II = 'Mesa II · En torno a los objetos'
const MESA_III = 'Mesa III · Contexto e interacción'

export const participants: ParticipantsContent = {
  title: 'Participantes',
  intro:
    'El V Congreso de Museos reúne a una treintena de participantes vinculados con museos, universidades, administraciones públicas e instituciones culturales. Su relación es como sigue, a partir de las propuestas realizadas con antelación:',
  pending: 'Por confirmar',
  bioLabel: 'Semblanza',
  abstractLabel: 'Resumen',
  close: 'Cerrar',
  prev: 'Anteriores',
  next: 'Siguientes',
  moreAuthors: (n) => `y ${n} más`,
  groupsLabel: 'Tipo de participación',
  showMore: (n) => `Ver ${n} más`,

  groups: [
    {
      id: 'conferencias',
      label: 'Conferencias',
      items: [
        {
          kicker: 'Conferencia inaugural',
          authors: [],
        },
        {
          kicker: 'Conferencia marco. Red de Museos de Canarias',
          org: 'ULL',
          authors: [{ name: 'Javier Marrero Acosta' }],
        },
        {
          kicker: 'Conferencia de clausura',
          org: 'Museu del Calçat i de la Indústria, Ajuntament d’Inca',
          authors: [
            {
              name: 'Aina Ferrero Horrach',
              bio: [
                'Doctora en Historia del Arte, museóloga, profesora asociada de la Universitat de les Illes Balears y directora del Museu del Calçat i de la Indústria de Inca desde 2017, cuya transformación hacia un modelo social, participativo y comunitario ha obtenido reconocimiento internacional. Su trabajo se centra en la sociomuseología, los estudios de públicos y la participación, así como en la cultura visual y en nuevas formas de acercar el arte, los museos y el patrimonio a la sociedad.',
                'Desarrolla también una intensa labor divulgadora y actualmente conduce la sección semanal Salseo en el museo, dentro del programa Más de Uno Mallorca de Onda Cero, donde se acerca a las curiosidades de la historia del arte y de los museos desde el rigor, pero también desde el humor y una mirada desenfadada. Defiende los museos como espacios capaces de generar pensamiento crítico, cuestionar relatos e inercias y contribuir a una sociedad más crítica. Frente a la sobreinformación, la simplificación y la banalización cultural, reivindica su potencial como espacios de resistencia cultural, encuentro y reflexión colectiva.',
              ],
            },
          ],
          title: 'Desacralizar el museo. 12+1 herejías para acercarnos a la sociedad',
          abstract: [
            'El museo moderno heredó del siglo XIX mucho más que colecciones y edificios. También una determinada manera de entenderse a sí mismo: solemne, jerárquico y, en cierta medida, sacralizado. El museo como templo; los objetos como reliquias; las vitrinas como altares; la institución como voz autorizada y el visitante, preferiblemente, en respetuoso silencio. Aunque los museos han cambiado enormemente, parte de ese imaginario continúa condicionando cómo los percibimos y también cómo los hacemos.',
            'De ahí nacen las 12+1 herejías museológicas: de considerar casi «heréticas» algunas maneras contemporáneas de pensar el museo precisamente porque contradicen aquello que durante tanto tiempo se supuso que debía ser. A través de una selección de estas herejías, y con el humor y las ilustraciones de Helena Bosco como contrapunto, la conferencia desmontará algunos de esos dogmas poniéndolos en diálogo con experiencias concretas desarrolladas en el Museu del Calçat i de la Indústria de Inca: participación comunitaria, estudios de públicos, accesibilidad, incorporación de nuevas voces y otras formas de relacionarnos con las colecciones.',
            'Porque desacralizar el museo no significa restarle rigor ni importancia, sino acortar la distancia entre la institución y la sociedad. Y para hacerlo no hace falta ser un gran museo ni disponer de grandes presupuestos: los museos pequeños pueden convertirse en espacios especialmente fértiles para experimentar, escuchar y transformar.',
          ],
        },
      ],
    },

    {
      id: 'comunicaciones',
      label: 'Comunicaciones (mesas plenarias)',
      items: [
        // Mesa I
        {
          kicker: MESA_I,
          org: 'El Museo Canario',
          authors: [
            {
              name: 'Daniel Pérez Estévez',
              bio: [
                'Director de la Sociedad Científica El Museo Canario, institución que conserva, investiga y difunde el patrimonio histórico de Canarias desde 1879. Ha desarrollado su carrera profesional en la dirección de empresas y entidades educativas y culturales, y en la gestión de la sostenibilidad en empresas privadas.',
              ],
            },
          ],
          title: 'Enfoque decolonial y patrimonio disperso. De Canarias a París',
          abstract: [
            'Para conocer el patrimonio de Canarias disperso por el mundo es fundamental conocer la trazabilidad de las piezas, así como revisar las aproximaciones metodológicas y éticas en torno a su selección por parte de las instituciones museísticas europeas decimonónicas, ya que, conociendo la historia de dichos bienes, se configura también parte de la propia historia de los museos. En el actual enfoque decolonial de los museos, resulta esencial poner a las personas en el centro, mediante la puesta en valor del patrimonio en el exterior con la participación activa de su comunidad científica en la recuperación de bienes albergados en museos europeos continentales, en particular la comunidad científica experta en arqueología de Canarias.',
            'En esta tarea de considerables dimensiones, resultan de especial interés las piezas arqueológicas y documentales conservadas en París, en concreto en el actual Museo del’Homme y en el archivo de la biblioteca del Muséum National d’Histoire Naturelle, fruto de las relaciones mantenidas entre los responsables de El Museo Canario y la Société d’Anthropologie de París desde finales del siglo XIX.',
          ],
        },
        {
          kicker: MESA_I,
          org: 'OAMC',
          authors: [
            {
              name: 'Delia García Castro',
              bio: [
                'Licenciada en Derecho (2001) por la Universidad de La Laguna, posee experiencia en el ámbito de la contratación pública, concretamente en la tramitación de expedientes de contratos de servicios relacionados con actividades didácticas y actividades artísticas y culturales. Otras de sus áreas de especialización e interés profesional se centran la prevención de riesgos laborales y la modernización del sector público.',
              ],
            },
            {
              name: 'Lorea Arija Bartolomé',
              bio: [
                'Licenciada en Geografía e Historia, especialidad Arte Moderno y Contemporáneo, con formación especializada posterior. Ha desarrollado su actividad profesional en la consultoría de gestión documental, de contenidos y experiencia de usuario. Forma parte del Organismo Autónomo de Museos y Centros en 2107 como Técnica de Actividades Museísticas, y desde 2021 está vinculada al Servicio Común de Educación y Acción Cultural.',
              ],
            },
          ],
          title: 'La contratación de servicios educativos en los museos: hacia modelos que garanticen la función educativa institucional',
          abstract: [
            'La función educativa constituye uno de los pilares fundamentales de los museos. Sin embargo, muchas instituciones no cuentan con personal dedicado en exclusiva a estas funciones y recurren a la contratación de servicios especializados. Esta situación plantea la necesidad de avanzar hacia estructuras estables y profesionalizadas, que garanticen programas educativos coherentes y sostenidos en el tiempo. Precisamente por ello, la comunicación aborda un asunto relevante: si la educación constituye una función estratégica del museo, ¿cómo garantizar que siga siéndolo cuando se presta en mayor o menor medida mediante contratos?',
            'De ahí surge otra pregunta clave: ¿qué contratamos cuando contratamos educación en un museo? Si la educación es una de las misiones esenciales del museo, la contratación de los servicios, que no puedan ser asumidos por personal propio de la institución, debe configurarse como una herramienta de gestión orientada a garantizar su calidad y a generar valor público.',
          ],
        },
        {
          kicker: MESA_I,
          org: 'MUNA',
          authors: [
            {
              name: 'Alejandro de Vera Hernández',
              bio: [
                'Doctor en Biología (especialidad Marina) por la Universidad de La Laguna, ostenta el cargo de director del Museo de Ciencias Naturales de Tenerife (MUNA), habiendo ejercido previamente como conservador durante casi veinte años. Su investigación se centra en la biodiversidad pelágica de la Macaronesia, habiendo descrito nuevas especies y estudiado la evolución de los ecosistemas en entornos volcánicos submarinos.',
              ],
            },
          ],
          title:
            'El secreto para cautivar al público se esconde en lo más profundo del océano: conectando a las nuevas generaciones con el patrimonio natural marino a través del fenómeno viral del pez diablo',
          abstract: [
            'En la presente comunicación se analiza cómo un suceso biológico fortuito puede transformarse en una poderosa herramienta educativa y de alto impacto. El hallazgo excepcional de un ejemplar adulto de pez diablo negro (Melanocetus johnsonii) con vida, nadando en aguas superficiales de Tenerife en enero de 2025, desató un fenómeno mediático sin precedentes en las plataformas digitales, situando al Museo de Ciencias Naturales de Tenerife en el centro de la atención pública como institución depositaria del ejemplar. A pesar de ser una especie abisal de presencia confirmada científicamente desde hace décadas en la región macaronésica, su registro vivo en superficie —un hecho inédito a nivel global— despertó el imaginario colectivo, fuertemente influenciado por los iconos de la cultura audiovisual reciente.',
            'El Museo de Ciencias Naturales de Tenerife (MUNA) articuló una respuesta ágil e integradora. Tras la donación del espécimen, la institución implementó un protocolo de gestión exprés para musealizar el hallazgo antes de que disminuyera el interés del público. Se diseñó un módulo expositivo específico en las salas de exposición permanente, permitiendo la exhibición directa del ejemplar preservado junto a contenidos didácticos sobre el medio pelágico y abisal. Esta capacidad de reacción institucional permitió canalizar hacia el museo el impacto de las redes sociales, transformando la curiosidad digital en visitas físicas masivas, captando especialmente al público juvenil y familiar.',
          ],
        },
        {
          kicker: MESA_I,
          org: 'Casa-Museo León y Castillo',
          authors: [
            {
              name: 'Juan Ismael Santana Ramírez',
              bio: [
                'Licenciado en Historia (ULPGC) y Especialista Universitario en Archivística (UNED). Su labor profesional como técnico de museos la compagina con la investigación histórica, principalmente centrada en el estudio de la cultura del agua.',
              ],
            },
            {
              name: 'Roberto García Guerra',
              bio: [
                'Licenciado en Historia (ULPGC) y licenciado Documentación (UGR), Máster en Arqueología, especialización en Gestión del Patrimonio (UGR). Comenzó profesionalmente como conservador en el Museo Casa de Colón; actualmente es responsable del DEAC de la Casa-Museo León y Castillo.',
              ],
            },
          ],
          title: 'De la necesidad educativa a la innovación museística: un modelo de transferencia entre la educación formal y la Casa Museo León y Castillo',
          abstract: [
            'Esta comunicación presenta un estudio de caso sobre la transferencia de conocimiento entre el sistema educativo y el museo a partir de una necesidad detectada y puesta de manifiesto en el contexto de la Prueba de Acceso a la Universidad en Canarias para las materias de Latín II y Griego II. La incorporación de una obra de la colección de la Casa-Museo León y Castillo al examen de acceso genera una demanda por parte del profesorado y del alumnado de 2º de Bachillerato: la necesidad de conocer el bien in situ y disponer de herramientas específicas para su preparación.',
            'El análisis de esta dinámica pone de relieve un modelo de transferencia bidireccional entre educación formal y educación patrimonial, en el que el museo no actúa únicamente como proveedor de contenidos. Funciona como una institución capaz de escuchar las necesidades de la comunidad educativa, adaptar sus estrategias didácticas y generar recursos que revierten directamente en el aprendizaje y en la apropiación social del patrimonio.',
          ],
        },
        {
          kicker: MESA_I,
          org: 'ULPGC',
          authors: [
            {
              name: 'Francisco J. Carreras Riudavets',
              bio: [
                'Profesor en la ULPGC e investigador de la división de Lingüística Computacional y Aplicaciones Informáticas del IATEXT, del que es actualmente secretario y coordinador tecnológico. Doctor en Informática, su investigación se centra en el Procesamiento del Lenguaje Natural y el desarrollo de herramientas de tecnología lingüística aplicadas a las Humanidades.',
              ],
            },
            {
              name: 'Gregorio Rodríguez Herrera',
              bio: [
                'Catedrático de Filología Latina en la ULPGC e investigador de la división de Humanismo, Retórica y Tradición Clásica del IATEXT, del que es actualmente director. Con una amplia trayectoria en gestión, su trabajo promueve las tecnologías semánticas para democratizar el acceso al conocimiento humanístico y salvaguardar el patrimonio textual e inmaterial.',
              ],
            },
          ],
          title: 'Humanidades Digitales en la práctica museística canaria: del procesamiento textual al patrimonio inmaterial sonoro',
          abstract: [
            'La presente comunicación explora el impacto transformador de las Humanidades Digitales en el ecosistema museístico canario, tomando como referencia las herramientas desarrolladas por el Instituto Universitario de Análisis y Aplicaciones Textuales (IATEXT) de la ULPGC. En consonancia con la definición de museo del ICOM (2022) y la Ley 11/2019 de Patrimonio Cultural de Canarias, se analiza cómo la tecnología lingüística y el procesamiento de datos redefinen la mediación cultural, democratizando el acceso al patrimonio material e inmaterial y fomentando la participación ciudadana.',
            'Como balance prospectivo, y en estrecha vinculación con la reivindicación de lo local y el patrimonio inmaterial que vertebra este V Congreso, se presentará en primicia la versión beta de la Aplicación Texto-Silbo Gomero. Esta herramienta de traducción simultánea ha sido concebida para integrarse en el futuro Centro de Interpretación del Silbo Gomero, en el marco del Plan de Salvaguarda Digital impulsado por el Cabildo de La Gomera, la Asociación Cultural Silbo Gomero y el IATEXT. Dicho avance demuestra el enorme potencial ético y práctico de las Humanidades Digitales no solo para exhibir, sino para salvaguardar, transmitir y revitalizar lenguajes amenazados en el siglo XXI.',
          ],
        },
        {
          kicker: MESA_I,
          org: 'La Gomera',
          authors: [
            {
              name: 'Adassa Herrera Arteaga',
              bio: [
                'Técnico de archivos y museos, adscrita al Museo Etnográfico de La Gomera. Cursó estudios superiores en la ULL obteniendo la Licenciatura de Bellas Artes Conservación y Restauración en la Universidad Politécnica de Valencia. Su formación siempre ha estado vinculada a esta disciplina.',
              ],
            },
            {
              name: 'Carmen Delia Armas Jerez',
              bio: [
                'Auxiliar de museos, en el Museo Arqueológico de La Gomera. Licenciada en Pedagogía por la Universidad de La Laguna, es auxiliar administrativo en la recepción y recibimiento de los visitantes.',
              ],
            },
            {
              name: 'Esteban Llarena Arteaga',
              bio: [
                'Ayudante de Servicios Comunes en museos y centros dependientes de La Gomera. Trabaja para el Departamento de Cultura y Patrimonio Histórico del Cabildo Insular de La Gomera como ayudante de servicios comunes, además de ser personal de apoyo a diferentes actividades culturales realizadas en centros de dicha isla.',
              ],
            },
            {
              name: 'Vanessa Negrín',
              bio: [
                'Auxiliar de museos en el Museo Etnográfico de La Gomera. Su trayectoria se vincula esencialmente a dicho museo y otros de la isla, atendiendo en la actualidad a visitantes dos centros de interpretación: la Casa de Colón y la Casa de La Aduana.',
              ],
            },
            {
              name: 'Juan Carlos Hernández Marrero',
              bio: [
                'Técnico arqueólogo en la Unidad de Patrimonio-Museo Arqueológico de La Gomera. Licenciado en Filosofía y Letras con especialidad de Prehistoria y Arqueología por la UAM de Madrid, ha participado en excavaciones y en prospecciones en España, Francia, Chile e Inglaterra. Desde el año 2000 trabaja como técnico arqueólogo del Cabildo Insular y como responsable del Museo Arqueológico de La Gomera.',
              ],
            },
            {
              name: 'José Miguel Trujillo Mora',
              bio: [
                'Antropólogo sociocultural. Licenciado en Antropología Social y Cultural por la UNED (2013). Ha estado vinculado profesionalmente al Museo Arqueológico de La Gomera (Cabildo Insular) y a proyectos de desarrollo rural a través de asociaciones como AIDER La Gomera, así como otras empresas relacionadas con el desarrollo local.',
              ],
            },
          ],
          allNames: true,
          title: 'La acción patrimonial comunitaria, una oportunidad para los museos-cenicienta de Canarias',
          abstract: [
            'Esta comunicación revela el desarrollo de los ámbitos de educación e investigación en los museos de La Gomera: desde sus orígenes a cómo se han ido conformando los proyectos hasta ir llegando al concepto de la Acción Patrimonial Comunitaria (APC), con el propósito de sintetizar la experiencia de más de veinte años. Dicho recorrido está mediado por las condiciones objetivas de cada centro: el tamaño de nuestros complejos, número de trabajadores, financiación, dimensión de su exposición, calidad y cantidad de sus colecciones, la joven naturaleza de la disciplina científica que gobierna sus narrativas, su historia y su relación con un entorno insular.',
            'La acumulación de las experiencias evaluadas ha ido jerarquizando una serie de premisas teóricas, metodológicas y de gestión, que apuntan hacia la consecución de la misión que tienen nuestros museos y que cristalizan en el modelo de la APC. De todo ello se dará buena cuenta en la comunicación, concluyendo en dos premisas básicas: el necesario conocimiento/valoración del patrimonio y, al final, el protagonismo de la comunidad en las que se encuentran insertos los museos.',
          ],
        },

        // Mesa II
        {
          kicker: MESA_II,
          org: 'Casa Museo Cayetano Gómez Felipe',
          authors: [{ name: 'Milagros Álvarez Sosa' }],
          title: 'La melancolía de los objetos. Experiencias emocionales en lo aparentemente irrelevante',
          abstract: [
            'Los que trabajamos en un museo, los especialistas y el público interactuamos con los objetos de manera diferente. Por esta razón, las respuestas de los visitantes sobre lo que la exposición evoca y lo que proviene de su propio interior (recuerdos y emociones personales) es un área potencialmente importante. Tomando como referencia principal la colección de antigüedades de Cayetano Gómez Felipe, mostraremos las narrativas latentes en objetos supuestamente marginales y que parecen no ser dignos de ser «entronizados» en una vitrina.',
            'Su intensa «vida social» los convierte en versátiles. La mayoría de ellos nos sobreviven, pasan de una generación a otra, caen en diferentes manos, son desplazados a distintos lugares, pierden la función con las que nacieron, son manipulados para darles otras utilidades o finalmente abandonados, lo que hace que se conviertan en auténticas cápsulas del tiempo. El nuevo enfoque que proponemos nos ha llevado a trabajar otras formas de mirar y mostrar las obras a nuestro público, con el objetivo no solo de transmitir conocimiento, sino lograr que los visitantes sean también participantes activos en la construcción de significados del objeto.',
          ],
        },
        {
          kicker: MESA_II,
          org: 'Cultania',
          authors: [
            {
              name: 'Javier Soler Segura',
              bio: [
                'Arqueólogo, doctor en Prehistoria por la Universidad de La Laguna y Especialista en Gestión Arqueológica del Patrimonio Cultural por la Universidad de Santiago de Compostela. Desde 2015 es socio-director de la empresa Cultania, desde la que desarrolla actuaciones de gestión y divulgación del Patrimonio Cultural para colectivos, instituciones y administraciones públicas.',
              ],
            },
            {
              name: 'Josué Ramos Martín',
              bio: [
                'Licenciado en Historia por la Universidad de La Laguna. Experto en Turismo Gastronómico por el Basque Culinary Center. Ha coordinado diversos proyectos vinculados al patrimonio cultural desde la empresa Cultania, de la que es socio-director. Es miembro de ICOMOS-España y de su comisión de patrimonio cultural inmaterial.',
              ],
            },
          ],
          title:
            '¿Una casa para lo intangible? Viabilidad, características y necesidades de un Centro de Interpretación para la salvaguarda de La Librea de El Palmar (Buenavista del Norte)',
          abstract: [
            'Esta ponencia reflexiona sobre un aspecto clave de la museología contemporánea: la viabilidad de dotar de un soporte físico estable (un centro con propósito museístico) a una manifestación cuyo valor reside, precisamente, en su carácter inmaterial, vivo y cambiante. El punto de partida es el estudio de La Librea de El Palmar, una tradición festivo-ritual del municipio de Buenavista del Norte (Tenerife), cuya comunidad portadora lleva celebrándola desde hace décadas.',
            'A partir del análisis del Plan Museológico del Centro de Interpretación «Casa-Museo de Las Libreas de El Palmar» y de su documentación complementaria, esta ponencia valora si un equipamiento instalado en una edificación antigua puede dar a conocer, difundir y conservar un patrimonio que no cabe en una vitrina. La hipótesis que se defiende es que la viabilidad no depende de las posibilidades del centro para «contener» la tradición, sino de su capacidad para acompañarla: para funcionar como infraestructura de salvaguarda activa y no como depósito de reliquias.',
          ],
        },
        {
          kicker: MESA_II,
          org: 'OAMC',
          authors: [
            {
              name: 'Ruth María Rufino García',
              bio: [
                'Licenciada en Conservación-Restauración de Bienes Culturales por la Universidad de Granada. Ha ejercido como docente y, desde 2008, forma parte del Área de Conservación-Restauración del OAMC, donde continúa desarrollando su labor profesional. También ha participado en diversas jornadas, seminarios y congresos.',
                'Actualmente, dedica sus esfuerzos a apoyar y visibilizar la labor de las y los profesionales de la conservación-restauración en las instituciones dedicadas a la salvaguarda del patrimonio, subrayando la ineficacia o insuficiencia de los mecanismos actualmente existentes para el desarrollo de estas funciones.',
              ],
            },
          ],
          title: 'Dos cañones y una parábola',
          abstract: [
            'Esta comunicación propone un espacio de reflexión en torno a una pregunta fundamental para cualquier museo: ¿quién decide qué se conserva y por qué? Para ello, utilizando la metáfora del tiro parabólico de un proyectil lanzado por un cañón, se presenta el análisis comparativo de dos cañones hallados de manera casual y posteriormente incorporados a las colecciones del museo. Aunque ambos comparten origen, materialidad y potencial histórico, sus trayectorias dentro de la institución han sido notablemente diferentes.',
            'Más que señalar errores o establecer juicios, el objetivo de esta comunicación es abrir un debate profesional sobre los múltiples factores (técnicos, logísticos, institucionales, simbólicos y humanos) que influyen en la toma de decisiones. Aspira a activar preguntas que nos permitan comprender mejor cómo se construye (y a veces se condiciona) la vida de los objetos dentro del museo. Los dos cañones no son solo dos casos aislados: son una oportunidad para reflexionar sobre nuestras prácticas, nuestras prioridades y nuestras responsabilidades compartidas.',
          ],
        },
        {
          kicker: MESA_II,
          org: 'CAAM',
          authors: [
            {
              name: 'Cristina Déniz Sosa',
              bio: [
                'Licenciada en Bellas Artes por la ULL, Maestría en Creación de empresas Culturales y artísticas en la ULPGC. Conservadora y coordinadora de exposiciones desde 2016.',
              ],
            },
            {
              name: 'Mari Carmen Rodríguez Quintana',
              bio: [
                'Licenciada en Geografía e Historia, Sección Historia del Arte, por la Universidad de Salamanca. Conservadora y coordinadora de exposiciones desde 1995.',
              ],
            },
            {
              name: 'Beatriz Sánchez Montesdeoca',
              bio: [
                'Licenciada en Traducción e Interpretación por la Universidad de Granada. Diploma en Manifestaciones Culturales, Museos y Exposiciones Científicas, Marketing y Comunicación de la UP de Valencia. Conservadora y coordinadora de exposiciones desde 2008.',
              ],
            },
          ],
          title: 'Aproximación al proyecto de investigación «Iluminar el silencio. La investigación como herramienta para transformar la colección y el relato museístico»',
          abstract: [
            'Esta comunicación —y en esencia, la investigación en que se fundamenta— surge a raíz de la exposición Renovación y utopía. Colección CAAM (2017), dedicada a artistas de aquella década presentes en los fondos del museo. La revisión de dicha muestra permitió constatar la ausencia de creadoras que compartieron formación, espacios expositivos, proyectos y contextos de producción con sus compañeros de generación. Entre ellas destacamos a Lola del Castillo, María Jesús Pérez Vilar, Pepa Izquierdo, Elena Lecuona, Ana Quintero o Valme García Morán, cuyas contribuciones al panorama artístico canario habían quedado escasamente representadas en el relato institucional, a la vez que se evidenciaba una laguna significativa en la presencia de este periodo dentro de los fondos del museo.',
            'La ponencia presentará tanto la metodología desarrollada como los resultados obtenidos tras el análisis, materializados expositivamente y en primera instancia en la muestra Iluminar el silencio. Hacia una colección y un relato igualitarios, dedicada a Lola del Castillo y María Jesús Pérez Vilar, así como en una estrategia de incorporación de obras a la Colección CAAM. Se plantea así una reflexión sobre el papel de los museos en la revisión de sus propias narrativas y en la construcción de colecciones más representativas, inclusivas y acordes con el desarrollo de la historia del arte en Canarias.',
          ],
        },
        {
          kicker: MESA_II,
          org: 'MUNA / ULL',
          authors: [
            {
              name: 'Irene Cáceres Barrera',
              bio: [
                'Bióloga, graduada en la Universidad de La Laguna en 2020 con formación especializada. Actualmente, ocupa el cargo de conservadora en el Museo de Ciencias Naturales de Tenerife, donde se dedica a la revisión, catalogación y registro de las colecciones del museo, asegurando su preservación adecuada y facilitando su accesibilidad a toda clase de investigadores.',
              ],
            },
            {
              name: 'Mariano N. Hernández Ferrer',
              bio: [
                'Catedrático de Genética de la Universidad de La Laguna, es profesor con larga trayectoria en dicha universidad. Director de varias tesis, ha participado en proyectos internacionales, nacionales y autonómicos y cuenta con seis sexenios de investigación.',
              ],
            },
            {
              name: 'Marta Sansón',
              bio: [
                'Catedrática de la Universidad de La Laguna, bióloga y especializada en botánica marina. Su labor docente, investigadora y de gestión la ha desarrollado en dicha universidad durante cuarenta años. Su principal línea de investigación es el estudio de la biodiversidad vegetal marina (algas y fanerógamas marinas), sus hábitats y los cambios en las comunidades dominadas por macroalgas.',
              ],
            },
            {
              name: 'Nereida María Rancel Rodríguez',
              bio: [
                'Licenciada en Biología por la Universidad de La Laguna y doctora por la Universidad de Colonia (Alemania), es Profesora Ayudante Doctora del área de Botánica. Su trayectoria investigadora se ha desarrollado en instituciones nacionales e internacionales de reconocido prestigio, especializándose en la biodiversidad, taxonomía, filogenia y ecología de microalgas y cianobacterias.',
              ],
            },
          ],
          allNames: true,
          title: 'Más allá de lo visible: hacia una colección de referencia de diatomeas en el Museo de Ciencias Naturales de Tenerife',
          abstract: [
            'Con el objetivo de poner en valor el patrimonio biológico poco visible, el Museo de Ciencias Naturales de Tenerife ha iniciado la creación de una colección de referencia de diatomeas. El proyecto en torno a esa acción se concibe como un repositorio que integre diferentes tipos de materiales y datos asociados, incluyendo cultivos vivos, preparaciones microscópicas permanentes, imágenes de microscopía, muestras de ADN y bases de datos con información genética. La integración de estos recursos permitirá garantizar la preservación, trazabilidad y accesibilidad de los especímenes, facilitando futuras investigaciones.',
            'Los avances preliminares obtenidos hasta la fecha, a partir del estudio de dos especies recolectadas en el intermareal de Tenerife, ponen de manifiesto el potencial de este tipo de iniciativas para ampliar el conocimiento sobre la biodiversidad insular y evidencian la importancia de incorporar organismos microscópicos en las colecciones museísticas.',
          ],
        },
        {
          kicker: MESA_II,
          org: 'OAMC',
          authors: [
            {
              name: 'María García Morales',
              bio: [
                'Licenciada en Geografía e Historia, por la Universidad de La Laguna con formación especializada posterior, es responsable de la Unidad de Conservación-Restauración del Organismo Autónomo de Museos y Centros (OAMC), Museos de Tenerife, desde 1995.',
                'Los temas de almacenaje de colecciones: sostenibilidad, control climático, accesibilidad, mobiliario, soportes y embalajes ocupan una parte importante de su actividad e intereses profesionales.',
              ],
            },
          ],
          title: 'Los museos canarios desde la perspectiva de una caja',
          abstract: [
            'Los nuevos enfoques en la conservación del patrimonio cultural tangible auspiciados y difundidos por el ICOM incorporan, junto a los ya tradicionales de la investigación, recopilación, conservación y exhibición, por todos conocidos, los conceptos postmodernos de accesibilidad, inclusividad, sostenibilidad y fomento de la diversidad. Hay abundante literatura y foros sobre estos temas a nivel conceptual, que disminuye cuando se trata de plasmar conceptos en directrices de actuación. Esta comunicación persigue reflexionar si los museos canarios estamos logrando o cerca de lograr alguno de esos objetivos de la definición de Museos del ICOM, desde la perspectiva de una humilde caja de almacenaje. Las cajas que usamos —o no usamos— en nuestros almacenes, por ejemplo de colecciones de arqueología, son el reflejo de la urgente necesidad de tener debates para dar repuesta a problemas de fondo no del todo resueltos.',
          ],
        },

        // Mesa III
        {
          kicker: MESA_III,
          org: 'El Museo Canario',
          authors: [
            {
              name: 'Belén del Pino Hurtado',
              bio: [
                'Forma parte del equipo de la Sociedad Científica El Museo Canario, donde coordina proyectos de innovación social aplicados al patrimonio cultural. Su experiencia reciente incluye la coordinación de «Guardianes del Futuro: Inclusión e Innovación para Conocer Nuestra Historia (LegacIA)» y de «ConCiencia Joven. Laboratorio de Innovación Cultural Juvenil», iniciativas financiadas por la Agencia Canaria de Investigación, Innovación y Sociedad de la Información (ACIISI). Su trabajo se centra en el diseño, gestión y evaluación de proyectos que conectan patrimonio, educación, participación y tecnologías emergentes.',
              ],
            },
          ],
          title: 'El Laboratorio de Innovación Cultural de El Museo Canario: experiencias de innovación social aplicadas al patrimonio',
          abstract: [
            'Los museos afrontan el reto de relacionarse con públicos diversos mediante propuestas que combinen acceso al conocimiento, participación y experimentación. En respuesta, El Museo Canario desarrolla una línea de innovación social aplicada al patrimonio, que avanza con proyectos como Innocultura, LegacIA y ConCiencia Joven, todos financiados bajo distintas convocatorias de las Subvenciones destinadas a proyectos de Innovación Social de la Agencia Canaria de Investigación, Innovación y Sociedad de la Información (ACIISI).',
            'La comunicación examinará la continuidad entre dichos proyectos y el tránsito hacia un ecosistema de innovación cultural. Se presentarán los resultados y aprendizajes de LegacIA junto con el diseño metodológico de ConCiencia Joven, analizando la evolución del papel de los públicos, que pasan de utilizar soluciones digitales a participar en la creación de contenidos y nuevas formas de interpretar el patrimonio.',
          ],
        },
        {
          kicker: MESA_III,
          org: 'AIDER La Gomera',
          authors: [
            {
              name: 'Inmaculada Hernández Chinea',
              bio: [
                'Gerente de AIDER La Gomera desde 2003. Su trayectoria ha estado profundamente comprometida con la defensa del patrimonio como un bien común y una herramienta de transformación para el desarrollo rural. Convencida de que el futuro de los territorios se construye desde el conocimiento y el reconocimiento de su propia identidad, ha impulsado numerosos proyectos de valorización patrimonial y la creación de espacios de interpretación concebidos como lugares vivos de encuentro, aprendizaje y participación comunitaria.',
              ],
            },
            {
              name: 'Lorena García Noda',
              bio: [
                'Desarrolla su labor profesional en el Centro de Interpretación Casa de la Miel de Palma desde 2018, donde ha adquirido una amplia experiencia en la gestión, divulgación y dinamización del patrimonio local. Heredera de la tradición guarapera y de la cultura asociada al aprovechamiento de la palma canaria, su trayectoria le ha permitido conocer de primera mano el valor de este patrimonio y el papel que desempeñan los centros de interpretación en la vida de las comunidades rurales.',
              ],
            },
            {
              name: 'Jennifer Jara García',
              bio: [
                'Versátil y ávida de aprender, su trayectoria profesional combina la docencia en distintos niveles educativos, desde primaria hasta docencia para adultos, con especialización en atención a la diversidad. Graduada en Maestro de Educación Primaria (2022), desde 2023 es técnica en AIDER La Gomera, coordinando iniciativas de relevo generacional y emprendimiento femenino, y liderando proyectos de sostenibilidad ambiental.',
              ],
            },
            {
              name: 'Alba Isabel Plasencia Ventura',
              bio: [
                'Su trayectoria se ha desarrollado entre la arqueología, la educación patrimonial y el desarrollo rural, con especial atención a los procesos de transformación social y económica del medio rural. Es graduada en Historia por la Universidad de La Laguna y desde 2025 trabaja como técnica de desarrollo rural en AIDER La Gomera.',
              ],
            },
          ],
          allNames: true,
          title: 'Sobre puertas y ventanas: el enfoque comunitario en la gestión de los centros de interpretación de la isla de La Gomera',
          abstract: [
            'Los centros de interpretación gestionados por AIDER La Gomera responden a una concepción del patrimonio cultural diferente a la del museo tradicional: no custodian objetos inertes detrás de una vitrina, sino que ponen en valor una cultura viva, un saber hacer enraizado en el territorio y una comunidad que sigue siendo su protagonista.',
            'El punto de partida de estos proyectos es el propio territorio. Las iniciativas nacen desde dentro, desde el conocimiento profundo del mundo rural gomero y de las personas que lo habitan. En consecuencia, el patrimonio que interpretamos no es solo pasado: es presente y tiene que generar calidad de vida para la población local, alcanzando un equilibrio real entre memoria, identidad y sostenibilidad socioeconómica.',
          ],
        },
        {
          kicker: MESA_III,
          org: 'MACEW / Fundación César Manrique',
          authors: [
            {
              name: 'Estefanía González',
              bio: [
                'Profesora de secundaria y asesora de educación. Posteriormente vinculada al IEHC y al MACEW, donde fue responsable de su departamento pedagógico. Ha participado en congresos y organizado jornadas sobre arte contemporáneo.',
              ],
            },
            {
              name: 'Alfredo Díaz Gutiérrez',
              bio: [
                'Geógrafo, profesor de secundaria. Vinculado a la Fundación César Manrique, donde ha sido portavoz y es responsable de su departamento pedagógico. Ha participado como conferenciante en diferentes congresos y universidades españolas e investigador con publicaciones en diferentes ámbitos sobre territorio y arte.',
              ],
            },
          ],
          title: '¿Qué pintan los museos en la sociedad actual? ¿Hay que convertirlos en casitas de Bad Bunny?',
          abstract: [
            'Durante décadas, los museos han sido espacios de legitimación cultural donde se custodia el patrimonio. Sin embargo, en una sociedad marcada por la inmediatez digital, la sobreabundancia de información y la competencia por la atención, los museos afrontan un reto fundamental: seguir siendo relevantes para la ciudadanía. Es aquí donde aparece la segunda parte del título de esta comunicación: ¿Hay que convertir el museo en la casita de Bad Bunny?',
            'La referencia puede parecer provocadora, pero encierra una reflexión profunda sobre la relación entre las instituciones culturales y sus públicos. Con el tema La Mudanza de Bad Bunny se pone en valor una idea muy poderosa: la casa como espacio de pertenencia. La «casita» no es solo una vivienda, es el lugar donde uno se siente reconocido, donde puede entrar sin pedir permiso y se reúne con otros. Pero, sobre todo, es donde encuentra parte de su identidad y donde siempre tiene motivos para regresar.',
          ],
        },
        {
          kicker: MESA_III,
          org: 'Cueva Pintada',
          authors: [
            {
              name: 'María Cantó Domínguez',
              bio: [
                'Licenciada en Historia, con Máster en Gestión del Patrimonio Artístico y Arquitectónico, Museos y Mercado del Arte, con especialización en Gestión de Museos. Ha trabajado en Museos de Gran Canaria en diferentes puestos: visitas guiadas, DEAC, difusión y comunicación, estando en contacto con diferentes tipos de públicos, principalmente escolares, de todas las edades y ámbitos socioculturales.',
              ],
            },
          ],
          title: 'Patrimonio y equidad: una experiencia para reducir las desigualdades en el acceso a la cultura',
          abstract: [
            'El Museo y Parque Arqueológico Cueva Pintada se ubica en Gáldar, un municipio alejado de la capital insular, donde se concentra el mayor número de centros educativos de Gran Canaria. Esta circunstancia, unida al incremento experimentado por el coste del transporte en los últimos años, ha supuesto una importante limitación para que muchos centros, especialmente aquellos situados en contextos socioeconómicos más vulnerables, puedan acceder a este espacio patrimonial, fundamental para el conocimiento de la historia de los antiguos canarios.',
            'Ante esa realidad y aprovechando los recursos disponibles, se creó el proyecto Patrimonio Cuota Cero, una iniciativa destinada a eliminar las barreras económicas que dificultan el acceso al museo. Gracias a este programa, un gran número de centros y estudiantes de todas las edades ha podido visitar Cueva Pintada y participar en el programa educativo Tu Patrimonio, nuestro Patrimonio. Mediante actividades prácticas y el contacto con materiales vinculados a las investigaciones arqueológicas, esta propuesta fomenta el debate, la reflexión y el pensamiento crítico sobre la importancia de conocer, valorar y conservar el patrimonio cultural como un legado colectivo que pertenece a toda la sociedad.',
          ],
        },
        {
          kicker: MESA_III,
          org: 'OAMC',
          authors: [
            {
              name: 'Ruth Azcárate Miguel',
              bio: [
                'Licenciada en Historia del Arte (2002) por la Universidad de Valladolid, con formación posterior. Ha impulsado la celebración de varios Encuentros de Educación, Museos y Comunidad y está especialmente comprometida con el trabajo en comunidad y la participación ciudadana. Colabora activamente con comunidades de prácticas que reflexionan sobre el quehacer de los museos respecto de su función educativa, articulando propuestas de acción para que las instituciones culturales sean elementos transformadores de la sociedad.',
              ],
            },
            {
              name: 'Carmen Benito Mateo',
              bio: [
                'Licenciada en Filosofía y Letras (Geografía e Historia), especialidad Prehistoria y Arqueología, por la Universidad Autónoma de Madrid. Desde 2005 ejerce profesionalmente como conservadora y afronta tareas propias de la gestión museística, vinculadas al patrimonio arqueológico y su difusión. También ha dirigido su interés hacia la educación, desde el convencimiento de la función social que deben cumplir los museos.',
              ],
            },
          ],
          title: '¿Hasta cuándo esperar para ser museos (im)pertinentes?',
          abstract: [
            'Los museos afrontan en la actualidad el desafío de redefinir su papel en sociedades cada vez más diversas, complejas y atravesadas por desigualdades sociales, culturales y económicas. Partiendo de la definición de museo aprobada por el Consejo Internacional de Museos (ICOM), este trabajo reflexiona sobre la necesidad de consolidar instituciones culturales verdaderamente inclusivas, participativas y comprometidas con el bienestar colectivo. Frente a modelos tradicionales centrados en la conservación patrimonial y la transmisión unidireccional del conocimiento, se plantea la importancia de avanzar hacia una concepción del museo como bien común y como infraestructura social al servicio de la ciudadanía.',
            'Se concluye que la sostenibilidad futura de los museos dependerá de su capacidad para reconocer la pluralidad humana, promover la gobernanza participativa y fortalecer su función social. Solo mediante prácticas inclusivas, representativas y democráticas podrán consolidarse como instituciones relevantes, necesarias y defendidas por la ciudadanía como espacios públicos de encuentro, reflexión crítica, cohesión social y ejercicio efectivo de los derechos culturales para todas las personas.',
          ],
        },
        {
          kicker: MESA_III,
          org: 'La Gomera',
          authors: [
            { name: 'Inmaculada Hernández Chinea', bio: ['Gerente de Aider La Gomera. Centro de interpretación Casa de la miel de palma y Centro de interpretación del queso y el pastoreo.'] },
            { name: 'Lorena García Noda', bio: ['Técnica de Aider La Gomera. Centro de interpretación Casa de la miel de palma y Centro de interpretación del queso y el pastoreo.'] },
            { name: 'Jennifer Jara García', bio: ['Técnica de Aider La Gomera. Centro de interpretación Casa de la miel de palma y Centro de interpretación del queso y el pastoreo.'] },
            { name: 'Alba Isabel Plasencia Ventura', bio: ['Técnica de Aider La Gomera. Centro de interpretación Casa de la miel de palma y Centro de interpretación del queso y el pastoreo.'] },
            { name: 'José Miguel Trujillo Mora', bio: ['Antropólogo Cultural freelance, colaborador de los museos y centros de la isla de la Gomera (Cabildo Insular-Aider La Gomera).'] },
            { name: 'Adassa Herrera Arteaga', bio: ['Técnica de Archivos y Museos. Museo Etnográfico de La Gomera.'] },
            { name: 'Carmen Delia Armas Jerez', bio: ['Auxiliar de Museos. Museo Arqueológico de La Gomera.'] },
            { name: 'Esteban Llarena Arteaga', bio: ['Ayudante de Servicios Comunes. Museos y centros de dependientes del Cabildo Insular de La Gomera.'] },
            { name: 'Vanessa Negrín González', bio: ['Auxiliar de Museos. Museo Etnográfico de La Gomera.'] },
            { name: 'Juan Carlos Hernández Marrero', bio: ['Técnico Arqueólogo. Museo Arqueológico de La Gomera.'] },
            { name: 'Amparo Herrera Rodríguez', bio: ['Área de uso público del Parque Nacional Garajonay. Centro de visitantes de juego de bolas.'] },
            { name: 'Ricardo Dorta Cruz', bio: ['Área de uso público del Parque Nacional Garajonay. Centro de visitantes de juego de bolas.'] },
            { name: 'José Aguilar Darias', bio: ['Área de uso público del Parque Nacional Garajonay. Centro de visitantes de juego de bolas.'] },
            { name: 'Conchi Fagundo García', bio: ['Área de uso público del Parque Nacional Garajonay. Centro de visitantes de juego de bolas.'] },
          ],
          title: 'Una red de café y galletas. Las personas que conectan los museos y centros públicos de La Gomera',
          abstract: [
            'La isla de La Gomera cuenta con un ecosistema museal público pequeño, pero adaptado a sus posibilidades y en crecimiento. Desde hace dos años vienen realizándose reuniones del personal que trabaja en los centros que lo integran, rotando por cada uno de ellos. Los anfitriones se encargan de organizar los encuentros (programa de trabajo, duración, metodología, acuerdos). Las reuniones buscan, en primer lugar, ponernos al día en las exposiciones estables de cada uno de los centros, además se tocan temas de interés para todos como el tratamiento al visitante, las estadísticas y sus fluctuaciones, la tipología de visita, proyectos a corto y medio plazo, y otros aspectos que nos relacionan, nos interesan o nos preocupa. En ellos se hacen puestas en común para un conocimiento colectivo.',
            'Consideramos que el encuentro por sí mismo es fundamental, sin más objetivos. De él brotan preguntas, decisiones o nuevas perspectivas, nos conocemos más y fortalecemos eso que llamamos la no red. En esta comunicación se expondrá una serie de puntos que definen nuestra naturaleza y pueden ser de utilidad para los componentes del ecosistema museístico en Canarias.',
          ],
        },
      ],
    },

    {
      id: 'posteres',
      label: 'Pósteres',
      items: [
        {
          org: 'LUGAR, Gran Canaria',
          authors: [{ name: 'María Pérez Lorenzo' }],
          title: 'Del archivo al aula: diseño de plataformas digitales para la mediación del patrimonio documental local',
        },
        {
          org: 'ULPGC',
          authors: [{ name: 'Carolina Robayna Hernández' }],
          title: 'Colecciones epigráficas de la Edad Moderna en los museos de Canarias: criterios museísticos y propuesta didáctica',
        },
        {
          org: 'La Palma',
          authors: [{ name: 'María José Pérez Viña' }],
          title: 'Proyecto Saccharum: Habitar el cubo vacío. Mediación artística y alfabetización patrimonial en la fase de premusealización de la Casa Massieu',
        },
        {
          org: 'BULL',
          authors: [{ name: 'Joaquín Carreras Navarro' }],
          title: 'El archivo fotográfico Miguel Tarquis de la Biblioteca de La Universidad de La Laguna: introducción y apuntes sobre La Gomera',
        },
        {
          org: 'OAMC',
          authors: [{ name: 'Sara Marcano' }],
          title: 'Cuando los juguetes hablan: restaurar la materia, conservar su memoria. Conservación-restauración de una máquina de coser de juguete',
        },
        {
          org: 'Fundación Cristino de Vera',
          authors: [{ name: 'Karen Melián Kirloff' }],
          title: 'La Fundación Cristino de Vera como espacio educativo: reflexiones sobre los museos unipersonales',
        },
        {
          org: 'OAMC',
          authors: [{ name: 'Alberto González Rodríguez' }],
          title: 'Del papel a la pantalla: optimización de la gestión de colecciones mediante formularios digitales',
        },
        {
          org: 'Diócesis de Canarias',
          authors: [{ name: 'Maite Aldunate Ruano' }, { name: 'Cristina I. Soto Rodríguez' }],
          title: 'Virgen de la Leche: una pintura barroca americana sin identificar',
        },
        {
          org: 'La Gomera',
          authors: [
            { name: 'Amparo Herrera Rodríguez' },
            { name: 'José Aguilar Darias' },
            { name: 'Ricardo Dorta Cruz' },
            { name: 'Conchi Fagundo García' },
          ],
          allNames: true,
          title: 'Más allá de la exposición: el papel territorial del Centro de Visitantes de Juego de Bolas',
        },
      ],
    },
  ],
}
