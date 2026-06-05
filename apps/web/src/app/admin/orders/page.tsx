'use client'

import {
  AdminOrderModelStatus,
  getAdminControllerFindAllOrdersQueryKey,
  useAdminControllerFindAllOrders,
  useAdminControllerUpdateOrderStatus,
  type AdminOrderModel,
} from '@repo/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { PaginationControls } from '@/src/components/ui/pagination'

const take = 10

const statusLabel: Record<AdminOrderModelStatus, string> = {
  [AdminOrderModelStatus.pending]: 'Очікує',
  [AdminOrderModelStatus.paid]: 'Оплачено',
  [AdminOrderModelStatus.shipped]: 'Відправлено',
  [AdminOrderModelStatus.completed]: 'Виконано',
  [AdminOrderModelStatus.cancelled]: 'Скасовано',
}

const statusColor: Record<AdminOrderModelStatus, string> = {
  [AdminOrderModelStatus.pending]: 'bg-yellow-100 text-yellow-700',
  [AdminOrderModelStatus.paid]: 'bg-blue-100 text-blue-700',
  [AdminOrderModelStatus.shipped]: 'bg-purple-100 text-purple-700',
  [AdminOrderModelStatus.completed]: 'bg-green-100 text-green-700',
  [AdminOrderModelStatus.cancelled]: 'bg-red-100 text-red-600',
}

const validTransitions: Record<AdminOrderModelStatus, AdminOrderModelStatus[]> =
  {
    [AdminOrderModelStatus.pending]: [
      AdminOrderModelStatus.paid,
      AdminOrderModelStatus.cancelled,
    ],
    [AdminOrderModelStatus.paid]: [
      AdminOrderModelStatus.shipped,
      AdminOrderModelStatus.cancelled,
    ],
    [AdminOrderModelStatus.shipped]: [
      AdminOrderModelStatus.completed,
      AdminOrderModelStatus.cancelled,
    ],
    [AdminOrderModelStatus.completed]: [],
    [AdminOrderModelStatus.cancelled]: [],
  }

const getTransitionError = (
  from: AdminOrderModelStatus,
  to: AdminOrderModelStatus,
): string => {
  const allowed = validTransitions[from]

  if (allowed.length === 0) {
    return `Статус «${statusLabel[from]}» є кінцевим і не може бути змінений`
  }

  return `Перехід із «${statusLabel[from]}» до «${statusLabel[to]}» неможливий. Дозволено: ${allowed.map((s) => statusLabel[s]).join(', ')}`
}

const allStatuses = Object.values(AdminOrderModelStatus)

type StatusBadgeProps = {
  status: AdminOrderModelStatus
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

type StatusSelectProps = {
  value: AdminOrderModelStatus
  disabled: boolean
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const StatusSelect = ({ value, disabled, onChange }: StatusSelectProps) => (
  <select
    value={value}
    disabled={disabled}
    onChange={onChange}
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

type OrderAdminRowProps = {
  order: AdminOrderModel
  index: number
  updatingId: string | null
  onStatusChange: (
    id: string,
    currentStatus: AdminOrderModelStatus,
    newStatus: AdminOrderModelStatus,
  ) => void
}

const OrderAdminRow = ({
  order,
  index,
  updatingId,
  onStatusChange,
}: OrderAdminRowProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = allStatuses.find((s) => s === e.target.value)

      if (next) onStatusChange(order.id, order.status, next)
    },
    [order.id, order.status, onStatusChange],
  )

  return (
    <tr
      className={'border-t border-gray-100 hover:bg-gray-50 transition-colors'}
    >
      <td className={'px-4 py-3 text-sm text-gray-400'}>{index}</td>
      <td
        className={'px-4 py-3 font-mono text-xs text-gray-500'}
      >{`${order.id.slice(0, 8)}…`}</td>
      <td className={'px-4 py-3 text-sm text-gray-700'}>
        {new Date(order.createdAt).toLocaleDateString('uk-UA')}
      </td>
      <td
        className={'px-4 py-3 font-mono text-xs text-gray-500'}
      >{`${order.userId.slice(0, 8)}…`}</td>
      <td className={'px-4 py-3 text-center text-sm text-gray-600'}>
        {order.Items.length}
      </td>
      <td className={'px-4 py-3 text-sm font-medium text-gray-900'}>
        {`₴${Number(order.totalAmount).toFixed(2)}`}
      </td>
      <td className={'px-4 py-3'}>
        <StatusBadge status={order.status} />
      </td>
      <td className={'px-4 py-3'}>
        <StatusSelect
          value={order.status}
          disabled={updatingId === order.id}
          onChange={handleChange}
        />
      </td>
    </tr>
  )
}

export default function AdminOrdersPage() {
  const [activeStatus, setActiveStatus] = useState<
    AdminOrderModelStatus | undefined
  >(undefined)
  const [page, setPage] = useState(1)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const { data: session, status: authStatus } = useSession()
  const accessToken = session?.accessToken
  const queryClient = useQueryClient()

  const { data, isLoading } = useAdminControllerFindAllOrders(undefined, {
    query: { enabled: authStatus === 'authenticated' },
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  })

  const allOrders = data?.data ?? []

  const orders = useMemo(
    () =>
      activeStatus
        ? allOrders.filter((o) => o.status === activeStatus)
        : allOrders,
    [allOrders, activeStatus],
  )

  const { mutate: updateStatus } = useAdminControllerUpdateOrderStatus<Error>({
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getAdminControllerFindAllOrdersQueryKey(),
        })
        toast.success('Статус оновлено')
      },
      onError: (error) => toast.error(error.message),
    },
  })

  const totalPages = Math.max(1, Math.ceil(orders.length / take))
  const paginated = orders.slice((page - 1) * take, page * take)

  const handleStatusChange = useCallback(
    (
      id: string,
      currentStatus: AdminOrderModelStatus,
      newStatus: AdminOrderModelStatus,
    ) => {
      if (!validTransitions[currentStatus].includes(newStatus)) {
        toast.error(getTransitionError(currentStatus, newStatus))

        return
      }

      setUpdatingId(id)
      updateStatus(
        { id, data: { status: newStatus } },
        { onSettled: () => setUpdatingId(null) },
      )
    },
    [updateStatus],
  )

  const handlePageChange = useCallback((p: number) => {
    setPage(p)
  }, [])
  const handleSelectAll = useCallback(() => {
    setActiveStatus(undefined)
    setPage(1)
  }, [])
  const handleSelectPending = useCallback(() => {
    setActiveStatus(AdminOrderModelStatus.pending)
    setPage(1)
  }, [])
  const handleSelectPaid = useCallback(() => {
    setActiveStatus(AdminOrderModelStatus.paid)
    setPage(1)
  }, [])
  const handleSelectShipped = useCallback(() => {
    setActiveStatus(AdminOrderModelStatus.shipped)
    setPage(1)
  }, [])
  const handleSelectCompleted = useCallback(() => {
    setActiveStatus(AdminOrderModelStatus.completed)
    setPage(1)
  }, [])
  const handleSelectCancelled = useCallback(() => {
    setActiveStatus(AdminOrderModelStatus.cancelled)
    setPage(1)
  }, [])

  const countFor = useCallback(
    (s: AdminOrderModelStatus) =>
      allOrders.filter((o) => o.status === s).length,
    [allOrders],
  )

  if (isLoading) {
    return (
      <div className={'flex flex-col gap-4'}>
        <h2 className={'text-lg font-semibold text-gray-900'}>
          {'Замовлення'}
        </h2>
        <div
          className={
            'bg-white rounded-2xl border border-gray-200 overflow-hidden'
          }
        >
          <div className={'p-8 text-center text-sm text-gray-500'}>
            {'Завантаження…'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex items-center justify-between'}>
        <h2 className={'text-lg font-semibold text-gray-900'}>
          {'Замовлення'}
        </h2>
        <span
          className={'text-sm text-gray-500'}
        >{`Всього: ${allOrders.length}`}</span>
      </div>

      <div className={'flex items-center gap-1 flex-wrap'}>
        <StatusTab
          label={'Всі'}
          count={allOrders.length}
          active={activeStatus === undefined}
          onSelect={handleSelectAll}
        />
        <StatusTab
          label={statusLabel[AdminOrderModelStatus.pending]}
          count={countFor(AdminOrderModelStatus.pending)}
          active={activeStatus === AdminOrderModelStatus.pending}
          onSelect={handleSelectPending}
        />
        <StatusTab
          label={statusLabel[AdminOrderModelStatus.paid]}
          count={countFor(AdminOrderModelStatus.paid)}
          active={activeStatus === AdminOrderModelStatus.paid}
          onSelect={handleSelectPaid}
        />
        <StatusTab
          label={statusLabel[AdminOrderModelStatus.shipped]}
          count={countFor(AdminOrderModelStatus.shipped)}
          active={activeStatus === AdminOrderModelStatus.shipped}
          onSelect={handleSelectShipped}
        />
        <StatusTab
          label={statusLabel[AdminOrderModelStatus.completed]}
          count={countFor(AdminOrderModelStatus.completed)}
          active={activeStatus === AdminOrderModelStatus.completed}
          onSelect={handleSelectCompleted}
        />
        <StatusTab
          label={statusLabel[AdminOrderModelStatus.cancelled]}
          count={countFor(AdminOrderModelStatus.cancelled)}
          active={activeStatus === AdminOrderModelStatus.cancelled}
          onSelect={handleSelectCancelled}
        />
      </div>

      <div
        className={'bg-white rounded-sm border border-gray-200 overflow-hidden'}
      >
        <table className={'min-w-full'}>
          <thead className={'bg-gray-50'}>
            <tr>
              {[
                '#',
                'ID',
                'Дата',
                'Користувач',
                'Товарів',
                'Сума',
                'Статус',
                'Змінити',
              ].map((h) => (
                <th
                  key={h}
                  className={
                    'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'
                  }
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className={'px-4 py-8 text-center text-sm text-gray-500'}
                >
                  {'Замовлень немає'}
                </td>
              </tr>
            ) : (
              paginated.map((order, i) => (
                <OrderAdminRow
                  key={order.id}
                  order={order}
                  index={(page - 1) * take + i + 1}
                  updatingId={updatingId}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </tbody>
        </table>
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
