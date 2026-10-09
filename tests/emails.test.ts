import { describe, expect, it } from 'vitest'
import { cancellationMail, confirmationMail } from '../api/_lib/emails.js'
import type { Registration } from '../api/_lib/store/types.js'
import { DAY_COLORS, EVENT } from '../shared/event.js'
import { registrationSchema } from '../shared/registration.js'
import { DEFAULT_SESSIONS } from '../shared/sessions.js'
import { validInput } from './fixtures.js'

const reg = (extra: Record<string, unknown> = {}): Registration => ({
  uid: 'u1',
  email: 'ana@example.com',
  data: registrationSchema.parse({ ...validInput(), ...extra }),
  createdAt: '',
  updatedAt: '',
})

describe('correo de confirmación', () => {
  it('píldoras de los días elegidos, en orden y con su color', () => {
    const mail = confirmationMail(reg({ sessionIds: ['dia-21', 'dia-19'] }), DEFAULT_SESSIONS, true)
    const day1 = mail.html.indexOf('Día 1')
    const day3 = mail.html.indexOf('Día 3')
    expect(day1).toBeGreaterThan(-1)
    expect(day3).toBeGreaterThan(day1)
    expect(mail.html).toContain(DAY_COLORS[0].bg)
    expect(mail.html).toContain(DAY_COLORS[2].bg)
    expect(mail.html).not.toContain(DAY_COLORS[1].bg)
  })

  it('escapa el texto de la persona', () => {
    const mail = confirmationMail(reg({ firstName: '<b>Ana</b>' }), DEFAULT_SESSIONS, true)
    expect(mail.html).toContain('&lt;b&gt;Ana&lt;/b&gt;')
    expect(mail.html).not.toContain('<b>Ana</b>')
  })

  it('incluye sede, cómo llegar, botón y versión en texto', () => {
    const mail = confirmationMail(reg(), DEFAULT_SESSIONS, false)
    expect(mail.subject).toBe(`Inscripción actualizada · ${EVENT.name}`)
    expect(mail.html).toContain(EVENT.venue.name.replace('&', '&amp;'))
    expect(mail.html).toContain('google.com/maps')
    expect(mail.html).toContain(`${EVENT.url}/inscripcion`)
    expect(mail.text).toContain('Día 1')
    expect(mail.text).toContain(EVENT.venue.address[0])
  })

  it('cancelación con enlace para volver a inscribirse', () => {
    const mail = cancellationMail(reg())
    expect(mail.subject).toContain('cancelada')
    expect(mail.html).toContain('Volver a inscribirme')
  })
})
