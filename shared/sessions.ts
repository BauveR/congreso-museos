/*
 * Sesiones del congreso (días y actividades con aforo) y reglas de aforo.
 *
 * Cada sesión guarda por separado su aforo (`capacity`) y su contador de
 * inscritos (`registered`). Cambiar el aforo nunca toca el contador, y el
 * contador solo cambia por la diferencia de sesiones de una inscripción,
 * así no se duplica ni se suma nada al subir o bajar el aforo.
 */

export type SessionKind = 'day' | 'activity'

export interface Session {
  id: string
  title: string
  /** Fecha ISO (AAAA-MM-DD). */
  date: string
  kind: SessionKind
  capacity: number
  registered: number
  active: boolean
  order: number
}

export interface SessionPatch {
  title?: string
  date?: string
  capacity?: number
  active?: boolean
}

export const MAX_CAPACITY = 5000

export class CapacityError extends Error {
  readonly sessionId?: string

  constructor(message: string, sessionId?: string) {
    super(message)
    this.name = 'CapacityError'
    this.sessionId = sessionId
  }
}

/** Sesiones que se añaden y se quitan al pasar de `before` a `after`. */
export function diffSessions(before: readonly string[], after: readonly string[]) {
  const prev = new Set(before)
  const next = new Set(after)
  return {
    added: [...next].filter((id) => !prev.has(id)),
    removed: [...prev].filter((id) => !next.has(id)),
  }
}

/**
 * Valida un cambio de inscripción contra las sesiones actuales y devuelve
 * los nuevos contadores. Solo cuentan las sesiones añadidas (las que ya
 * tenía la persona no ocupan una plaza nueva).
 */
export function applyRegistrationChange(
  sessions: ReadonlyMap<string, Session>,
  before: readonly string[],
  after: readonly string[],
): Map<string, number> {
  const { added, removed } = diffSessions(before, after)
  const counts = new Map<string, number>()

  for (const id of added) {
    const session = sessions.get(id)
    if (!session || !session.active) throw new CapacityError('Esta sesión no está disponible', id)
    if (session.registered >= session.capacity) {
      throw new CapacityError(`No quedan plazas para «${session.title}»`, id)
    }
    counts.set(id, session.registered + 1)
  }
  for (const id of removed) {
    const session = sessions.get(id)
    // Si la sesión ya no existe no hay contador que actualizar.
    if (session) counts.set(id, Math.max(0, session.registered - 1))
  }
  return counts
}

/** Valida un cambio de datos de sesión (sobre todo el aforo). */
export function validateSessionPatch(session: Session, patch: SessionPatch): SessionPatch {
  const clean: SessionPatch = {}
  if (patch.title !== undefined) {
    const title = patch.title.trim()
    if (title.length < 2 || title.length > 120) throw new CapacityError('El título debe tener entre 2 y 120 caracteres', session.id)
    clean.title = title
  }
  if (patch.date !== undefined) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(patch.date) || Number.isNaN(Date.parse(patch.date))) {
      throw new CapacityError('Fecha no válida (AAAA-MM-DD)', session.id)
    }
    clean.date = patch.date
  }
  if (patch.capacity !== undefined) {
    if (!Number.isInteger(patch.capacity) || patch.capacity < 0 || patch.capacity > MAX_CAPACITY) {
      throw new CapacityError(`El aforo debe ser un número entero entre 0 y ${MAX_CAPACITY}`, session.id)
    }
    if (patch.capacity < session.registered) {
      throw new CapacityError(
        `No se puede bajar el aforo a ${patch.capacity}: ya hay ${session.registered} personas inscritas`,
        session.id,
      )
    }
    clean.capacity = patch.capacity
  }
  if (patch.active !== undefined) clean.active = Boolean(patch.active)
  return clean
}

/** Sesiones iniciales: los tres días del congreso, aforo 80. */
export const DEFAULT_SESSIONS: Session[] = [
  { id: 'dia-19', title: 'Día 1 · 19 de noviembre', date: '2026-11-19', kind: 'day', capacity: 80, registered: 0, active: true, order: 1 },
  { id: 'dia-20', title: 'Día 2 · 20 de noviembre', date: '2026-11-20', kind: 'day', capacity: 80, registered: 0, active: true, order: 2 },
  { id: 'dia-21', title: 'Día 3 · 21 de noviembre', date: '2026-11-21', kind: 'day', capacity: 80, registered: 0, active: true, order: 3 },
]
