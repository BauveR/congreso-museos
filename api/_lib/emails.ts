import { PARTICIPATION_LABELS } from '../../shared/registration.js'
import type { Session } from '../../shared/sessions.js'
import type { Mail } from './mailer.js'
import type { Registration } from './store/types.js'

const EVENT = 'V Congreso de Museos de Canarias'

/** Escapa texto del usuario antes de insertarlo en HTML. */
function esc(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

function sessionTitles(reg: Registration, sessions: Session[]) {
  const byId = new Map(sessions.map((s) => [s.id, s.title]))
  return reg.data.sessionIds.map((id) => byId.get(id) ?? id)
}

function layout(title: string, bodyHtml: string) {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f2f1ec;font-family:system-ui,sans-serif;color:#111311">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<p style="margin:0 0 24px;font-weight:700;letter-spacing:.02em">${EVENT}</p>
<h1 style="font-size:22px;margin:0 0 16px">${esc(title)}</h1>
${bodyHtml}
<p style="margin:32px 0 0;font-size:12px;color:#4a4f45">Has recibido este correo porque realizaste una inscripción en ${EVENT}. Puedes consultar, modificar o cancelar tu inscripción desde la web del congreso.</p>
</div></body></html>`
}

export function confirmationMail(reg: Registration, sessions: Session[], created: boolean): Mail {
  const title = created ? 'Inscripción confirmada' : 'Inscripción actualizada'
  const titles = sessionTitles(reg, sessions)
  const d = reg.data
  const lines = [
    `Nombre: ${d.firstName} ${d.lastName}`,
    `Participación: ${PARTICIPATION_LABELS[d.participationType]}`,
    `Asistencia: ${titles.join(', ')}`,
    `Certificado de asistencia: ${d.certificate ? 'Sí' : 'No'}`,
  ]
  return {
    to: reg.email,
    subject: `${title} · ${EVENT}`,
    text: `Hola, ${d.firstName}:\n\n${created ? 'Tu inscripción se ha registrado correctamente.' : 'Hemos guardado los cambios de tu inscripción.'}\n\n${lines.join('\n')}\n\n${EVENT}`,
    html: layout(
      title,
      `<p>Hola, ${esc(d.firstName)}:</p>
<p>${created ? 'Tu inscripción se ha registrado correctamente.' : 'Hemos guardado los cambios de tu inscripción.'}</p>
<ul style="padding-left:18px;line-height:1.6">${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`,
    ),
  }
}

export function cancellationMail(reg: Registration): Mail {
  return {
    to: reg.email,
    subject: `Inscripción cancelada · ${EVENT}`,
    text: `Hola, ${reg.data.firstName}:\n\nTu inscripción se ha cancelado y tus plazas han quedado libres.\n\n${EVENT}`,
    html: layout(
      'Inscripción cancelada',
      `<p>Hola, ${esc(reg.data.firstName)}:</p><p>Tu inscripción se ha cancelado y tus plazas han quedado libres.</p>`,
    ),
  }
}

/** Aviso a la organización (opcional: ORGANIZER_EMAIL). */
export function organizerMail(reg: Registration, sessions: Session[], action: 'nueva' | 'modificada' | 'cancelada'): Mail | null {
  const to = process.env.ORGANIZER_EMAIL
  if (!to) return null
  const d = reg.data
  const summary = `${d.firstName} ${d.lastName} (${reg.email}) · ${PARTICIPATION_LABELS[d.participationType]} · ${sessionTitles(reg, sessions).join(', ')}`
  return {
    to,
    subject: `Inscripción ${action}: ${d.firstName} ${d.lastName}`,
    text: summary,
    html: layout(`Inscripción ${action}`, `<p>${esc(summary)}</p>`),
  }
}
