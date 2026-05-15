export interface ApiError {
  message: string
  error: string
  statusCode: number
}

export class ApiResponseError extends Error {
  statusCode: number
  data: unknown

  constructor(message: string, statusCode: number, data: unknown) {
    super(message)
    this.name = 'ApiResponseError'
    this.statusCode = statusCode
    this.data = data
  }
}

export async function fetcher<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, options)
  const body = [204, 205, 304].includes(res.status) ? null : await res.text()
  const parsed = body ? JSON.parse(body) : {}

  if (!res.ok) {
    throw new ApiResponseError(
      (parsed as ApiError).message ?? res.statusText,
      res.status,
      parsed,
    )
  }

  return { data: parsed, status: res.status, headers: res.headers } as T
}
