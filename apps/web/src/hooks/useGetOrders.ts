'use client'

import { useSession } from 'next-auth/react'

import { useOrderControllerAllOrders } from '../../../../packages/api-client/src/generated/order/order'

export type OrderItem = {
  quantity: number
}

export type Order = {
  id: string
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  createdAt: string | Date
  totalAmount: number | string
  Items: OrderItem[]
}

type OrdersResponse = {
  data: Order[]
}

export const useGetOrders = () => {
  const { data: session, status } = useSession()

  const accessToken =
    typeof session?.accessToken === 'string' ? session.accessToken : undefined

  const query = useOrderControllerAllOrders<OrdersResponse>({
    query: {
      enabled: status === 'authenticated',
    },
    request: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    },
  })

  return {
    orders: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
