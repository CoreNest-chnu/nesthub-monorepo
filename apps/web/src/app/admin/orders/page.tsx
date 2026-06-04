'use client'

import {
  getOrderControllerAllOrdersQueryKey,
  type OrderModel,
  OrderModelStatus,
  useOrderControllerAllOrders,
} from '@repo/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { PaginationControls } from '@/src/components/ui/pagination'
import { type CustomColumn, Table } from '@/src/components/ui/Table/Table'

const take = 10

const statusLabel: Record<OrderModelStatus, string> = {
  [OrderModelStatus.pending]: 'Очікує',
  [OrderModelStatus.paid]: 'Оплачено',
  [OrderModelStatus.shipped]: 'Відправлено',
  [OrderModelStatus.completed]: 'Виконано',
  [OrderModelStatus.cancelled]: 'Скасовано',
}

const statusColor: Record<OrderModelStatus, string> = {
  [OrderModelStatus.pending]: 'bg-yellow-100 text-yellow-700',
  [OrderModelStatus.paid]: 'bg-blue-100 text-blue-700',
  [OrderModelStatus.shipped]: 'bg-purple-100 text-purple-700',
  [OrderModelStatus.completed]: 'bg-green-100 text-green-700',
  [OrderModelStatus.cancelled]: 'bg-red-100 text-red-600',
}

const allStatuses = Object.values(OrderModelStatus)

type StatusBadgeProps = {
  status: OrderModelStatus
}

const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[status]}`}
  >
    {statusLabel[status]}
  </span>
)

type StatusTabProps = {
  label: string
  count: number
  active: boolean
  onSelect: () => void
}

const StatusTab = ({ label, count, active, onSelect }: StatusTabProps) => (
  <button
    type={'button'}
    onClick={onSelect}
    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {label}
    <span
      className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${
        active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
      }`}
    >
      {count}
    </span>
  </button>
)

type OrderStatusCellProps = {
  order: OrderModel
  updatingId: string | null
  onStatusChange: (id: string, status: OrderModelStatus) => void
}

const OrderStatusCell = ({ order, updatingId, onStatusChange }: OrderStatusCellProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = allStatuses.find((s) => s === e.target.value)

      if (next) onStatusChange(order.id, next)
    },
    [order.id, onStatusChange],
  )

  return (
    <select
      value={order.status}
      disabled={updatingId === order.id}
      onChange={handleChange}
      className={
        'text-xs rounded-lg border border-gray-200 px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50 bg-white'
      }
    >
      {allStatuses.map((s) => (
        <option key={s} value={s}>
          {statusLabel[s]}
        </option>
      ))}
    </select>
  )
}

export default function AdminOrdersPage() {
  const queryClient = useQueryClient()
  const { data: session, status: authStatus } = useSession()

  const [activeStatus, setActiveStatus] = useState<OrderModelStatus | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

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
    () => (activeStatus ? allOrders.filter((o) => o.status === activeStatus) : allOrders),
    [allOrders, activeStatus],
  )

  const totalPages = Math.max(1, Math.ceil(orders.length / take))
  const paginated = orders.slice((page - 1) * take, page * take)

  const handleStatusChange = useCallback(
    async (id: string, status: OrderModelStatus) => {
      setUpdatingId(id)

      try {
        // TODO: replace with Orval-generated hook once backend endpoint is added
        const res = await fetch(`/api/admin/orders/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken ?? ''}`,
          },
          body: JSON.stringify({ status }),
        })

        if (!res.ok) throw new Error('Не вдалося оновити статус')

        await queryClient.invalidateQueries({ queryKey: getOrderControllerAllOrdersQueryKey() })
        toast.success('Статус оновлено')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Не вдалося оновити статус')
      } finally {
        setUpdatingId(null)
      }
    },
    [session?.accessToken, queryClient],
  )

  const columns = useMemo<CustomColumn<OrderModel>[]>(
    () => [
      {
        id: 'index',
        header: '#',
        contentPosition: 'left',
        cellClass: 'w-12 text-gray-400',
        cell: ({ row }) => row.index + 1,
      },
      {
        id: 'id',
        header: 'ID',
        contentPosition: 'left',
        cellClass: 'font-mono text-xs text-gray-500',
        cell: ({ row: { original } }) => `${original.id.slice(0, 8)}…`,
      },
      {
        accessorKey: 'createdAt',
        header: 'Дата',
        contentPosition: 'left',
        cellClass: 'text-sm text-gray-700',
        cell: ({ row: { original } }) =>
          new Date(original.createdAt).toLocaleDateString('uk-UA'),
      },
      {
        id: 'user',
        header: 'Користувач',
        contentPosition: 'left',
        cellClass: 'font-mono text-xs text-gray-500',
        cell: ({ row: { original } }) => `${original.userId.slice(0, 8)}…`,
      },
      {
        id: 'items',
        header: 'Товарів',
        contentPosition: 'center',
        cellClass: 'text-sm text-gray-600',
        cell: ({ row: { original } }) => original.Items.length,
      },
      {
        accessorKey: 'totalAmount',
        header: 'Сума',
        contentPosition: 'left',
        cellClass: 'text-sm font-medium text-gray-900',
        cell: ({ row: { original } }) =>
          `₴${Number(original.totalAmount).toFixed(2)}`,
      },
      {
        accessorKey: 'status',
        header: 'Статус',
        contentPosition: 'left',
        cell: ({ row: { original } }) => <StatusBadge status={original.status} />,
      },
      {
        id: 'statusChange',
        header: 'Змінити',
        contentPosition: 'left',
        cell: ({ row: { original } }) => (
          <OrderStatusCell
            order={original}
            updatingId={updatingId}
            onStatusChange={handleStatusChange}
          />
        ),
      },
    ],
    [updatingId, handleStatusChange],
  )

  const handlePageChange = useCallback((p: number) => { setPage(p) }, [])
  const handleSelectAll = useCallback(() => { setActiveStatus(undefined); setPage(1) }, [])
  const handleSelectPending = useCallback(() => { setActiveStatus(OrderModelStatus.pending); setPage(1) }, [])
  const handleSelectPaid = useCallback(() => { setActiveStatus(OrderModelStatus.paid); setPage(1) }, [])
  const handleSelectShipped = useCallback(() => { setActiveStatus(OrderModelStatus.shipped); setPage(1) }, [])
  const handleSelectCompleted = useCallback(() => { setActiveStatus(OrderModelStatus.completed); setPage(1) }, [])
  const handleSelectCancelled = useCallback(() => { setActiveStatus(OrderModelStatus.cancelled); setPage(1) }, [])

  const countFor = useCallback(
    (s: OrderModelStatus) => allOrders.filter((o) => o.status === s).length,
    [allOrders],
  )

  if (isLoading) {
    return (
      <div className={'flex flex-col gap-4'}>
        <h2 className={'text-lg font-semibold text-gray-900'}>{'Замовлення'}</h2>
        <div className={'bg-white rounded-2xl border border-gray-200 overflow-hidden'}>
          <div className={'p-8 text-center text-sm text-gray-500'}>{'Завантаження…'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex items-center justify-between'}>
        <h2 className={'text-lg font-semibold text-gray-900'}>{'Замовлення'}</h2>
        <span className={'text-sm text-gray-500'}>{`Всього: ${allOrders.length}`}</span>
      </div>

      <div className={'flex items-center gap-1 flex-wrap'}>
        <StatusTab
          label={'Всі'}
          count={allOrders.length}
          active={activeStatus === undefined}
          onSelect={handleSelectAll}
        />
        <StatusTab
          label={statusLabel[OrderModelStatus.pending]}
          count={countFor(OrderModelStatus.pending)}
          active={activeStatus === OrderModelStatus.pending}
          onSelect={handleSelectPending}
        />
        <StatusTab
          label={statusLabel[OrderModelStatus.paid]}
          count={countFor(OrderModelStatus.paid)}
          active={activeStatus === OrderModelStatus.paid}
          onSelect={handleSelectPaid}
        />
        <StatusTab
          label={statusLabel[OrderModelStatus.shipped]}
          count={countFor(OrderModelStatus.shipped)}
          active={activeStatus === OrderModelStatus.shipped}
          onSelect={handleSelectShipped}
        />
        <StatusTab
          label={statusLabel[OrderModelStatus.completed]}
          count={countFor(OrderModelStatus.completed)}
          active={activeStatus === OrderModelStatus.completed}
          onSelect={handleSelectCompleted}
        />
        <StatusTab
          label={statusLabel[OrderModelStatus.cancelled]}
          count={countFor(OrderModelStatus.cancelled)}
          active={activeStatus === OrderModelStatus.cancelled}
          onSelect={handleSelectCancelled}
        />
      </div>

      <div className={'bg-white rounded-sm border border-gray-200 overflow-hidden'}>
        {paginated.length === 0 ? (
          <div className={'p-8 text-center text-sm text-gray-500'}>{'Замовлень немає'}</div>
        ) : (
          <Table data={paginated} columns={columns} borderless />
        )}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          prevText={'Назад'}
          nextText={'Вперед'}
        />
      )}
    </div>
  )
}
