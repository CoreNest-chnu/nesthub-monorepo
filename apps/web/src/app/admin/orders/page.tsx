'use client'

import {
  type OrderModel,
  OrderModelStatus,
  useOrderControllerAllOrders,
} from '@repo/api-client'
import { useSession } from 'next-auth/react'
import { useMemo, useState } from 'react'
import { type CustomColumn, Table } from '@/src/components/ui/Table/Table'
import { PaginationControls } from '@/src/components/ui/pagination'

const take = 10

const statusLabel: Record<string, string> = {
  [OrderModelStatus.pending]: 'Очікує',
  [OrderModelStatus.paid]: 'Оплачено',
  [OrderModelStatus.shipped]: 'Відправлено',
  [OrderModelStatus.completed]: 'Виконано',
  [OrderModelStatus.cancelled]: 'Скасовано',
}

const statusColor: Record<string, string> = {
  [OrderModelStatus.pending]: 'bg-yellow-100 text-yellow-700',
  [OrderModelStatus.paid]: 'bg-blue-100 text-blue-700',
  [OrderModelStatus.shipped]: 'bg-purple-100 text-purple-700',
  [OrderModelStatus.completed]: 'bg-green-100 text-green-700',
  [OrderModelStatus.cancelled]: 'bg-red-100 text-red-600',
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const [page, setPage] = useState(1)

  const { data, isLoading } = useOrderControllerAllOrders({
    query: { enabled: status === 'authenticated' },
    request: {
      headers: session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {},
    },
  })

  const allOrders = data?.data ?? []
  // FIXME: client-side pagination — replace with server-side once BE supports it
  const totalPages = Math.max(1, Math.ceil(allOrders.length / take))
  const orders = allOrders.slice((page - 1) * take, page * take)

  const columns = useMemo<CustomColumn<OrderModel>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID замовлення',
        contentPosition: 'left',
        cell: ({ row: { original } }) => `${original.id.slice(0, 8)}…`,
        cellClass: 'font-mono text-gray-500',
      },
      {
        accessorKey: 'userId',
        header: 'ID користувача',
        contentPosition: 'left',
        cell: ({ row: { original } }) => `${original.userId.slice(0, 8)}…`,
        cellClass: 'font-mono text-gray-700',
      },
      {
        accessorKey: 'status',
        header: 'Статус',
        contentPosition: 'left',
        cell: ({ row: { original } }) => {
          const color =
            statusColor[original.status] ?? 'bg-gray-100 text-gray-600'
          const label = statusLabel[original.status] ?? original.status

          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
            >
              {label}
            </span>
          )
        },
      },
      {
        accessorKey: 'totalAmount',
        header: 'Сума',
        contentPosition: 'left',
        cell: ({ row: { original } }) =>
          `₴${Number(original.totalAmount).toFixed(2)}`,
        cellClass: 'font-medium text-gray-900',
      },
      {
        id: 'items',
        header: 'Товарів',
        contentPosition: 'center',
        cell: ({ row: { original } }) => original.Items.length,
        cellClass: 'text-gray-500',
      },
      {
        accessorKey: 'createdAt',
        header: 'Дата',
        contentPosition: 'left',
        cell: ({ row: { original } }) =>
          new Date(original.createdAt).toLocaleDateString('uk-UA'),
        cellClass: 'text-gray-500',
      },
    ],
    [],
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

      <div
        className={'bg-white rounded-sm border border-gray-200 overflow-hidden'}
      >
        {orders.length === 0 ? (
          <div className={'p-8 text-center text-sm text-gray-500'}>
            {'Замовлень немає'}
          </div>
        ) : (
          <Table data={orders} columns={columns} borderless />
        )}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          prevText={'Назад'}
          nextText={'Вперед'}
        />
      )}
    </div>
  )
}
