import { legal } from './inscripcion'

/*
 * Aviso legal y declaración de accesibilidad (la política de privacidad, en
 * inscripcion.ts). Mismo formato: título, fecha y secciones [título, texto].
 */

export interface LegalPageContent {
  title: string
  updated: string
  sections: [string, string][]
}

export const legalNotice: LegalPageContent = {
  title: 'Aviso legal',
  updated: `Última actualización: ${legal.updated}.`,
  sections: [
    [
      'Titular de la web',
      `Esta web (www.congresodemuseosdecanarias2026.com) es de la ${legal.controller.charAt(0).toLowerCase()}${legal.controller.slice(1)}, encuentro organizado por el Gobierno de Canarias y el Cabildo Insular de La Gomera. Correo de contacto: ${legal.contactEmail}.`,
    ],
    ['Objeto', 'Informar sobre el V Congreso de Museos de Canarias (San Sebastián de La Gomera, 19 a 21 de noviembre de 2026), su programa y participantes, y gestionar las inscripciones, que son gratuitas.'],
    ['Condiciones de uso', 'Al navegar por la web aceptas usarla de forma lícita y no realizar acciones que puedan dañarla, impedir su funcionamiento o acceder a datos de otras personas. Para inscribirte necesitas una cuenta; eres responsable de que los datos que facilites sean ciertos.'],
    [
      'Propiedad intelectual',
      'Los textos, el diseño, las ilustraciones y las fotografías de esta web pertenecen a la organización del congreso o a sus autores y se usan con su permiso. Los logotipos de las instituciones son de sus titulares. Puedes citar y enlazar los contenidos indicando su origen; para otros usos, escríbenos.',
    ],
    ['Responsabilidad', 'Procuramos que la información sea exacta y esté actualizada, pero el programa puede cambiar. La organización no se hace responsable de interrupciones del servicio por causas técnicas ajenas ni del contenido de las webs externas a las que se enlace.'],
    ['Protección de datos', 'El tratamiento de los datos personales se explica en la política de privacidad.'],
    ['Legislación aplicable', 'Este aviso se rige por la legislación española, en particular la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI).'],
  ],
}

export const accessibilityStatement: LegalPageContent = {
  title: 'Declaración de accesibilidad',
  updated: `Declaración preparada el ${legal.updated}.`,
  sections: [
    [
      'Compromiso',
      `La ${legal.controller.charAt(0).toLowerCase()}${legal.controller.slice(1)} se compromete a hacer accesible esta web, de acuerdo con el Real Decreto 1112/2018, sobre accesibilidad de los sitios web del sector público, y con la norma UNE-EN 301549:2022 (que incorpora las pautas WCAG 2.1, nivel AA).`,
    ],
    ['Situación de cumplimiento', 'Esta web es parcialmente conforme con el Real Decreto 1112/2018 debido a las excepciones y la falta de conformidad de los aspectos que se indican a continuación.'],
    [
      'Contenido no accesible',
      'En el programa, los títulos de alegatorios, mesas y conferencias en blanco sobre verde tienen un contraste menor del recomendado. Algunas animaciones de la portada se mueven al desplazarse por la página; se detienen si tu sistema tiene activada la opción de reducir el movimiento.',
    ],
    [
      'Lo que sí ofrece',
      'Navegación completa con teclado, textos alternativos en las imágenes, formularios con etiquetas y mensajes de error asociados a cada campo, respeto de la preferencia de reducir el movimiento, y diseño adaptado a móviles y al zoom del navegador.',
    ],
    ['Preparación de esta declaración', 'Se ha preparado mediante una evaluación propia de la organización del congreso.'],
    [
      'Observaciones y contacto',
      `Si encuentras alguna barrera de accesibilidad, necesitas un contenido en otro formato o quieres hacer una sugerencia, escríbenos a ${legal.contactEmail}. Te responderemos en un plazo máximo de 20 días hábiles. Si necesitas adaptaciones para asistir al congreso, puedes indicarlo también en la inscripción.`,
    ],
    [
      'Procedimiento de aplicación',
      'Si tu solicitud no recibe respuesta satisfactoria en ese plazo, puedes presentar una reclamación ante la administración organizadora, conforme al artículo 13 del Real Decreto 1112/2018.',
    ],
  ],
}
