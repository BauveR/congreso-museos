import { dayColor, EVENT, mapsUrl } from '../../shared/event.js'
import { PARTICIPATION_LABELS } from '../../shared/registration.js'
import type { Session } from '../../shared/sessions.js'
import { env } from './env.js'
import type { Mail } from './mailer.js'
import type { Registration } from './store/types.js'

/*
 * Correos transaccionales con las prácticas habituales del sector (guías de
 * Litmus / Email on Acid): maquetación con tablas de 600 px y estilos en
 * línea (Outlook y Gmail ignoran el CSS moderno), cabecera de marca con logo
 * PNG alojado y texto alternativo, texto de previsualización, resumen
 * escaneable, un único botón «a prueba de clientes», datos prácticos del
 * evento, pie que explica por qué se recibe y versión en texto plano.
 * Colores fijos (no se invierten en modo oscuro): los de la web.
 */

const C = {
  page: '#f2f1ec',
  card: '#ffffff',
  brand: '#2f3529',
  ink: '#111311',
  muted: '#4a4f45',
  line: '#e2e1d9',
  accent: '#d1e132',
  link: '#3a5a2c',
}
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
const REGISTRATION_URL = `${EVENT.url}/inscripcion`
const LOGO_URL = `${EVENT.url}/media/logo-email.png`

/** Escapa texto del usuario antes de insertarlo en HTML. */
function esc(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

/** Días elegidos con su posición entre los días del congreso (para el color de su píldora). */
function chosenDays(reg: Registration, sessions: Session[]) {
  const days = sessions.filter((s) => s.kind === 'day').sort((a, b) => a.order - b.order)
  return reg.data.sessionIds
    .map((id) => {
      const index = days.findIndex((d) => d.id === id)
      const session = sessions.find((s) => s.id === id)
      return { title: session?.title ?? id, index }
    })
    .sort((a, b) => (a.index < 0 ? 99 : a.index) - (b.index < 0 ? 99 : b.index))
}

/** Píldoras de color por día (tablas: el border-radius se ignora en Outlook, sin más). */
function dayPills(days: { title: string; index: number }[]) {
  return days
    .map(({ title, index }) => {
      const { bg, text } = index >= 0 ? dayColor(index) : { bg: C.line, text: C.ink }
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:0 8px 8px 0"><tr>
<td bgcolor="${bg}" style="background:${bg};color:${text};border-radius:999px;padding:8px 16px;font:700 14px/1.2 ${FONT}">${esc(title)}</td>
</tr></table>`
    })
    .join('')
}

/** Filas etiqueta / valor del resumen. */
function detailRows(rows: [string, string][]) {
  return rows
    .map(
      ([label, value]) => `<tr>
<td style="padding:10px 0;border-top:1px solid ${C.line};font:400 14px/1.4 ${FONT};color:${C.muted};width:40%;vertical-align:top">${esc(label)}</td>
<td style="padding:10px 0;border-top:1px solid ${C.line};font:600 14px/1.4 ${FONT};color:${C.ink};vertical-align:top">${esc(value)}</td>
</tr>`,
    )
    .join('')
}

/** Botón «a prueba de clientes» (celda con fondo + enlace), sin imágenes. */
function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td bgcolor="${C.accent}" style="background:${C.accent};border-radius:8px">
<a href="${href}" style="display:inline-block;padding:14px 26px;font:700 15px/1.2 ${FONT};color:${C.ink};text-decoration:none;letter-spacing:.02em">${esc(label)}</a>
</td></tr></table>`
}

/** Datos prácticos del congreso (fechas, lugar, sede y cómo llegar). */
function eventInfo() {
  const v = EVENT.venue
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};border-radius:12px">
<tr><td style="padding:20px 24px;font:400 14px/1.6 ${FONT};color:${C.ink}">
<p style="margin:0 0 4px;font:700 12px/1.4 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${C.muted}">Fechas y lugar</p>
<p style="margin:0 0 14px;font-weight:600">${esc(EVENT.dateLabel)} · ${esc(EVENT.place)}</p>
<p style="margin:0 0 4px;font:700 12px/1.4 ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${C.muted}">Sede</p>
<p style="margin:0">${esc(v.name)}<br>${v.address.map(esc).join('<br>')}</p>
<p style="margin:8px 0 0"><a href="${mapsUrl(v.mapsQuery)}" style="color:${C.link};font-weight:700">Cómo llegar (Google Maps) →</a></p>
</td></tr></table>`
}

interface LayoutOptions {
  /** Texto de previsualización en la bandeja de entrada. */
  preheader: string
  title: string
  body: string
}

function layout({ preheader, title, body }: LayoutOptions) {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.page}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background:${C.page}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">
<tr><td bgcolor="${C.brand}" style="background:${C.brand};border-radius:16px 16px 0 0;padding:28px 32px">
<img src="${LOGO_URL}" width="200" alt="${esc(EVENT.name)}" style="display:block;width:200px;max-width:60%;height:auto;border:0;color:#ffffff;font:700 18px ${FONT}">
</td></tr>
<tr><td bgcolor="${C.card}" style="background:${C.card};border-radius:0 0 16px 16px;padding:32px;font:400 16px/1.6 ${FONT};color:${C.ink}">
<h1 style="margin:0 0 16px;font:700 24px/1.25 ${FONT};color:${C.ink}">${esc(title)}</h1>
${body}
</td></tr>
<tr><td style="padding:24px 32px;font:400 12px/1.6 ${FONT};color:${C.muted};text-align:center">
${esc(EVENT.name)} · ${esc(EVENT.dateLabel)} · ${esc(EVENT.place)}<br>
Has recibido este correo porque realizaste una inscripción en la web del congreso. Es un mensaje automático: no respondas a esta dirección.<br>
<a href="${EVENT.url}" style="color:${C.muted}">${esc(EVENT.url.replace('https://', ''))}</a>
</td></tr>
</table></td></tr></table></body></html>`
}

const yesNo = (v: boolean) => (v ? 'Sí' : 'No')

export function confirmationMail(reg: Registration, sessions: Session[], created: boolean): Mail {
  const title = created ? 'Inscripción confirmada' : 'Inscripción actualizada'
  const d = reg.data
  const days = chosenDays(reg, sessions)
  const intro = created ? 'Tu inscripción se ha registrado correctamente. Estos son los días en los que te esperamos:' : 'Hemos guardado los cambios de tu inscripción. Estos son ahora tus días:'
  const details: [string, string][] = [
    ['Nombre', `${d.firstName} ${d.lastName}`],
    ['Participación', PARTICIPATION_LABELS[d.participationType]],
    ['Certificado de asistencia', yesNo(d.certificate)],
  ]

  return {
    to: reg.email,
    subject: `${title} · ${EVENT.name}`,
    text: [
      `Hola, ${d.firstName}:`,
      '',
      intro,
      ...days.map((day) => `  · ${day.title}`),
      '',
      ...details.map(([k, v]) => `${k}: ${v}`),
      '',
      `${EVENT.dateLabel} · ${EVENT.place}`,
      `Sede: ${EVENT.venue.name}, ${EVENT.venue.address.join(', ')}`,
      `Cómo llegar: ${mapsUrl(EVENT.venue.mapsQuery)}`,
      '',
      `Ver o modificar tu inscripción: ${REGISTRATION_URL}`,
      '',
      EVENT.name,
    ].join('\n'),
    html: layout({
      preheader: `Te esperamos en ${EVENT.place}, ${EVENT.dateLabel}.`,
      title,
      body: `<p style="margin:0 0 8px">Hola, ${esc(d.firstName)}:</p>
<p style="margin:0 0 20px">${esc(intro)}</p>
<div style="margin:0 0 20px">${dayPills(days)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px">${detailRows(details)}</table>
<div style="margin:0 0 28px">${button('Ver o modificar mi inscripción', REGISTRATION_URL)}</div>
${eventInfo()}`,
    }),
  }
}

export function cancellationMail(reg: Registration): Mail {
  const d = reg.data
  const text = 'Tu inscripción se ha cancelado y tus plazas han quedado libres. Si cambias de opinión, puedes volver a inscribirte desde la web mientras queden plazas.'
  return {
    to: reg.email,
    subject: `Inscripción cancelada · ${EVENT.name}`,
    text: `Hola, ${d.firstName}:\n\n${text}\n\n${REGISTRATION_URL}\n\n${EVENT.name}`,
    html: layout({
      preheader: 'Tus plazas han quedado libres.',
      title: 'Inscripción cancelada',
      body: `<p style="margin:0 0 8px">Hola, ${esc(d.firstName)}:</p>
<p style="margin:0 0 28px">${esc(text)}</p>
${button('Volver a inscribirme', REGISTRATION_URL)}`,
    }),
  }
}

/** Aviso a la organización (opcional: ORGANIZER_EMAIL). */
export function organizerMail(reg: Registration, sessions: Session[], action: 'nueva' | 'modificada' | 'cancelada'): Mail | null {
  const to = env('ORGANIZER_EMAIL')
  if (!to) return null
  const d = reg.data
  const days = chosenDays(reg, sessions)
  const summary = `${d.firstName} ${d.lastName} (${reg.email}) · ${PARTICIPATION_LABELS[d.participationType]} · ${days.map((x) => x.title).join(', ')}`
  return {
    to,
    subject: `Inscripción ${action}: ${d.firstName} ${d.lastName}`,
    text: summary,
    html: layout({
      preheader: summary,
      title: `Inscripción ${action}`,
      body: `<p style="margin:0 0 20px">${esc(summary)}</p>${action === 'cancelada' ? '' : dayPills(days)}`,
    }),
  }
}
