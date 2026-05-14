'use client'

import type { OrderModel } from '@repo/api-client'
import { format } from 'date-fns'
import Link from 'next/link'

import { StatusBadge } from './StatusBadge'

type OrderRowProps = {
  order: OrderModel
}

export const OrderRow = ({ order }: OrderRowProps) => {
  const itemsCount = order.Items.reduce(
    (sum, { quantity }) => sum + quantity,
    0,
  )

  return (
    <div
      className={
        'flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5'
      }
    >
      <div className={'flex flex-col gap-2'}>
        <div className={'flex items-center gap-3'}>
          <h3 className={'font-semibold text-black'}>
            {`Замовлення #${order.id.slice(0, 8)}`}
          </h3>

          <StatusBadge status={order.status} />
        </div>

        <p className={'text-sm text-gray-500'}>
          {format(new Date(order.createdAt), 'dd.MM.yyyy')}
        </p>

        <p className={'text-sm text-gray-600'}>
          {`Товарів: ${itemsCount} · Сума: ₴${Number(order.totalAmount).toFixed(2)}`}
        </p>
      </div>

      <div className={'flex items-center'}>
        <Link
          href={`/profile/orders/${order.id}`}
          className={
            'text-sm font-medium text-blue-600 transition hover:text-blue-700'
          }
        >
          {'Переглянути'}
        </Link>
      </div>
    </div>
  )
}
