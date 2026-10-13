import type { ReactNode } from 'react'
import { ALLERGENS, DIET_LABELS, ID_TYPE_LABELS, PARTICIPATION_LABELS, type RegistrationData } from '../../../shared/registration'
import { DayPill } from '../../components/DayPill'
import { registrationText } from '../../content/inscripcion'
import type { PublicSession } from './formValues'
import type { FormPart } from './RegistrationForm'

const t = registrationText
const p = t.panel

interface RegistrationPanelProps {
  data: RegistrationData
  email: string
  sessions: PublicSession[]
  /** Abre el formulario solo con esa parte; sin él (plazo cerrado), no se puede modificar. */
  onEdit?: (part: FormPart) => void
}

/** Últimos 3 caracteres del documento: basta para reconocerlo sin mostrarlo entero. */
const masked = (number: string) => `•••${number.slice(-3)}`

/**
 * Panel de la inscripción guardada: una tarjeta por parte (días, datos,
 * certificado, accesibilidad y alimentación, imagen), cada una con su botón
 * «Modificar», que abre solo esos campos en vez del formulario completo.
 */
export function RegistrationPanel({ data, email, sessions, onEdit }: RegistrationPanelProps) {
  const days = sessions.filter((s) => s.kind === 'day').map((s) => s.id)
  const titles = new Map(sessions.map((s) => [s.id, s.title]))
  const allergens = ALLERGENS.filter((a) => data.allergens.includes(a.id)).map((a) => a.label)
  const doc = data.idDocument

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Part title={p.days} part="dias" onEdit={onEdit}>
        <ul className="flex flex-wrap gap-2">
          {data.sessionIds.map((id) => {
            const day = days.indexOf(id)
            const title = titles.get(id) ?? id
            return <li key={id}>{day >= 0 ? <DayPill index={day}>{title}</DayPill> : title}</li>
          })}
        </ul>
      </Part>

      <Part title={p.data} part="datos" onEdit={onEdit}>
        <Rows
          rows={[
            [t.fields.firstName, `${data.firstName} ${data.lastName}`],
            [t.fields.email, email],
            [t.fields.phone, data.phone],
            [t.fields.city, data.city],
            [t.fields.organization, data.organization],
            [t.fields.jobTitle, data.jobTitle],
            [t.fields.participationType, PARTICIPATION_LABELS[data.participationType]],
          ]}
        />
      </Part>

      <Part title={p.certificate} part="certificado" onEdit={onEdit}>
        <p>{data.certificate ? `${t.fields.yes}${doc ? ` · ${ID_TYPE_LABELS[doc.type]} ${masked(doc.number)}` : ''}` : t.fields.no}</p>
      </Part>

      <Part title={p.health} part="salud" onEdit={onEdit}>
        <Rows
          rows={[
            [p.accessibility, data.accessibility || p.nothing],
            [p.allergens, allergens.length ? allergens.join(', ') : p.nothing],
            ...(data.otherAllergy ? [[p.otherAllergy, data.otherAllergy] as [string, string]] : []),
            [p.diet, DIET_LABELS[data.diet]],
          ]}
        />
      </Part>

      <Part title={p.image} part="imagen" onEdit={onEdit}>
        <p>{data.consents.image ? p.imageYes : p.imageNo}</p>
      </Part>
    </div>
  )
}

function Part({ title, part, onEdit, children }: { title: string; part: FormPart; onEdit?: (part: FormPart) => void; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-borde bg-superficie p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold text-salvia-texto">{title}</h3>
        {onEdit && (
          <button type="button" onClick={() => onEdit(part)} className="min-h-11 text-sm font-bold text-acento-texto underline underline-offset-4">
            {p.change}
          </button>
        )}
      </div>
      <div className="text-sm">{children}</div>
    </section>
  )
}

function Rows({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[9rem_1fr]">
      {rows.map(([term, value]) => (
        <div key={term} className="contents">
          <dt className="text-texto-suave">{term}</dt>
          <dd className="break-words">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
