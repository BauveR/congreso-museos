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

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string
}

/** fetch a /api con JSON y token; lanza ApiError si la respuesta no es 2xx. */
export async function api<T>(path: string, { method = 'GET', body, token }: ApiOptions = {}): Promise<T> {
  const response = await fetch(`/api/${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = (await response.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string> }
  if (!response.ok) throw new ApiError(response.status, data.error ?? 'Error de conexión', data.fields)
  return data as T
}

/** Descarga un archivo de /api (p. ej. el CSV) con el token. */
export async function download(path: string, token: string, fallbackName: string) {
  const response = await fetch(`/api/${path}`, { headers: { authorization: `Bearer ${token}` } })
  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string }
    throw new ApiError(response.status, data.error ?? 'No se pudo descargar')
  }
  const name = /filename="([^"]+)"/.exec(response.headers.get('content-disposition') ?? '')?.[1] ?? fallbackName
  const url = URL.createObjectURL(await response.blob())
  const link = Object.assign(document.createElement('a'), { href: url, download: name })
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
