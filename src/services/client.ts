export type ApiQueryValue = string | number | boolean | null | undefined
export type ApiQuery = Record<string, ApiQueryValue | ApiQueryValue[]>

export type ApiRequest = {
  endpoint: string
  query?: ApiQuery
}

export type ApiResponseType = 'json' | 'text' | 'void' | 'blob'

type RequestOptions = {
  method?: 'GET' | 'POST'
  query?: ApiQuery
  body?: BodyInit
  headers?: HeadersInit
  responseType?: ApiResponseType
  signal?: AbortSignal
  timeoutMs?: number
}

export class QbApiError extends Error {
  readonly status?: number
  readonly endpoint: string
  readonly serverMessage?: string
  override readonly cause?: unknown

  constructor({
    message,
    status,
    endpoint,
    serverMessage,
    cause,
  }: {
    message: string
    status?: number
    endpoint: string
    serverMessage?: string
    cause?: unknown
  }) {
    super(message)
    this.name = 'QbApiError'
    this.status = status
    this.endpoint = endpoint
    this.serverMessage = serverMessage
    this.cause = cause
  }
}

const appendQuery = (url: URL, query?: ApiQuery) => {
  for (const [key, rawValue] of Object.entries(query ?? {})) {
    const values = Array.isArray(rawValue) ? rawValue : [rawValue]
    for (const value of values) {
      if (value != null) url.searchParams.append(key, String(value))
    }
  }
}

const readableError = async (response: Response) => {
  const text = await response.text()
  if (!text) return response.statusText || undefined
  try {
    const parsed = JSON.parse(text) as { message?: unknown; error?: unknown }
    const message = parsed.message ?? parsed.error
    return typeof message === 'string' ? message : text
  } catch {
    return text
  }
}

export class QbApiClient {
  private authorization?: string

  constructor(
    private readonly baseUrl = '/api/v2',
    private readonly defaultTimeoutMs = 10_000,
  ) {}

  setAuthorization(authorization?: string) {
    this.authorization = authorization
  }

  private buildUrl(endpoint: string, query?: ApiQuery) {
    const base = /^https?:\/\//.test(this.baseUrl)
      ? this.baseUrl
      : `${globalThis.location?.origin ?? 'http://localhost'}${this.baseUrl}`
    const url = new URL(
      `${base.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`,
    )
    appendQuery(url, query)
    return /^https?:\/\//.test(this.baseUrl)
      ? url.toString()
      : `${url.pathname}${url.search}`
  }

  async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(
      () =>
        controller.abort(new DOMException('Request timed out', 'TimeoutError')),
      options.timeoutMs ?? this.defaultTimeoutMs,
    )
    const abortFromCaller = () => controller.abort(options.signal?.reason)
    options.signal?.addEventListener('abort', abortFromCaller, { once: true })

    try {
      const headers = new Headers(options.headers)
      if (this.authorization) headers.set('Authorization', this.authorization)

      const response = await fetch(this.buildUrl(endpoint, options.query), {
        method: options.method ?? 'GET',
        body: options.body,
        headers,
        credentials: 'same-origin',
        signal: controller.signal,
      })

      if (!response.ok) {
        const serverMessage = await readableError(response)
        throw new QbApiError({
          message:
            serverMessage || `qBittorrent request failed (${response.status}).`,
          status: response.status,
          endpoint,
          serverMessage,
        })
      }

      if (response.status === 204 || options.responseType === 'void') {
        return undefined as T
      }
      if (options.responseType === 'text') return (await response.text()) as T
      if (options.responseType === 'blob') return (await response.blob()) as T
      return (await response.json()) as T
    } catch (cause) {
      if (cause instanceof QbApiError) throw cause
      throw new QbApiError({
        message: controller.signal.aborted
          ? 'qBittorrent request was cancelled or timed out.'
          : 'Unable to reach qBittorrent.',
        endpoint,
        cause,
      })
    } finally {
      clearTimeout(timeoutId)
      options.signal?.removeEventListener('abort', abortFromCaller)
    }
  }

  getJson<T>(request: string | ApiRequest, signal?: AbortSignal) {
    const { endpoint, query } =
      typeof request === 'string' ? { endpoint: request } : request
    return this.request<T>(endpoint, { query, signal, responseType: 'json' })
  }

  getText(endpoint: string, query?: ApiQuery) {
    return this.request<string>(endpoint, { query, responseType: 'text' })
  }

  getBlob(endpoint: string, query?: ApiQuery) {
    return this.request<Blob>(endpoint, { query, responseType: 'blob' })
  }

  postForm<T = void>(
    endpoint: string,
    values: Record<string, ApiQueryValue>,
    responseType: ApiResponseType = 'void',
  ) {
    const body = new URLSearchParams()
    for (const [key, value] of Object.entries(values)) {
      if (value != null) body.set(key, String(value))
    }
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
      responseType,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
  }

  postMultipart<T = void>(
    endpoint: string,
    values: object,
    responseType: ApiResponseType = 'void',
  ) {
    const body = new FormData()
    for (const [key, value] of Object.entries(values)) {
      if (value == null) continue
      if (Array.isArray(value)) {
        for (const file of value) body.append(key, file)
      } else {
        body.append(key, String(value))
      }
    }
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
      responseType,
    })
  }
}

export const qbApi = new QbApiClient()
