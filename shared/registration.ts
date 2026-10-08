import { z } from 'zod'

// Mensajes de error genéricos de zod en español (los específicos se definen abajo).
z.config(z.locales.es())
// Sin compilar validadores con Function(): la CSP de la web no permite 'unsafe-eval'.
z.config({ jitless: true })

/*
 * Esquema de inscripción compartido por el navegador (validación inmediata)
 * y el servidor (validación definitiva). Es la única fuente de verdad de los
 * campos, sus límites y sus reglas.
 */

export const PARTICIPATION_TYPES = ['ponente', 'asistente', 'organizacion'] as const
export type ParticipationType = (typeof PARTICIPATION_TYPES)[number]
export const PARTICIPATION_LABELS: Record<ParticipationType, string> = {
  ponente: 'Ponente o moderador/a de mesa',
  asistente: 'Asistente / público',
  organizacion: 'Organización',
}

/** Los 14 alérgenos de declaración obligatoria (Reglamento UE 1169/2011, anexo II). */
export const ALLERGENS = [
  { id: 'gluten', label: 'Cereales con gluten' },
  { id: 'crustaceos', label: 'Crustáceos' },
  { id: 'huevo', label: 'Huevo' },
  { id: 'pescado', label: 'Pescado' },
  { id: 'cacahuete', label: 'Cacahuetes' },
  { id: 'soja', label: 'Soja' },
  { id: 'lacteos', label: 'Leche y derivados (incluida la lactosa)' },
  { id: 'frutos-cascara', label: 'Frutos de cáscara' },
  { id: 'apio', label: 'Apio' },
  { id: 'mostaza', label: 'Mostaza' },
  { id: 'sesamo', label: 'Granos de sésamo' },
  { id: 'sulfitos', label: 'Dióxido de azufre y sulfitos' },
  { id: 'altramuces', label: 'Altramuces' },
  { id: 'moluscos', label: 'Moluscos' },
] as const
export type AllergenId = (typeof ALLERGENS)[number]['id']
const ALLERGEN_IDS = ALLERGENS.map((a) => a.id) as [AllergenId, ...AllergenId[]]

export const DIETS = ['ninguna', 'vegetariana', 'vegana'] as const
export const DIET_LABELS: Record<(typeof DIETS)[number], string> = {
  ninguna: 'Sin preferencia',
  vegetariana: 'Vegetariana',
  vegana: 'Vegana',
}

export const ID_TYPES = ['dni', 'nie', 'pasaporte'] as const
export const ID_TYPE_LABELS: Record<(typeof ID_TYPES)[number], string> = {
  dni: 'DNI',
  nie: 'NIE',
  pasaporte: 'Pasaporte',
}

export const LIMITS = {
  name: 80,
  city: 80,
  organization: 120,
  jobTitle: 120,
  accessibility: 500,
  otherAllergy: 200,
  observations: 1000,
  maxSessions: 20,
} as const

/** Quita caracteres de control y espacios repetidos. */
export function cleanText(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Igual que cleanText pero conserva los saltos de línea (textos largos). */
export function cleanMultiline(value: string): string {
  return value
    .split('\n')
    .map((line) => cleanText(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE'

/** DNI: 8 dígitos + letra de control. */
export function isValidDni(value: string): boolean {
  const match = /^(\d{8})([A-Z])$/.exec(value.toUpperCase())
  if (!match) return false
  return DNI_LETTERS[Number(match[1]) % 23] === match[2]
}

/** NIE: X/Y/Z + 7 dígitos + letra de control (X=0, Y=1, Z=2). */
export function isValidNie(value: string): boolean {
  const match = /^([XYZ])(\d{7})([A-Z])$/.exec(value.toUpperCase())
  if (!match) return false
  const prefix = { X: '0', Y: '1', Z: '2' }[match[1] as 'X' | 'Y' | 'Z']
  return DNI_LETTERS[Number(prefix + match[2]) % 23] === match[3]
}

/** Pasaporte: formato libre razonable (varía por país). */
export function isValidPassport(value: string): boolean {
  return /^[A-Z0-9]{5,15}$/.test(value.toUpperCase())
}

/**
 * Teléfono: dígitos con separadores habituales y prefijo internacional
 * opcional. Entre 9 y 15 dígitos (E.164).
 */
export function isValidPhone(value: string): boolean {
  // Prefijo opcional al inicio, también entre paréntesis: "+34 …" o "(+34) …".
  if (!/^\(?\+?[\d\s().-]+$/.test(value)) return false
  const digits = value.replace(/\D/g, '')
  return digits.length >= 9 && digits.length <= 15
}

const text = (min: number, max: number, message: string) =>
  z
    .string()
    .transform(cleanText)
    .pipe(z.string().min(min, message).max(max, `Máximo ${max} caracteres`))

const optionalText = (max: number) =>
  z
    .string()
    .transform(cleanMultiline)
    .pipe(z.string().max(max, `Máximo ${max} caracteres`))
    .optional()
    .default('')

export const registrationSchema = z
  .object({
    firstName: text(1, LIMITS.name, 'Indica tu nombre'),
    lastName: text(1, LIMITS.name, 'Indica tus apellidos'),
    phone: z
      .string()
      .transform(cleanText)
      .refine(isValidPhone, 'Teléfono no válido (9 a 15 dígitos, con prefijo si es internacional)'),
    city: text(2, LIMITS.city, 'Indica tu ciudad de procedencia'),
    organization: text(2, LIMITS.organization, 'Indica tu entidad, institución u organización'),
    jobTitle: text(2, LIMITS.jobTitle, 'Indica tu cargo o profesión'),
    participationType: z.enum(PARTICIPATION_TYPES, 'Elige el tipo de participación'),
    sessionIds: z
      .array(z.string().min(1).max(64))
      .min(1, 'Marca al menos un día o actividad')
      .max(LIMITS.maxSessions)
      .refine((ids) => new Set(ids).size === ids.length, 'Hay días repetidos'),
    certificate: z.boolean(),
    idDocument: z
      .object({
        type: z.enum(ID_TYPES),
        number: z.string().transform((v) => cleanText(v).replace(/[\s-]/g, '').toUpperCase()),
      })
      .optional(),
    accessibility: optionalText(LIMITS.accessibility),
    allergens: z
      .array(z.enum(ALLERGEN_IDS))
      .max(ALLERGENS.length)
      .default([])
      .refine((ids) => new Set(ids).size === ids.length, 'Hay alérgenos repetidos'),
    otherAllergy: optionalText(LIMITS.otherAllergy),
    diet: z.enum(DIETS).default('ninguna'),
    observations: optionalText(LIMITS.observations),
    consents: z.object({
      privacy: z.literal(true, 'Debes aceptar la política de privacidad'),
      healthData: z.boolean().default(false),
      image: z.boolean().default(false),
      communications: z.boolean().default(false),
    }),
    /** Trampa para bots: campo oculto que una persona nunca rellena. */
    website: z.string().max(0, 'Envío no válido').optional().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.certificate) {
      const doc = data.idDocument
      const valid =
        doc &&
        ((doc.type === 'dni' && isValidDni(doc.number)) ||
          (doc.type === 'nie' && isValidNie(doc.number)) ||
          (doc.type === 'pasaporte' && isValidPassport(doc.number)))
      if (!valid) {
        ctx.addIssue({
          code: 'custom',
          path: ['idDocument', 'number'],
          message: 'Documento no válido: revisa el número y la letra',
        })
      }
    }
    const hasHealthData = Boolean(data.accessibility || data.allergens.length || data.otherAllergy)
    if (hasHealthData && !data.consents.healthData) {
      ctx.addIssue({
        code: 'custom',
        path: ['consents', 'healthData'],
        message: 'Necesitamos tu consentimiento para tratar los datos de accesibilidad y alergias',
      })
    }
  })
  // Sin certificado no se guarda ningún documento de identidad.
  .transform(({ website: _website, ...data }) => (data.certificate ? data : { ...data, idDocument: undefined }))

export type RegistrationInput = z.input<typeof registrationSchema>
export type RegistrationData = z.output<typeof registrationSchema>

/** Convierte los errores de zod en { 'ruta.del.campo': 'mensaje' } (el primero por campo). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.')
    if (!(key in out)) out[key] = issue.message
  }
  return out
}
