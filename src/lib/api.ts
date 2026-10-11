import { TIMEOUT_MS } from './connectivity'
import { reportError } from './diagnostics'
import { getAppCheckToken } from './firebaseApp'

/** Error de la API con su código y, si los hay, errores por campo. */
export class ApiError extends Error {
  readonly status: number
  readonly fields?: Record<string, string>

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

interface ErrorBody {
  error?: string
  fields?: Record<string, string>
  /** Referencia del log del servidor (errores 500). */
  ref?: string
  /** Detalle técnico (solo para administración). */
  detail?: string
}

/** fetch que anota en el diagnóstico los fallos de red y las respuestas de error. */
async function request(context: string, url: string, init?: RequestInit): Promise<Response> {
  let response: Response
  try {
    response = await fetch(url, init)
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'TimeoutError'
    const apiError = new ApiError(0, timedOut ? 'La conexión ha tardado demasiado' : 'Error de conexión')
    reportError(context, apiError, { status: 0, detail: error instanceof Error ? error.message : String(error) })
    throw apiError
  }
  return response
}

/** Lanza (y anota) el ApiError de una respuesta no 2xx. */
async function fail(context: string, response: Response, fallback: string): Promise<never> {
  const data = (await response.json().catch(() => ({}))) as ErrorBody
  const error = new ApiError(response.status, data.error ?? fallback, data.fields)
  const fields = data.fields ? Object.entries(data.fields).map(([k, v]) => `${k}: ${v}`).join('\n') : undefined
  reportError(context, error, { status: response.status, ref: data.ref, detail: data.detail ?? fields })
  throw error
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string
  /** Corte (ms). Por defecto TIMEOUT_MS en GET; las escrituras no se cortan (el servidor podría haberlas guardado). */
  timeoutMs?: number
}

/** fetch a /api con JSON y token; lanza ApiError si la respuesta no es 2xx. */
export async function api<T>(path: string, { method = 'GET', body, token, timeoutMs }: ApiOptions = {}): Promise<T> {
  const timeout = timeoutMs ?? (method === 'GET' ? TIMEOUT_MS : undefined)
  const context = `${method} /api/${path}`
  // App Check solo en escrituras con sesión: son las que podría abusar un bot.
  const appCheck = token && method !== 'GET' ? await getAppCheckToken() : undefined
  const response = await request(context, `/api/${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(appCheck ? { 'x-firebase-appcheck': appCheck } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: timeout ? AbortSignal.timeout(timeout) : undefined,
  })
  if (!response.ok) return fail(context, response, 'Error de conexión')
  return (await response.json().catch(() => ({}))) as T
}

/** Descarga un archivo de /api (p. ej. el CSV) con el token. */
export async function download(path: string, token: string, fallbackName: string) {
  const context = `GET /api/${path}`
  const response = await request(context, `/api/${path}`, { headers: { authorization: `Bearer ${token}` } })
  if (!response.ok) return fail(context, response, 'No se pudo descargar')
  const name = /filename="([^"]+)"/.exec(response.headers.get('content-disposition') ?? '')?.[1] ?? fallbackName
  const url = URL.createObjectURL(await response.blob())
  const link = Object.assign(document.createElement('a'), { href: url, download: name })
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
