import { registrationSchema } from '../shared/registration.js'
import { requireUser } from './_lib/auth.js'
import { cancellationMail, confirmationMail, organizerMail } from './_lib/emails.js'
import { handler, HttpError, json, readJson } from './_lib/http.js'
import { trySendMail } from './_lib/mailer.js'
import { rateLimit } from './_lib/rateLimit.js'
import { getStore } from './_lib/store/index.js'

/** GET /api/registration — la inscripción del usuario autenticado (o null). */
export const GET = handler(async (request) => {
  const user = await requireUser(request)
  const registration = await (await getStore()).getRegistration(user.uid)
  return json({ registration })
})

/**
 * POST /api/registration — crea o actualiza la inscripción del usuario.
 * Capas: token verificado → límite de envíos → validación completa con el
 * esquema compartido → aforo en transacción → correo de confirmación.
 * El correo se toma del token, nunca del formulario.
 */
export const POST = handler(async (request) => {
  const user = await requireUser(request)
  rateLimit(`save:${user.uid}`, 10, 60_000)

  const data = registrationSchema.parse(await readJson(request))
  const store = await getStore()
  const { registration, created } = await store.saveRegistration(user.uid, user.email, data)

  const sessions = await store.listSessions()
  const emailSent = await trySendMail(confirmationMail(registration, sessions, created))
  const notice = organizerMail(registration, sessions, created ? 'nueva' : 'modificada')
  if (notice) await trySendMail(notice)

  return json({ registration, created, emailSent }, created ? 201 : 200)
})

/** DELETE /api/registration — cancela la inscripción y libera las plazas. */
export const DELETE = handler(async (request) => {
  const user = await requireUser(request)
  rateLimit(`cancel:${user.uid}`, 5, 60_000)

  const store = await getStore()
  const cancelled = await store.cancelRegistration(user.uid)
  if (!cancelled) throw new HttpError(404, 'No tienes ninguna inscripción')

  const emailSent = await trySendMail(cancellationMail(cancelled))
  const notice = organizerMail(cancelled, await store.listSessions(), 'cancelada')
  if (notice) await trySendMail(notice)
  return json({ cancelled: true, emailSent })
})
