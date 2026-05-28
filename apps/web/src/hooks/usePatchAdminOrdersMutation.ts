'use client'

import { OrderModelStatus } from '@repo/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import { getOrderControllerAllOrdersQueryKey } from './useGetAdminOrders'

const statusLabel: Record<OrderModelStatus, string> = {
  [OrderModelStatus.pending]: 'Очікує',
  [OrderModelStatus.paid]: 'Оплачено',
  [OrderModelStatus.shipped]: 'Відправлено',
  [OrderModelStatus.completed]: 'Виконано',
  [OrderModelStatus.cancelled]: 'Скасовано',
}

const validTransitions: Record<OrderModelStatus, OrderModelStatus[]> = {
  [OrderModelStatus.pending]: [OrderModelStatus.paid, OrderModelStatus.cancelled],
  [OrderModelStatus.paid]: [OrderModelStatus.shipped, OrderModelStatus.cancelled],
  [OrderModelStatus.shipped]: [OrderModelStatus.completed, OrderModelStatus.cancelled],
  [OrderModelStatus.completed]: [],
  [OrderModelStatus.cancelled]: [],
}

const getTransitionError = (from: OrderModelStatus, to: OrderModelStatus): string => {
  const allowed = validTransitions[from]

  if (allowed.length === 0) {
    return `Статус «${statusLabel[from]}» є кінцевим і не може бути змінений`
  }

  return `Перехід із «${statusLabel[from]}» до «${statusLabel[to]}» неможливий. Дозволено: ${allowed.map((s) => statusLabel[s]).join(', ')}`
}

type PatchOrderStatusVars = {
  id: string
  currentStatus: OrderModelStatus
  newStatus: OrderModelStatus
}

export const usePatchAdminOrdersMutation = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  return useMutation({
    mutationFn: async ({ id, currentStatus, newStatus }: PatchOrderStatusVars) => {
      const allowed = validTransitions[currentStatus]

      if (!allowed.includes(newStatus)) {
        throw new Error(getTransitionError(currentStatus, newStatus))
      }

      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken ?? ''}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error('Не вдалося оновити статус')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getOrderControllerAllOrdersQueryKey() })
      toast.success('Статус оновлено')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
