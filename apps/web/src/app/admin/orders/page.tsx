'use client'

import {
  type OrderModel,
  OrderModelStatus,
  useOrderControllerAllOrders,
} from '@repo/api-client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { PaginationControls } from '@/src/components/ui/pagination'

const TAKE = 10

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

const OrderRow: React.FC<{ order: OrderModel }> = ({ order }) => {
  const color = statusColor[order.status] ?? 'bg-gray-100 text-gray-600'
  const label = statusLabel[order.status] ?? order.status

  return (
    <tr className={'border-t border-gray-100 hover:bg-gray-50 transition-colors'}>
      <td className={'px-4 py-3 text-sm text-gray-500 font-mono'}>
        {`${order.id.slice(0, 8)}…`}
      </td>
      <td className={'px-4 py-3 text-sm text-gray-700 font-mono'}>
        {`${order.userId.slice(0, 8)}…`}
      </td>
      <td className={'px-4 py-3'}>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
        >
          {label}
        </span>
      </td>
      <td className={'px-4 py-3 text-sm font-medium text-gray-900'}>
        {`₴${Number(order.totalAmount).toFixed(2)}`}
      </td>
      <td className={'px-4 py-3 text-sm text-gray-500 text-center'}>
        {order.Items.length}
      </td>
      <td className={'px-4 py-3 text-sm text-gray-500'}>
        {new Date(order.createdAt).toLocaleDateString('uk-UA')}
      </td>
    </tr>
  )
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
  const totalPages = Math.max(1, Math.ceil(allOrders.length / TAKE))
  const orders = allOrders.slice((page - 1) * TAKE, page * TAKE)

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className={'p-8 text-center text-sm text-gray-500'}>
          {'Завантаження…'}
        </div>
      )
    }

    if (orders.length === 0) {
      return (
        <div className={'p-8 text-center text-sm text-gray-500'}>
          {'Замовлень немає'}
        </div>
      )
    }

    return (
      <table className={'w-full'}>
        <thead>
          <tr className={'bg-gray-50 text-left'}>
            <th
              className={
                'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'
              }
            >
              {'ID замовлення'}
            </th>
            <th
              className={
                'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'
              }
            >
              {'ID користувача'}
            </th>
            <th
              className={
                'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'
              }
            >
              {'Статус'}
            </th>
            <th
              className={
                'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'
              }
            >
              {'Сума'}
            </th>
            <th
              className={
                'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center'
              }
            >
              {'Товарів'}
            </th>
            <th
              className={
                'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'
              }
            >
              {'Дата'}
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex items-center justify-between'}>
        <h2 className={'text-lg font-semibold text-gray-900'}>{'Замовлення'}</h2>
        {!isLoading && (
          <span className={'text-sm text-gray-500'}>
            {`Всього: ${allOrders.length}`}
          </span>
        )}
      </div>

      <div
        className={
          'bg-white rounded-2xl border border-gray-200 overflow-hidden'
        }
      >
        {renderBody()}
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
