import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import {
  ALLERGENS,
  DIET_LABELS,
  DIETS,
  fieldErrors,
  ID_TYPE_LABELS,
  ID_TYPES,
  LIMITS,
  PARTICIPATION_LABELS,
  PARTICIPATION_TYPES,
  registrationSchema,
  type ParticipationType,
} from '../../../shared/registration'
import { Choice, ChoiceGroup, FormSection, SelectInput, TextArea, TextInput } from '../../components/form'
import { fieldDomId } from '../../components/formIds'
import { toInput, type FormInput, type FormValues, type PublicSession } from './formValues'
import { registrationText } from '../../content/inscripcion'
import { ApiError } from '../../lib/api'
import { reportError } from '../../lib/diagnostics'

const t = registrationText
const f = t.fields

/** Orden de los campos para enfocar el primer error. */
const FIELD_ORDER = [
  'firstName', 'lastName', 'city', 'phone', 'organization', 'jobTitle', 'participationType', 'sessionIds',
  'idDocument.number', 'accessibility', 'allergens', 'otherAllergy', 'observations', 'consents.healthData', 'consents.privacy',
]

interface Props {
  email: string
  sessions: PublicSession[]
  /** Sesiones que la persona ya tiene (pueden seguir marcadas aunque estén completas). */
  ownSessionIds: string[]
  initial: FormValues
  isUpdate: boolean
  onSubmit: (input: FormInput) => Promise<void>
  /** Escritorio ancho (landing): secciones en dos columnas equilibradas. */
  wide?: boolean
}

/**
 * Dos columnas con CSS columns: las secciones se reparten igualando la altura
 * (orden de lectura: columna izquierda y luego derecha) y no se parten.
 * Avisos, protección de datos y envío ocupan el ancho completo.
 */
const WIDE = 'lg:block lg:columns-2 lg:gap-x-16 lg:[&>*]:mb-10 lg:[&>*:empty]:mb-0 lg:[&>section]:break-inside-avoid'
const SPAN = 'lg:[column-span:all]'

export function RegistrationForm({ email, sessions, ownSessionIds, initial, isUpdate, onSubmit, wide = false }: Props) {
  const span = wide ? SPAN : ''
  /** En dos columnas anchas, pares de campos lado a lado. */
  const pair = wide ? 'grid gap-5 lg:grid-cols-2' : 'contents'
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)

  /** Clave de error asociada a cada valor del formulario. */
  const errorKey: Partial<Record<keyof FormValues, string>> = { idNumber: 'idDocument', idType: 'idDocument' }

  // Al editar un campo desaparece su error (y el resumen si ya no queda ninguno).
  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    const prefix = errorKey[key] ?? key
    setErrors((current) => {
      const next = Object.fromEntries(Object.entries(current).filter(([k]) => k !== prefix && !k.startsWith(`${prefix}.`)))
      return Object.keys(next).length === Object.keys(current).length ? current : next
    })
  }
  const toggle = <T extends string>(list: T[], item: T) => (list.includes(item) ? list.filter((i) => i !== item) : [...list, item])

  const hasHealthData = Boolean(values.accessibility.trim() || values.allergens.length || values.otherAllergy.trim())

  // Tras un error, foco en el primer campo con error (o en el resumen).
  useEffect(() => {
    const first = FIELD_ORDER.find((key) => errors[key]) ?? Object.keys(errors)[0]
    if (!first) return
    const el = document.getElementById(fieldDomId(first))
    if (el) {
      el.focus({ preventScroll: true })
      el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [errors])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const input = toInput(values)
    const parsed = registrationSchema.safeParse(input)
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await onSubmit(input)
    } catch (error) {
      reportError('Enviar inscripción', error)
      if (error instanceof ApiError && error.fields) setErrors(error.fields)
      setFormError(error instanceof ApiError ? error.message : t.genericError)
      summaryRef.current?.focus()
    } finally {
      setSubmitting(false)
    }
  }

  const err = (key: string) => errors[key]
  const errorCount = Object.keys(errors).length
  const days = sessions.filter((s) => s.kind === 'day')
  const activities = sessions.filter((s) => s.kind === 'activity')

  const sessionChoice = (s: PublicSession) => {
    const own = ownSessionIds.includes(s.id)
    const full = s.remaining <= 0 && !own
    return (
      <Choice
        key={s.id}
        label={s.title}
        hint={full ? f.full : f.remaining(s.remaining)}
        checked={values.sessionIds.includes(s.id)}
        disabled={full}
        onChange={() => set('sessionIds', toggle(values.sessionIds, s.id))}
      />
    )
  }

  return (
    <form onSubmit={submit} noValidate className={`flex flex-col gap-10 ${wide ? WIDE : ''}`}>
      <div ref={summaryRef} tabIndex={-1} aria-live="assertive" className={span}>
        {(formError || errorCount > 0) && (
          <div role="alert" className="rounded-xl border border-error p-4 text-sm">
            <p className="font-semibold text-error">{formError ?? t.errorSummary}</p>
          </div>
        )}
      </div>

      {/* Trampa para bots: invisible y fuera del orden de tabulación. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Web
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
        </label>
      </div>

      <FormSection title={t.sections.personal}>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput id="firstName" label={f.firstName} value={values.firstName} onChange={(e) => set('firstName', e.target.value)} error={err('firstName')} autoComplete="given-name" maxLength={LIMITS.name} required />
          <TextInput id="lastName" label={f.lastName} value={values.lastName} onChange={(e) => set('lastName', e.target.value)} error={err('lastName')} autoComplete="family-name" maxLength={LIMITS.name} required />
          <TextInput id="email" label={f.email} value={email} readOnly help={f.emailHelp} />
          <TextInput id="city" label={f.city} value={values.city} onChange={(e) => set('city', e.target.value)} error={err('city')} autoComplete="address-level2" maxLength={LIMITS.city} required />
          <TextInput id="phone" label={f.phone} type="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} error={err('phone')} help={f.phoneHelp} autoComplete="tel" required />
        </div>
      </FormSection>

      <FormSection title={t.sections.professional}>
        <div className={pair}>
        <TextInput id="organization" label={f.organization} value={values.organization} onChange={(e) => set('organization', e.target.value)} error={err('organization')} autoComplete="organization" maxLength={LIMITS.organization} required />
        <TextInput id="jobTitle" label={f.jobTitle} value={values.jobTitle} onChange={(e) => set('jobTitle', e.target.value)} error={err('jobTitle')} autoComplete="organization-title" maxLength={LIMITS.jobTitle} required />
        </div>
      </FormSection>

      <FormSection title={t.sections.participation}>
        <SelectInput
          id="participationType"
          label={f.participationType}
          help={f.participationHelp}
          value={values.participationType}
          onChange={(e) => set('participationType', e.target.value as ParticipationType)}
          error={err('participationType')}
          required
        >
          <option value="" disabled>
            {f.participationPlaceholder}
          </option>
          {PARTICIPATION_TYPES.map((type) => (
            <option key={type} value={type}>
              {PARTICIPATION_LABELS[type]}
            </option>
          ))}
        </SelectInput>
      </FormSection>

      <FormSection title={t.sections.attendance}>
        <ChoiceGroup id="sessionIds" legend={t.sections.attendance} help={f.attendanceHelp} error={err('sessionIds')}>
          <div className={wide ? 'grid gap-3 lg:grid-cols-3' : 'contents'}>{days.map(sessionChoice)}</div>
        </ChoiceGroup>
        {activities.length > 0 && (
          <ChoiceGroup id="activities" legend={t.sections.activities}>
            {activities.map(sessionChoice)}
          </ChoiceGroup>
        )}
      </FormSection>

      <FormSection title={t.sections.certificate}>
        <ChoiceGroup id="certificate" legend={f.certificate}>
          <div className="flex gap-6">
            <Choice type="radio" name="certificate" label={f.yes} checked={values.certificate} onChange={() => set('certificate', true)} />
            <Choice type="radio" name="certificate" label={f.no} checked={!values.certificate} onChange={() => set('certificate', false)} />
          </div>
        </ChoiceGroup>
        {values.certificate && (
          <div className="grid gap-5 sm:grid-cols-[12rem_1fr]">
            <SelectInput id="idDocument.type" label={f.idType} value={values.idType} onChange={(e) => set('idType', e.target.value as FormValues['idType'])}>
              {ID_TYPES.map((type) => (
                <option key={type} value={type}>
                  {ID_TYPE_LABELS[type]}
                </option>
              ))}
            </SelectInput>
            <TextInput id="idDocument.number" label={f.idNumber} help={f.idHelp} value={values.idNumber} onChange={(e) => set('idNumber', e.target.value)} error={err('idDocument.number')} autoComplete="off" maxLength={20} required />
          </div>
        )}
      </FormSection>

      <FormSection title={t.sections.accessibility}>
        <TextArea id="accessibility" label={f.accessibility} optional={f.optional} value={values.accessibility} onChange={(e) => set('accessibility', e.target.value)} error={err('accessibility')} maxLength={LIMITS.accessibility} />
      </FormSection>

      <FormSection title={t.sections.food}>
        <ChoiceGroup id="allergens" legend={f.allergens} error={err('allergens')}>
          <div className={`grid gap-x-6 sm:grid-cols-2 ${wide ? 'lg:grid-cols-3' : ''}`}>
            {ALLERGENS.map((a) => (
              <Choice key={a.id} label={a.label} checked={values.allergens.includes(a.id)} onChange={() => set('allergens', toggle(values.allergens, a.id))} />
            ))}
          </div>
        </ChoiceGroup>
        <div className={pair}>
        <TextInput id="otherAllergy" label={f.otherAllergy} optional={f.optional} value={values.otherAllergy} onChange={(e) => set('otherAllergy', e.target.value)} error={err('otherAllergy')} maxLength={LIMITS.otherAllergy} />
        <SelectInput id="diet" label={f.diet} value={values.diet} onChange={(e) => set('diet', e.target.value as FormValues['diet'])}>
          {DIETS.map((d) => (
            <option key={d} value={d}>
              {DIET_LABELS[d]}
            </option>
          ))}
        </SelectInput>
        </div>
      </FormSection>

      <FormSection title={t.sections.observations}>
        <TextArea id="observations" label={f.observations} optional={f.optional} value={values.observations} onChange={(e) => set('observations', e.target.value)} error={err('observations')} maxLength={LIMITS.observations} rows={4} />
      </FormSection>

      <FormSection title={t.sections.privacy} className={span}>
        <dl className="grid gap-x-4 gap-y-2 rounded-xl border border-borde p-4 text-sm sm:grid-cols-[9rem_1fr]">
          {t.privacyInfo.map(([term, desc]) => (
            <div key={term} className="contents">
              <dt className="font-semibold">{term}</dt>
              <dd className="text-texto-suave">{desc}</dd>
            </div>
          ))}
          <p className="text-texto-suave sm:col-span-2">
            {t.privacyMore}{' '}
            <Link to="/privacidad" target="_blank" className="font-semibold text-acento-texto underline underline-offset-4">
              {t.privacyLink}
            </Link>
            .
          </p>
        </dl>
        <div className="flex flex-col gap-3">
          {hasHealthData && (
            <div>
              <Choice id={fieldDomId('consents.healthData')} label={t.consents.healthData} checked={values.consents.healthData} onChange={(e) => set('consents', { ...values.consents, healthData: e.target.checked })} aria-invalid={Boolean(err('consents.healthData'))} aria-describedby={err('consents.healthData') ? `${fieldDomId('consents.healthData')}-error` : undefined} />
              {err('consents.healthData') && <p id={`${fieldDomId('consents.healthData')}-error`} className="text-sm font-semibold text-error">{err('consents.healthData')}</p>}
            </div>
          )}
          <Choice label={t.consents.image} checked={values.consents.image} onChange={(e) => set('consents', { ...values.consents, image: e.target.checked })} />
          <Choice label={t.consents.communications} checked={values.consents.communications} onChange={(e) => set('consents', { ...values.consents, communications: e.target.checked })} />
          <div>
            <Choice id={fieldDomId('consents.privacy')} label={t.consents.privacy} checked={values.consents.privacy} onChange={(e) => set('consents', { ...values.consents, privacy: e.target.checked })} aria-invalid={Boolean(err('consents.privacy'))} aria-describedby={err('consents.privacy') ? `${fieldDomId('consents.privacy')}-error` : undefined} required />
            {err('consents.privacy') && <p id={`${fieldDomId('consents.privacy')}-error`} className="text-sm font-semibold text-error">{err('consents.privacy')}</p>}
          </div>
        </div>
      </FormSection>

      <button
        type="submit"
        disabled={submitting}
        className={`inline-flex h-12 items-center justify-center self-start rounded-lg bg-acento px-8 ${span} text-sm font-bold tracking-wide text-acento-contraste uppercase hover:bg-acento/85 disabled:opacity-60`}
      >
        {submitting ? t.submitting : isUpdate ? t.submitUpdate : t.submitCreate}
      </button>
    </form>
  )
}
