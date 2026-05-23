'use client'

import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export type CreateProductDto = {
  name: string
  description?: string
  price: number
  categoryId: string
  stock: number
  imageUrl?: string
}

function hasMessage(value: unknown): value is { message: unknown } {
  return typeof value === 'object' && value !== null && 'message' in value
}

function extractMessage(value: unknown): string | undefined {
  if (hasMessage(value) && typeof value.message === 'string') {
    return value.message
  }

  return undefined
}

export const useCreateProduct = () => {
  const { data: session } = useSession()

  return useMutation({
    mutationFn: async (dto: CreateProductDto): Promise<unknown> => {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.accessToken
            ? { Authorization: `Bearer ${session.accessToken}` }
            : {}),
        },
        body: JSON.stringify(dto),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        let message = res.statusText

        try {
          const body: unknown = JSON.parse(text)
          message = extractMessage(body) ?? message
        } catch {
          // fallback to statusText
        }

        throw new Error(message)
      }

      const data: unknown = await res.json()

      return data
    },
  })
}
