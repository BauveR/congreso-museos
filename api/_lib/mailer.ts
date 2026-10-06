import { requireEnv } from './env.js'

export interface Mail {
  to: string
  subject: string
  html: string
  text: string
}

/**
 * Envío de correo según MAIL_PROVIDER:
 * - "console" (por defecto): no envía; lo muestra en el log (desarrollo).
 * - "gmail": SMTP de Gmail con contraseña de aplicación (GMAIL_USER,
 *   GMAIL_APP_PASSWORD). Límite de Google: ~500 correos al día.
 * - "resend": RESEND_API_KEY. Requiere un dominio propio verificado en
 *   Resend (no permite enviar desde direcciones @gmail.com).
 * Remitente: MAIL_FROM (p. ej. "Congreso de Museos <congreso@gmail.com>").
 */
export async function sendMail(mail: Mail): Promise<void> {
  const provider = process.env.MAIL_PROVIDER ?? 'console'

  if (provider === 'gmail') {
    const { createTransport } = await import('nodemailer')
    const user = requireEnv('GMAIL_USER')
    const transport = createTransport({ service: 'gmail', auth: { user, pass: requireEnv('GMAIL_APP_PASSWORD') } })
    await transport.sendMail({ from: process.env.MAIL_FROM ?? user, ...mail })
    return
  }

  if (provider === 'resend') {
    const { Resend } = await import('resend')
    const resend = new Resend(requireEnv('RESEND_API_KEY'))
    const { error } = await resend.emails.send({ from: requireEnv('MAIL_FROM'), ...mail })
    if (error) throw new Error(`Resend: ${error.message}`)
    return
  }

  console.info(`[mail:console] Para: ${mail.to}\nAsunto: ${mail.subject}\n${mail.text}\n`)
}

/**
 * Envía sin interrumpir la operación principal: si el correo falla, la
 * inscripción ya está guardada; se registra el error y se informa al cliente.
 */
export async function trySendMail(mail: Mail): Promise<boolean> {
  try {
    await sendMail(mail)
    return true
  } catch (error) {
    console.error('[mail] Error al enviar', error)
    return false
  }
}
