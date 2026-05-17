'use client'

import {
  getCartControllerGetCartQueryKey,
  useCartControllerAddItem,
} from '@repo/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { toast } from 'sonner'

export const useAddToCart = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useCartControllerAddItem({
    request: {
      headers: session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {},
    },
  })

  const addToCart = useCallback(
    async (productId: string, qty = 1) => {
      if (!session) {
        router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`)

        return
      }
      try {
        await mutateAsync({ data: { productId, qty } })
        toast.success('Товар додано до кошика')
        queryClient.invalidateQueries({
          queryKey: getCartControllerGetCartQueryKey(),
        })
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Помилка додавання до кошика',
        )
      }
    },
    [session, router, pathname, mutateAsync, queryClient],
  )

  return { addToCart, isPending }
}
