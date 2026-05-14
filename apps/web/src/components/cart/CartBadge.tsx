'use client'

import { useCartControllerGetCart } from '@repo/api-client'
import { ShoppingCart } from 'lucide-react'
import { useSession } from 'next-auth/react'

export const CartBadge: React.FC = () => {
  const { data: session } = useSession()

  const userId = session?.user.id
  const accessToken = session?.accessToken

  const { data: cartData } = useCartControllerGetCart({
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
    query: { enabled: Boolean(userId) && Boolean(accessToken) },
  })

  const items = cartData?.data.Items ?? []
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <ShoppingCart />
      {count > 0 && (
        <span
          className={
            'absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white'
          }
        >
          {count}
        </span>
      )}
    </>
  )
}
