import { PARTICIPATION_LABELS, type RegistrationData } from '../../../shared/registration'
import { registrationText } from '../../content/inscripcion'
import type { PublicSession } from './formValues'

const t = registrationText

interface RegistrationSummaryProps {
  data: RegistrationData
  sessions: PublicSession[]
  className?: string
}

/** Resumen de una inscripción guardada (página de inscripción y landing). */
export function RegistrationSummary({ data, sessions, className = '' }: RegistrationSummaryProps) {
  const titles = new Map(sessions.map((s) => [s.id, s.title]))
  return (
    <dl className={`grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[12rem_1fr] ${className}`}>
      <dt className="font-semibold">{t.fields.firstName}</dt>
      <dd>
        {data.firstName} {data.lastName}
      </dd>
      <dt className="font-semibold">{t.fields.participationType}</dt>
      <dd>{PARTICIPATION_LABELS[data.participationType]}</dd>
      <dt className="font-semibold">{t.sections.attendance}</dt>
      <dd>{data.sessionIds.map((id) => titles.get(id) ?? id).join(', ')}</dd>
      <dt className="font-semibold">{t.sections.certificate}</dt>
      <dd>{data.certificate ? t.fields.yes : t.fields.no}</dd>
    </dl>
  )
}
