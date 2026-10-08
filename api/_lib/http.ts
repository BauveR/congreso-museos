import { ZodError } from 'zod'
import { fieldErrors } from '../../shared/registration.js'
import { CapacityError } from '../../shared/sessions.js'
import { assertSafeMode } from './env.js'

export class HttpError extends Error {
  readonly status: number
  readonly details?: Record<string, unknown>

  constructor(status: number, message: string, details?: Record<string, unknown>) {
    super(message)
    this.status = status
    this.details = details
  }
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  })
}

/** Lee el cuerpo JSON con límite de tamaño (evita cuerpos enormes). */
export async function readJson(request: Request, maxBytes = 32_000): Promise<unknown> {
  const text = await request.text()
  if (text.length > maxBytes) throw new HttpError(413, 'Cuerpo demasiado grande')
  try {
    return JSON.parse(text)
  } catch {
    throw new HttpError(400, 'JSON no válido')
  }
}

/** ¿La petición viene de una cuenta de administración? (solo se consulta ante un 500). */
async function isAdminRequest(request: Request): Promise<boolean> {
  try {
    const { requireAdmin } = await import('./auth.js')
    await requireAdmin(request)
    return true
  } catch {
    return false
  }
}

/**
 * Envuelve un manejador: errores conocidos → respuesta JSON con su código;
 * cualquier otro → 500 con una referencia (`ref`) que también va al log de
 * Vercel. El detalle técnico (`detail`) solo se devuelve a administración,
 * para el panel de diagnóstico; al resto, nada interno.
 */
export function handler(fn: (request: Request) => Promise<Response>) {
  return async (request: Request): Promise<Response> => {
    try {
      assertSafeMode()
      return await fn(request)
    } catch (error) {
      if (error instanceof HttpError) return json({ error: error.message, ...error.details }, error.status)
      if (error instanceof ZodError) return json({ error: 'Datos no válidos', fields: fieldErrors(error) }, 422)
      if (error instanceof CapacityError) {
        return json({ error: error.message, sessionId: error.sessionId }, 409)
      }
      const ref = crypto.randomUUID().slice(0, 8)
      console.error(`[api] ref=${ref}`, error)
      const detail = (await isAdminRequest(request)) ? String(error instanceof Error ? error.stack ?? error.message : error) : undefined
      return json({ error: 'Error interno', ref, detail }, 500)
    }
  }
}
