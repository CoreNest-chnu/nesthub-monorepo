'use client'

import {
  getOrderControllerAllOrdersQueryKey,
  OrderModelStatus,
} from '@repo/api-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

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
    // TODO: replace fetch with Orval-generated hook once backend endpoint is ready
    mutationFn: async ({ id, currentStatus, newStatus }: PatchOrderStatusVars) => {
      const allowed = validTransitions[currentStatus]

      if (!allowed.includes(newStatus)) {
        throw new Error(getTransitionError(currentStatus, newStatus))
      }

      try {
        const res = await fetch(`/api/admin/orders/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken ?? ''}`,
          },
          body: JSON.stringify({ status: newStatus }),
        })

        if (!res.ok) throw new Error('Не вдалося оновити статус')

        await queryClient.invalidateQueries({ queryKey: getOrderControllerAllOrdersQueryKey() })
        toast.success('Статус оновлено')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Не вдалося оновити статус')
        throw err
      }
    },
  })
}
