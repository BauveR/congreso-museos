import { registrationSchema } from '../shared/registration.js'
import { checkAppCheck } from './_lib/appCheck.js'
import { requireUser } from './_lib/auth.js'
import { cancellationMail, confirmationMail, organizerMail } from './_lib/emails.js'
import { registrationOpen } from './_lib/env.js'
import { handler, HttpError, json, readJson } from './_lib/http.js'
import { trySendMail, type Mail } from './_lib/mailer.js'
import { rateLimit } from './_lib/rateLimit.js'
import { getStore } from './_lib/store/index.js'
import type { Store } from './_lib/store/types.js'

/**
 * Correos por persona y día. El plan gratuito de Resend permite 100 al día
 * en total: sin este cupo, guardar una y otra vez lo agotaría para todos.
 */
const MAILS_PER_DAY = 3

/** Envía si a esa persona le queda cupo hoy; null = no se envía a propósito. */
async function sendCapped(store: Store, uid: string, mail: Mail): Promise<boolean | null> {
  if (!(await store.consumeMailQuota(uid, MAILS_PER_DAY))) return null
  return trySendMail(mail)
}

/** GET /api/registration — la inscripción del usuario autenticado (o null). */
export const GET = handler(async (request) => {
  const user = await requireUser(request)
  const registration = await (await getStore()).getRegistration(user.uid)
  return json({ registration })
})

/**
 * POST /api/registration — crea o actualiza la inscripción del usuario.
 * Capas: token verificado → App Check → inscripciones abiertas → límite de envíos →
 * validación completa con el esquema compartido → aforo en transacción →
 * correo de confirmación (solo al crear o al cambiar de días, con cupo
 * diario). El correo se toma del token, nunca del formulario.
 */
export const POST = handler(async (request) => {
  const user = await requireUser(request)
  await checkAppCheck(request)
  if (!registrationOpen() && !user.admin) throw new HttpError(403, 'Las inscripciones aún no están abiertas')
  rateLimit(`save:${user.uid}`, 10, 60_000)

  const data = registrationSchema.parse(await readJson(request))
  const store = await getStore()
  const { registration, created, sessionsChanged } = await store.saveRegistration(user.uid, user.email, data)

  // Cambios menores (teléfono, alergias…) no generan correo.
  let emailSent: boolean | null = null
  if (sessionsChanged) {
    const sessions = await store.listSessions()
    emailSent = await sendCapped(store, user.uid, confirmationMail(registration, sessions, created))
    const notice = organizerMail(registration, sessions, created ? 'nueva' : 'modificada')
    if (notice) await trySendMail(notice)
  }

  return json({ registration, created, emailSent }, created ? 201 : 200)
})

/** DELETE /api/registration — cancela la inscripción y libera las plazas. */
export const DELETE = handler(async (request) => {
  const user = await requireUser(request)
  rateLimit(`cancel:${user.uid}`, 5, 60_000)

  const store = await getStore()
  const cancelled = await store.cancelRegistration(user.uid)
  if (!cancelled) throw new HttpError(404, 'No tienes ninguna inscripción')

  const emailSent = await sendCapped(store, user.uid, cancellationMail(cancelled))
  const notice = organizerMail(cancelled, await store.listSessions(), 'cancelada')
  if (notice) await trySendMail(notice)
  return json({ cancelled: true, emailSent })
})
