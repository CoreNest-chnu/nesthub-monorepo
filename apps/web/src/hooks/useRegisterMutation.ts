import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { ApiError } from '@/src/utils/apiError'

type RegisterPayload = {
  firstName: string
  lastName: string
  email: string
  password: string
}

const registerResponseSchema = z.object({ token: z.string() })

type RegisterResponse = z.infer<typeof registerResponseSchema>

async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'Registration failed')
  }

  return registerResponseSchema.parse(await response.json())
}

export function useRegisterMutation() {
  return useMutation({ mutationFn: registerUser })
}
