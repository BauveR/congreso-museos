import type { ActivitiesContent } from './types'

/*
 * Actividades paralelas (entre el programa y los participantes). Cada una
 * lleva dos fotos (WebP en public/media/actividades/).
 */

const SAN_SEBASTIAN = 'San Sebastián de La Gomera'

/** Foto en WebP de 720×540 (4:3, el formato de la tarjeta). */
const photo = (name: string, alt: string, width = 720, height = 540) => ({ src: `/media/actividades/${name}.webp`, alt, width, height })

export const activities: ActivitiesContent = {
  title: 'Actividades paralelas',
  seeMore: 'Ver más',

  items: [
    {
      id: 'parroquia',
      kind: 'Visita',
      title: 'Parroquia de Nuestra Señora de la Asunción',
      place: SAN_SEBASTIAN,
      images: [
        photo('parroquia-1', 'Fachada blanca de la iglesia de la Asunción, con su torre de piedra rojiza y dos portadas laterales, ante la plaza.'),
        photo('parroquia-2', 'Interior de la iglesia: nave con arcos de piedra rojiza, bancos de madera y el retablo del altar mayor al fondo.'),
      ],
      body: [
        {
          paragraphs: [
            'El edificio que sirve de sede a la Parroquia de Nuestra Señora de la Asunción en San Sebastián de La Gomera, matriz de la isla y por antigüedad uno de los primeros recintos de culto que tuvo el archipiélago en los territorios o dominios de señorío, se revela como un referente patrimonial de primer orden por la notoriedad de su fábrica y el conjunto de bienes que conserva en el interior. En este caso, continente y contenido son reflejo de una trayectoria dilatada y convulsa a lo largo del tiempo.',
            'Dichas razones avalan por sí solas su alta consideración, pero, además, se da la coyuntura de que el inmueble ha sido testigo y protagonista circunstancial de los sucesos más relevantes que ocurrieron en La Gomera durante las épocas Moderna y Contemporánea. A día de hoy es también un referente identitario de la localidad y de la propia isla, por lo que no extraña que reciba todo tipo de atenciones y se someta a análisis muy diversos por circunstancias que atañen a lo arqueológico, lo histórico, lo artístico y lo propiamente devocional.',
            'Esa suma de valores avalará su declaración como Bien de Interés Cultural con la categoría de «Monumento», en cuyo trámite o procedimiento administrativo trabajan desde 2025 el Cabildo Insular de La Gomera y el Gobierno de Canarias.',
          ],
        },
      ],
    },
    {
      id: 'museo-arqueologico',
      kind: 'Visita',
      title: 'Museo Arqueológico de La Gomera',
      place: SAN_SEBASTIAN,
      images: [
        photo('museo-1', 'Fachada roja del edificio del museo en una calle empedrada del casco de San Sebastián.'),
        photo('museo-2', 'Sala del museo con paneles, fotografías y una pieza expuesta en el centro sobre suelo de madera.'),
      ],
      body: [
        {
          paragraphs: [
            'La razón de ser del museo se basa en tres cuestiones. La primera es la muestra permanente del conocimiento general que tenemos sobre nuestras antiguas comunidades. Buena parte de la misión del museo la entendemos dentro de un concepto muy amplio de educación, dirigido a toda la comunidad en la que el personal del museo está incluido. La segunda es la conservación de los objetos, que incluye la información sobre cualquier aspecto de esta cultura, tanto material (objetos o lugares), como inmaterial. Y la tercera es la investigación, planteada en necesaria red con otras instituciones, empresas, asociaciones o particulares.',
            'Nuestra misión está gobernada por valores como implicación, trabajo en red, humildad, comunidad, exploración, territorio y sobre todo cercanía. Este museo es solo un punto de partida, una oportunidad en el territorio. En realidad, en su valor inmaterial radica su riqueza: esto es lo que hacemos, descubrimos, conservamos, aprendemos y compartimos.',
          ],
        },
      ],
    },
    {
      id: 'cuscoy',
      kind: 'Exposición',
      title: 'Luis Diego Cuscoy. Arqueología de la mirada',
      place: `Casa de Colón, ${SAN_SEBASTIAN}`,
      dates: '3-20 de noviembre de 2026',
      images: [
        photo('cuscoy-1', 'Fotografía en blanco y negro: un hombre de pie contempla un paisaje volcánico bajo un cielo de nubes.'),
        photo('cuscoy-2', 'Montaje de la exposición «Arqueología de la mirada»: paneles con fotografías y textos en una sala.', 632, 474),
      ],
      body: [
        {
          paragraphs: [
            'Se trata de una propuesta expositiva que rinde homenaje al legado visual de Luis Diego Cuscoy (1907-1987). A través de un recorrido inmersivo, la muestra explora la faceta del autor como cronista visual, rescatando la memoria de los paisajes, las gentes y el patrimonio arqueológico y etnográfico de Canarias. A Cuscoy se le conoce, sobre todo, como una de las figuras más destacadas de la arqueología canaria. Antes que arqueólogo fue poeta, maestro y teórico de la educación, luego periodista de opinión, etnógrafo, antropólogo, director de museo, naturalista, fotógrafo y otras facetas más que en conjunto lo definen como un hombre poliédrico.',
            'Su fondo fotográfico fue catalogado por Juan Francisco Navarro Mederos y restaurado y digitalizado por Tarek Ode, a partir de un proyecto financiado por la Dirección General de Cultura y Patrimonio Cultural del Gobierno de Canarias. La exposición, que ahora se exhibe en La Gomera, es una versión reducida de la original, encomendada a Ataraxia Nova.',
          ],
        },
      ],
    },
    {
      id: 'yapci-ramos',
      kind: 'Exposición',
      title: 'Yapci Ramos. yo, Guirre',
      place: 'Cabildo de La Gomera',
      dates: '5 de septiembre-21 de noviembre de 2026',
      images: [
        photo('yapci-1', 'La artista, con un traje plateado desplegado como alas, sobre fondo negro.'),
        photo('yapci-2', 'La artista, vestida de blanco, salta con la lanza del Salto del Pastor sobre una ladera rocosa.'),
      ],
      body: [
        {
          paragraphs: [
            'En yo, Guirre, Yapci Ramos explora las relaciones entre cuerpo, memoria y territorio desde sus raíces gomeras. A través del aprendizaje del Silbo Gomero y del Salto del Pastor, la artista incorpora saberes transmitidos entre generaciones y emprende una transformación en la que confluyen la mujer y el ave. El guirre, desaparecido de La Gomera, expande la mirada; el silbo, la voz; y el cuerpo.',
            'La exposición reúne estos tres elementos como símbolos de ascensión, vinculados a la singular geografía de la isla y a su legado cultural. Entre el arraigo y el vuelo, la obra propone una reflexión sobre la pertenencia y la libertad que surge al atravesar y asumir los propios límites.',
          ],
        },
      ],
    },
    {
      id: 'concierto',
      kind: 'Concierto',
      title: 'PielConPiel',
      images: [
        photo('concierto-1', 'Una cantante y un músico de Pieles en escena, iluminados en azul.'),
        photo('concierto-2', 'Dos intérpretes de Pieles en escena, a contraluz bajo una luz azul.'),
      ],
      body: [
        {
          paragraphs: [
            'La música es uno de los lenguajes codificados que el ser humano ha creado para su placer y comunicación, y constituye una extraordinaria invención de la mente y del espíritu.',
            'PIELCONPIEL emerge de la necesidad de comunicarnos. Es una propuesta artística que se aleja de lo espectacular y tecnológico para desarrollarse a través de un sonido orgánico y natural..., es un encuentro de miradas en formato de concierto íntimo en el que se desdibuja la frontera entre el personaje y la persona.',
            'En esta iniciativa la música se desnuda de la escena y el movimiento y, así, se desgranan los entresijos y los gérmenes de nuestros espectáculos para ser contados desde otro lenguaje..., la música; una de las expresiones creativas más íntimas de nuestra especie, que tiene la capacidad de identificarnos como seres y, además, como pueblo.',
          ],
        },
        {
          heading: 'Pieles',
          paragraphs: [
            'La compañía Pieles está formada por músicos polifacéticos que, sobre una misma impronta, ponen de relieve el movimiento, la emoción, la palabra, la melodía, la mirada... Un seleccionado elenco de representantes de la música actual de Canarias, especializados en distintos estilos musicales que abarcan desde la formación clásica hasta el folklore popular.',
            'Versátiles artistas y profesionales de la escena que se encuentran en constante contacto con las raíces culturales de nuestro archipiélago. Son, en definitiva, personas ocupadas en la difusión cultural que desde hace años han sumado su talento a diferentes propuestas artísticas desarrolladas desde una perspectiva creativa, y de respeto y amor por nuestras tradiciones.',
          ],
        },
      ],
    },
  ],
}
