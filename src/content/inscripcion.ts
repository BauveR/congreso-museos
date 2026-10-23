/*
 * Textos de inscripción, panel de administración y privacidad (el aviso
 * legal y la accesibilidad, en legales.ts). Titular identificado por el
 * nombre del congreso y su correo; si la entidad organizadora quiere
 * figurar con su razón social, NIF y dirección, se añaden aquí.
 */

export const legal = {
  controller: 'Organización del V Congreso de Museos de Canarias',
  contactEmail: 'vcongresodemuseosdecanarias@gmail.com',
  /** Fecha de la versión vigente de los textos legales. */
  updated: '23 de octubre de 2026',
}

export const registrationText = {
  pageTitle: 'Inscripción',
  intro:
    'Inscríbete en el V Congreso de Museos de Canarias. Necesitamos que inicies sesión para asociar la inscripción a tu correo y que puedas consultarla, modificarla o cancelarla después.',
  backHome: 'Volver a la web',

  signIn: {
    title: 'Inicia sesión para inscribirte',
    google: 'Continuar con Google',
    emailLabel: 'O recibe un enlace de acceso en tu correo',
    emailPlaceholder: 'tu@correo.com',
    emailSend: 'Enviar enlace',
    emailSent: 'Te hemos enviado un enlace de acceso. Ábrelo desde este mismo navegador.',
    emailConfirmLabel: 'Confirma tu correo para completar el acceso',
    emailConfirm: 'Acceder',
    linkFailed: 'El enlace no es válido o ha caducado (cada enlace sirve una sola vez). Pide uno nuevo.',
    newLink: 'Pedir un enlace nuevo',
    mockTitle: 'Modo de pruebas (sin Firebase)',
    mockHelp: 'Acceso simulado: los datos se guardan en memoria del servidor de desarrollo y se pierden al reiniciarlo.',
    mockName: 'Nombre y apellidos',
    mockEmail: 'Correo',
    mockAdmin: 'Entrar como administración',
    mockSubmit: 'Entrar',
    signedInAs: 'Sesión iniciada como',
    signOut: 'Cerrar sesión',
  },

  sections: {
    personal: 'Datos personales',
    professional: 'Datos profesionales',
    participation: 'Tipo de participación en el congreso',
    attendance: 'Asistencia',
    activities: 'Actividades complementarias',
    certificate: 'Certificado',
    accessibility: 'Accesibilidad',
    food: 'Alergias e intolerancias alimentarias',
    privacy: 'Protección de datos',
  },

  fields: {
    firstName: 'Nombre',
    lastName: 'Apellidos',
    email: 'Correo electrónico',
    emailHelp: 'Es el de tu cuenta: ahí recibirás la confirmación.',
    phone: 'Teléfono',
    phoneHelp: 'Con prefijo si no es de España (p. ej. +44 …).',
    city: 'Ciudad de procedencia',
    organization: 'Entidad / institución / organización',
    jobTitle: 'Cargo o profesión',
    participationType: 'Tipo de participación',
    participationHelp: 'Nos ayuda a identificar a ponentes, moderadores y organización.',
    participationPlaceholder: 'Elige una opción',
    attendanceHelp: 'Marca los días a los que asistirás.',
    remaining: (n: number) => (n === 1 ? 'Queda 1 plaza' : `Quedan ${n} plazas`),
    full: 'Completo',
    certificate: '¿Deseas certificado de asistencia?',
    certificateHelp: 'Se emite a quienes asisten al menos a 2 días del congreso (las actividades complementarias no cuentan).',
    certificateNeedsDays: 'Marca al menos 2 días del congreso para poder pedir el certificado de asistencia.',
    certificateLost: 'Con menos de 2 días del congreso no hay certificado de asistencia: se quitará al guardar, junto con tu documento de identidad.',
    yes: 'Sí',
    no: 'No',
    idType: 'Tipo de documento',
    idNumber: 'Número de documento',
    idHelp: 'Solo para emitir el certificado a tu nombre.',
    accessibility: '¿Tienes alguna necesidad específica de accesibilidad que debamos conocer para facilitar tu participación?',
    optional: 'Opcional',
    allergens: 'Marca los alérgenos que debamos tener en cuenta',
    otherAllergy: 'Otra alergia o intolerancia',
    diet: 'Preferencia alimentaria',
  },

  privacyInfo: [
    ['Responsable', `${legal.controller} (${legal.contactEmail}).`],
    ['Finalidad', 'Gestionar tu inscripción y participación en el congreso, enviarte comunicaciones sobre el mismo y, si lo solicitas, emitir tu certificado de asistencia.'],
    ['Legitimación', 'Tu consentimiento y la ejecución de la relación derivada de tu inscripción. Los datos de salud (accesibilidad y alergias) solo con tu consentimiento explícito.'],
    ['Destinatarios', 'No se cederán datos a terceros salvo obligación legal. Proveedores tecnológicos (alojamiento, base de datos y correo) actúan como encargados del tratamiento.'],
    ['Derechos', `Acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${legal.contactEmail}. Puedes reclamar ante la Agencia Española de Protección de Datos.`],
  ] as [string, string][],
  privacyMore: 'Información adicional en la',
  privacyLink: 'política de privacidad',

  consents: {
    privacy: 'He leído y acepto la política de privacidad y el tratamiento de mis datos para gestionar la inscripción.',
    healthData:
      'Consiento expresamente el tratamiento de los datos de accesibilidad y alergias que he indicado, solo para adaptar el congreso a mis necesidades.',
    image: 'Autorizo el uso de mi imagen en fotografías y grabaciones del congreso para su difusión. (Opcional)',
  },

  submitCreate: 'Enviar inscripción',
  submitUpdate: 'Guardar cambios',
  submitting: 'Enviando…',
  errorSummary: 'Revisa los campos marcados.',
  genericError: 'No se ha podido completar la operación. Inténtalo de nuevo.',
  closed: 'Las inscripciones aún no están abiertas. Vuelve pronto: lo anunciaremos en esta web.',
  /** Inscripción ya hecha con el plazo cerrado: no se puede modificar, pero sí cancelar. */
  closedChanges: 'El plazo de inscripción está cerrado: ya no se pueden hacer cambios, pero puedes cancelar.',
  /** Sin inscripción previa y todos los días completos. */
  allFull: 'Todas las plazas están ocupadas. Si quieres quedar en lista de espera, escríbenos desde la sección de contacto de esta web.',
  /** Error de la cuenta (no de la red) al cargar: sesión caducada o sin permiso. */
  accountProblemTitle: 'No hemos podido abrir tu inscripción',
  signOutAndRetry: 'Cerrar sesión y volver a entrar',
  backToSummary: 'Volver al resumen sin cambios',

  success: {
    created: 'Inscripción confirmada',
    updated: 'Cambios guardados',
    emailSent: (email: string) => `Te hemos enviado la confirmación a ${email}.`,
    emailFailed: 'La inscripción está guardada, pero no hemos podido enviarte el correo de confirmación.',
    summary: 'Resumen',
    edit: 'Modificar inscripción',
    cancel: 'Cancelar inscripción',
    cancelConfirm: 'Sí, cancelar mi inscripción',
    cancelKeep: 'No, mantenerla',
    cancelQuestion: '¿Seguro? Tus plazas quedarán libres para otras personas.',
    cancelled: 'Tu inscripción se ha cancelado.',
    newRegistration: 'Volver a inscribirme',
  },

  /** Panel de la inscripción: cada parte se modifica por separado (RegistrationPanel). */
  panel: {
    title: 'Tu inscripción',
    change: 'Modificar',
    days: 'Días y actividades',
    data: 'Tus datos',
    certificate: 'Certificado de asistencia',
    health: 'Accesibilidad y alimentación',
    image: 'Uso de tu imagen',
    imageYes: 'Autorizado',
    imageNo: 'No autorizado',
    nothing: 'Nada indicado',
    accessibility: 'Accesibilidad',
    allergens: 'Alérgenos',
    otherAllergy: 'Otra alergia',
    diet: 'Preferencia',
  },
}

/** Acceso y estado de la inscripción en la landing (tras el umbral). */
export const accessText = {
  tabs: { signUp: 'Crear cuenta', signIn: 'Ya tengo cuenta' },
  google: 'Continuar con Google',
  /** Al volver de Google por redirección (iOS que no es Safari). */
  signingInWithGoogle: 'Entrando con Google…',
  /** Navegador dentro de una app: Google bloquea ahí su acceso (error «disallowed_useragent»). Ver InAppBrowserNotice. */
  inApp: {
    title: (app: string | null) => (app ? `Estás dentro de la app de ${app}` : 'Parece que estás dentro de una app'),
    body: 'Google no permite iniciar sesión desde aquí. Abre esta página en tu navegador, o crea tu cuenta con correo y contraseña aquí abajo.',
    openChrome: 'Abrir en Chrome',
    copy: 'Copiar enlace',
    copied: 'Enlace copiado: pégalo en tu navegador',
    copyFailed: 'No se ha podido copiar solo. Mantén pulsado el enlace para copiarlo:',
    linkLabel: 'Enlace de esta página',
    iosHint: 'En iPhone: pulsa ··· o el icono de compartir y elige «Abrir en el navegador» (o «Abrir en Safari»).',
    googleUnavailable: 'Google no está disponible dentro de esta app.',
  },
  or: 'o con tu correo',
  /** En «Ya tengo cuenta»: camino claro para quien no usa Google. */
  institutionalCta: '¿Correo institucional? Regístrate con email y contraseña',
  /** En «Crear cuenta»: señala el formulario de correo y contraseña. */
  signUpHint: 'Si tu correo no es de Google (por ejemplo, el institucional), crea tu cuenta aquí abajo con tu correo y una contraseña.',
  /** Si Google falla o se cierra su ventana. */
  googleHelpTitle: '¿No has podido entrar con Google?',
  googleHelpBody: 'Crea tu cuenta con tu correo (también el institucional) y una contraseña. Solo se tarda un minuto.',
  googleHelpButton: 'Crear cuenta con correo y contraseña',
  firstName: 'Nombre',
  lastName: 'Apellidos',
  email: 'Correo electrónico',
  password: 'Contraseña',
  /** Lista de comprobación en vivo al crear la cuenta (shared/password.ts). */
  passwordRules: {
    title: 'Requisitos de la contraseña',
    length: 'Tiene al menos 8 caracteres',
    notCommon: 'No es una contraseña muy común',
    notPersonal: 'No incluye tu nombre ni tu correo',
  },
  passwordInvalid: 'La contraseña aún no cumple los requisitos indicados bajo el campo.',
  showPassword: 'Mostrar contraseña',
  hidePassword: 'Ocultar contraseña',
  submitSignUp: 'Crear cuenta',
  submitSignIn: 'Entrar',
  forgot: '¿Has olvidado tu contraseña?',
  /** Pantalla «Recupera tu contraseña» (PasswordReset). */
  reset: {
    back: 'Volver a entrar',
    title: 'Recupera tu contraseña',
    intro: 'Escribe el correo con el que creaste tu cuenta y te enviaremos un enlace para elegir una contraseña nueva.',
    submit: 'Enviar enlace',
    sending: 'Enviando…',
    googleNote: '¿Te registraste con Google? Entonces no tienes contraseña: vuelve y usa «Continuar con Google».',
    sentTitle: 'Revisa tu correo',
    sentBody: {
      before: 'Si hay una cuenta con ',
      after: ', en unos minutos te llegará un correo con un enlace para crear tu contraseña nueva. El enlace es válido durante 1 hora.',
    },
    sentHelp:
      '¿No lo ves? Busca en spam o en promociones. Si es un correo institucional, puede estar retenido en la cuarentena de tu servicio de correo.',
    resend: 'Reenviar enlace',
    resendIn: (s: number) => `Reenviar en ${s} s`,
    otherEmail: 'Usar otro correo',
    /** Tope de envíos por pestaña alcanzado (lib/auth/passwordReset.ts). */
    limit:
      'Ya te hemos enviado varios enlaces. Espera unos minutos a que llegue alguno (revisa spam y promociones) o escríbenos desde la sección de contacto y te ayudamos.',
  },
  mockNote: 'Modo de pruebas: las cuentas se guardan solo en este navegador.',
  errors: {
    'auth/email-already-in-use': 'Ya existe una cuenta con este correo. Si la creaste con Google, usa «Continuar con Google»; si no, entra con tu contraseña.',
    'auth/account-exists-with-different-credential':
      'Ya tienes una cuenta con este correo, creada con correo y contraseña. Entra con ellos (si no recuerdas la contraseña, puedes crear una nueva).',
    'auth/user-disabled': 'Esta cuenta está desactivada. Si crees que es un error, escríbenos desde la sección de contacto de la web.',
    /** Sin conexión a internet (navigator.onLine): no es la red de la institución. */
    offline: 'No tienes conexión a internet. Comprueba la wifi o los datos móviles e inténtalo de nuevo.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/wrong-password': 'Correo o contraseña incorrectos.',
    'auth/user-not-found': 'Correo o contraseña incorrectos.',
    'auth/invalid-email': 'El correo no es válido.',
    'auth/weak-password': 'La contraseña debe tener al menos 8 caracteres.',
    'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos y vuelve a probar.',
    'auth/popup-blocked': 'El navegador ha bloqueado la ventana de Google. Permite las ventanas emergentes e inténtalo de nuevo.',
    'auth/network-request-failed':
      'No hemos podido conectar con el servicio de acceso. Algunas redes de universidades o administraciones lo bloquean: prueba con los datos del móvil o escríbenos y te inscribimos nosotros.',
  } as Record<string, string>,
  /** Botones de salida bajo los errores de acceso (authErrors.ts). */
  errorActions: {
    signIn: 'Iniciar sesión',
    reset: 'Recuperar contraseña',
    signUp: 'Crear cuenta',
  },
}

export const adminText = {
  pageTitle: 'Administración',
  /** Botón para cuentas admin junto a «Sesión iniciada como…» (AdminLink). */
  openPanel: 'Panel de administración',
  /** Mientras llegan las sesiones o las inscripciones. */
  loadingData: 'Cargando datos…',
  forbidden: 'Esta cuenta no tiene acceso de administración.',
  tabs: { stats: 'Resumen', sessions: 'Días y aforo', registrations: 'Inscritos' },

  connectivity: {
    title: 'Conexión de las visitas',
    help: 'Contadores anónimos (por pestaña, sin datos personales). Ayudan a ver si alguna red, p. ej. de una universidad o administración, impide inscribirse.',
    last7: '7 días',
    last30: '30 días',
    ofVisits: (pct: number) => `${pct} % de las visitas`,
    empty: 'Aún no hay datos.',
    error: 'No se han podido cargar los contadores.',
  },

  stats: {
    day: 'Día',
    allDays: 'Todos los días',
    registered: 'Inscritos',
    peopleAllDays: 'personas en total',
    ofCapacity: (capacity: number, free: number) => `de ${capacity} plazas · ${free} libres`,
    full: 'Completo',
    certificate: 'Piden certificado',
    foodNeeds: 'Con necesidades alimentarias',
    ofTotal: (pct: number) => `${pct} % de los inscritos`,
    participation: 'Tipo de participación',
    food: 'Alimentación',
    foodHelp: 'Una persona puede contar en varias barras (dieta y alergias).',
    cities: 'Procedencia',
    otherAllergy: 'Otra alergia (escrita)',
    noFoodNeeds: 'Sin necesidades',
    otherCities: 'Otras',
    empty: 'Aún no hay inscripciones para este día.',
  },

  sessions: {
    title: 'Título',
    date: 'Fecha',
    capacity: 'Aforo',
    registered: 'Inscritos',
    active: 'Activa',
    save: 'Guardar',
    saved: 'Guardado',
    recount: 'Recalcular contadores',
    recountHelp: 'Vuelve a contar los inscritos de cada día a partir de las inscripciones (por si hubiera algún desajuste).',
    capacityHelp: 'El aforo no puede ser menor que los inscritos actuales.',
  },

  registrations: {
    filters: 'Filtros',
    activeFilters: (n: number) => (n === 1 ? '1 activo' : `${n} activos`),
    clearFilters: 'Quitar filtros',
    /** Botón grande de la hoja de filtros en móvil. */
    showResults: (total: string) => `Ver ${total}`,
    session: 'Día',
    allSessions: 'Todos los días',
    type: 'Tipo de participación',
    allTypes: 'Todos',
    city: 'Ciudad',
    certificate: 'Certificado',
    any: 'Indiferente',
    food: 'Alimentación',
    foodOptions: {
      alguna: 'Con alguna necesidad (dieta o alergia)',
      ninguna: 'Sin necesidades',
      alergias: 'Con alguna alergia',
    },
    foodDiets: 'Dieta',
    foodAllergens: 'Alérgeno concreto',
    search: 'Buscar (nombre, correo, entidad)',
    total: (n: number) => (n === 1 ? '1 inscripción' : `${n} inscripciones`),
    export: 'Exportar CSV',
    exporting: 'Exportando…',
    empty: 'No hay inscripciones con estos filtros.',
    columns: ['Nombre', 'Correo', 'Teléfono', 'Ciudad', 'Entidad', 'Tipo', 'Días', 'Certif.', 'Alimentación'],
    details: 'Ver detalle',
    hideDetails: 'Ocultar',
    cancel: 'Cancelar esta inscripción',
    cancelHelp: 'Libera sus plazas y no avisa a la persona. Para inscripciones falsas, duplicadas o de prueba.',
    cancelConfirm: 'Sí, cancelarla',
    cancelKeep: 'No',
    detailLabels: {
      jobTitle: 'Cargo',
      idDocument: 'Documento',
      accessibility: 'Accesibilidad',
      allergens: 'Alérgenos',
      otherAllergy: 'Otra alergia',
      diet: 'Dieta',
      observations: 'Observaciones',
      consents: 'Consentimientos (imagen / comunicaciones)',
      dates: 'Alta / última modificación',
    },
  },
}

/** Panel de diagnóstico (solo cuentas de administración). */
/** Avisos de conexión (cargas lentas o fallidas), pensados para redes de universidades y administraciones. */
export const connectionText = {
  loading: 'Cargando…',
  slowTitle: 'Está tardando más de lo normal',
  slowBody: 'Seguimos intentándolo. Algunas redes de universidades o administraciones ralentizan o filtran estos servicios.',
  errorTitle: 'No hemos podido conectar',
  errorBody:
    'Puede deberse a la red (pasa a menudo en universidades y administraciones) o a un bloqueador de contenido. Prueba de nuevo o, si puedes, conéctate con los datos del móvil.',
  retry: 'Reintentar',
  contact: (email: string) => `¿Sigue sin funcionar? Escríbenos a ${email} y te inscribimos nosotros.`,
}

export const diagnosticsText = {
  button: 'Diagnóstico',
  title: 'Diagnóstico de errores',
  kicker: 'Solo administración',
  close: 'Cerrar diagnóstico',
  context: 'Contexto',
  contextLabels: { mode: 'Modo de datos', account: 'Cuenta', uid: 'UID', url: 'Página', browser: 'Navegador' },
  errors: 'Errores de esta pestaña (más recientes primero)',
  empty: 'Sin errores registrados desde que se abrió la página.',
  status: 'HTTP',
  noConnection: 'sin conexión',
  code: 'Código',
  ref: 'Ref. del servidor',
  refHelp: 'Búscala en Vercel → Logs para ver el error completo.',
  copy: 'Copiar informe',
  copied: 'Copiado',
  clear: 'Vaciar',
}

export const privacyPage = {
  title: 'Política de privacidad',
  updated: `Última actualización: ${legal.updated}.`,
  sections: [
    ['Responsable del tratamiento', `${legal.controller}. Correo de contacto: ${legal.contactEmail}.`],
    [
      'Datos que tratamos',
      'Datos identificativos y de contacto (nombre, apellidos, correo electrónico, teléfono y ciudad), datos profesionales (entidad y cargo), tipo de participación y días de asistencia. Si pides certificado de asistencia, el tipo y número de tu documento de identidad. Solo si nos los facilitas con tu consentimiento explícito, datos de accesibilidad y de alergias o intolerancias alimentarias, que la ley considera datos de salud.',
    ],
    [
      'Finalidades',
      'Gestionar tu inscripción y la organización del congreso (aforo, acreditaciones, catering y accesibilidad), comunicarnos contigo sobre el evento, emitir tu certificado de asistencia si lo pides (se emite a quienes asisten al menos a 2 días del congreso) y, solo si lo autorizas, difundir imágenes del congreso en las que aparezcas.',
    ],
    [
      'Base jurídica',
      'Tu consentimiento al inscribirte (art. 6.1.a del RGPD) y la gestión de la inscripción que solicitas (art. 6.1.b). Para los datos de salud, tu consentimiento explícito (art. 9.2.a). Puedes retirar tus consentimientos en cualquier momento sin que afecte a la licitud del tratamiento anterior.',
    ],
    [
      'Conservación',
      'Los datos de la inscripción se conservan mientras dura la organización del congreso y el tiempo necesario para emitir los certificados y atender posibles responsabilidades. Los datos de salud se suprimen al terminar el congreso y el documento de identidad, una vez emitido el certificado. Puedes cancelar tu inscripción desde la web en cualquier momento: se borran también tus datos privados.',
    ],
    [
      'Destinatarios',
      'No cedemos tus datos a terceros salvo obligación legal. Usamos proveedores tecnológicos que actúan como encargados del tratamiento: Vercel (alojamiento de la web), Google Firebase (cuentas de acceso y base de datos, alojada en la Unión Europea) y Resend (envío de correos). Algunos tienen sede en Estados Unidos: las transferencias se amparan en el Marco de Privacidad de Datos UE-EE. UU. o en las cláusulas contractuales tipo de la Comisión Europea.',
    ],
    [
      'Cookies y almacenamiento local',
      'La web no usa cookies de publicidad ni de seguimiento. Guarda en tu navegador solo lo imprescindible para funcionar: la sesión de tu cuenta, si la inicias, y preferencias técnicas (por ejemplo, haber abierto ya la web en otro navegador). Al iniciar sesión con Google se aplican además las condiciones de Google.',
    ],
    [
      'Seguridad',
      'Las comunicaciones van cifradas (HTTPS), las inscripciones solo pueden leerlas la persona interesada y la organización, y el documento de identidad se guarda aparte, con acceso restringido.',
    ],
    [
      'Tus derechos',
      `Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${legal.contactEmail}, y presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).`,
    ],
  ] as [string, string][],
}
