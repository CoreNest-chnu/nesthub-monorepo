export interface ApiError {
  message: string
  error: string
  statusCode: number
}

export async function fetcher<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, options)
  const body = [204, 205, 304].includes(res.status) ? null : await res.text()
  const parsed = body ? JSON.parse(body) : {}

  if (!res.ok) {
    const err = parsed as ApiError
    throw new Error(err.message ?? res.statusText)
  }

  return { data: parsed, status: res.status, headers: res.headers } as T
}
