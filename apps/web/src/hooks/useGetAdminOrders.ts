'use client'

import {
  getOrderControllerAllOrdersQueryKey,
  type OrderModel,
  type OrderModelStatus,
  useOrderControllerAllOrders,
} from '@repo/api-client'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

export { getOrderControllerAllOrdersQueryKey }

export type { OrderModel, OrderModelStatus }

type UseGetAdminOrdersParams = {
  status?: OrderModelStatus
}

export const useGetAdminOrders = ({ status }: UseGetAdminOrdersParams = {}) => {
  const { data: session, status: authStatus } = useSession()

  const { data, isLoading } = useOrderControllerAllOrders({
    query: { enabled: authStatus === 'authenticated' },
    request: {
      headers: session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {},
    },
  })

  const allOrders = data?.data ?? []

  const orders = useMemo(
    () => (status ? allOrders.filter((o) => o.status === status) : allOrders),
    [allOrders, status],
  )

  return {
    orders,
    allOrders,
    isLoading,
    token: session?.accessToken ?? '',
  }
}
