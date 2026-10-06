import type { ID_TYPES, DIETS, AllergenId, ParticipationType, RegistrationData, RegistrationInput } from '../../../shared/registration'

/*
 * Valores del formulario y su conversión al cuerpo de la API. Los valores
 * pueden estar incompletos (p. ej. privacidad sin marcar): la validación con
 * el esquema compartido decide si se envían.
 */

/** Cuerpo enviado a la API: como RegistrationInput pero con la casilla de privacidad aún sin validar. */
export type FormInput = Omit<RegistrationInput, 'consents'> & {
  consents: { privacy: boolean; healthData: boolean; image: boolean; communications: boolean }
}

export interface PublicSession {
  id: string
  title: string
  date: string
  kind: 'day' | 'activity'
  remaining: number
}

export interface FormValues {
  firstName: string
  lastName: string
  phone: string
  city: string
  organization: string
  jobTitle: string
  participationType: ParticipationType | ''
  sessionIds: string[]
  certificate: boolean
  idType: (typeof ID_TYPES)[number]
  idNumber: string
  accessibility: string
  allergens: AllergenId[]
  otherAllergy: string
  diet: (typeof DIETS)[number]
  observations: string
  consents: { privacy: boolean; healthData: boolean; image: boolean; communications: boolean }
  website: string
}

/** Valores iniciales: inscripción guardada o, si no hay, el nombre de la cuenta. */
export function initialValues(saved: RegistrationData | null, displayName: string): FormValues {
  if (saved) {
    return {
      ...saved,
      idType: saved.idDocument?.type ?? 'dni',
      idNumber: saved.idDocument?.number ?? '',
      consents: { ...saved.consents, privacy: true },
      website: '',
    }
  }
  const [first = '', ...rest] = displayName.trim().split(/\s+/)
  return {
    firstName: first,
    lastName: rest.join(' '),
    phone: '',
    city: '',
    organization: '',
    jobTitle: '',
    participationType: '',
    sessionIds: [],
    certificate: false,
    idType: 'dni',
    idNumber: '',
    accessibility: '',
    allergens: [],
    otherAllergy: '',
    diet: 'ninguna',
    observations: '',
    consents: { privacy: false, healthData: false, image: false, communications: false },
    website: '',
  }
}

/** Valores del formulario → cuerpo de la API (mismo esquema que el servidor). */
export function toInput(v: FormValues): FormInput {
  const { idType, idNumber, participationType, ...rest } = v
  return {
    ...rest,
    participationType: participationType as ParticipationType,
    idDocument: v.certificate ? { type: idType, number: idNumber } : undefined,
  }
}
