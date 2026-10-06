# Inscripciones: puesta en marcha

Funciona en dos modos (variables `VITE_DATA_MODE` y `DATA_MODE`):

- **mock** (por defecto): sin Firebase. Inicio de sesión simulado y datos en
  memoria del servidor de desarrollo, con 36 inscripciones de ejemplo. Se
  pierden al reiniciar `npm run dev`. En producción el servidor lo rechaza.
- **firebase**: Firebase Auth + Firestore reales.

## Probar en local (mock)

```bash
npm run dev
```

- `/inscripcion`: formulario (entra con cualquier nombre y correo).
- `/admin`: panel (marca «Entrar como administración»).
- Los correos se muestran en la terminal (`MAIL_PROVIDER=console`).
- `npm test`: pruebas de validaciones, aforo, CSV y endpoints.

## Pasar a Firebase (plan gratuito Spark)

1. **Proyecto** en <https://console.firebase.google.com> → añadir app web.
   Copiar su configuración a `VITE_FIREBASE_*`.
2. **Authentication** → Métodos de acceso: activar **Google** y
   **Correo electrónico → Enlace de correo electrónico**. En «Dominios
   autorizados», añadir el dominio de Vercel.
3. **Firestore** → crear base de datos (modo producción, región `eur3` o
   `europe-southwest1`). En «Reglas», pegar el contenido de `firestore.rules`
   y publicar.
4. **Cuenta de servicio**: Configuración del proyecto → Cuentas de servicio →
   Generar nueva clave privada. Pegar el JSON **en una sola línea** en
   `FIREBASE_SERVICE_ACCOUNT` (solo en `.env.local` y en Vercel; nunca en el repo).
5. `VITE_DATA_MODE=firebase` y `DATA_MODE=firebase`.
6. Las sesiones (19, 20 y 21 de noviembre, aforo 80) se crean solas en el
   primer acceso. Revisa las fechas y el año en el panel.
7. **Administración**: la persona inicia sesión una vez en `/inscripcion` y
   después: `npm run set-admin -- persona@correo.com` (con `--remove` para
   quitarlo). Debe cerrar sesión y volver a entrar.

## Correo desde Gmail

1. En la cuenta de Gmail: activar la verificación en dos pasos.
2. Cuenta de Google → Seguridad → **Contraseñas de aplicaciones** → crear una.
3. `MAIL_PROVIDER=gmail`, `GMAIL_USER=cuenta@gmail.com`,
   `GMAIL_APP_PASSWORD=<la contraseña de 16 letras>`,
   `MAIL_FROM="V Congreso de Museos de Canarias <cuenta@gmail.com>"`.
4. Opcional: `ORGANIZER_EMAIL` para recibir aviso de cada inscripción.

Gmail permite unos 500 envíos al día. Resend solo funciona con un dominio
propio verificado (`MAIL_PROVIDER=resend`).

## Vercel

Configurar todas las variables de `.env.example` en el proyecto de Vercel
(Production y Preview). Las funciones de `/api` se despliegan solas;
`vercel.json` redirige el resto de rutas a la SPA.

## Reglas de aforo

- Una inscripción por persona (el id del documento es su usuario).
- Al modificar, solo cuentan los días añadidos o quitados (nunca se duplica).
- Cambiar el aforo no toca los contadores, y no puede bajar de los inscritos.
- Todo ocurre en transacciones (dos personas no se llevan la última plaza).
- «Recalcular contadores» en el panel repara cualquier desajuste.
