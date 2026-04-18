import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { ApiError } from '@/src/utils/apiError'

type LoginPayload = {
  email: string
  password: string
}

const loginResponseSchema = z.object({ token: z.string() })

type LoginResponse = z.infer<typeof loginResponseSchema>

async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'Login failed')
  }

  return loginResponseSchema.parse(await response.json())
}

export function useLoginMutation() {
  return useMutation({ mutationFn: loginUser })
}
