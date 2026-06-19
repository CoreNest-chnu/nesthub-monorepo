'use client'

import { useOrderControllerAllOrders } from '@repo/api-client'
import { useSession } from 'next-auth/react'

import { OrderRow } from '../../../../components/orders/OrderRow'

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const { data, isLoading, isError } = useOrderControllerAllOrders({
    query: { enabled: status === 'authenticated' },
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  })

  const orders = data?.data ?? []

  if (isLoading) {
    return (
      <div className={''}>
        <p className={'text-gray-500'}>{'Завантаження замовлень...'}</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={''}>
        <p className={'text-red-500'}>{'Не вдалося завантажити замовлення'}</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className={''}>
        <div
          className={
            'rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center'
          }
        >
          <h2 className={'text-lg font-semibold text-black'}>
            {'Замовлень поки немає'}
          </h2>

          <p className={'mt-2 text-sm text-gray-500'}>
            {'Коли ви оформите перше замовлення, воно зʼявиться тут.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className={''}>
      <div className={'mx-auto flex max-w-5xl flex-col gap-4'}>
        <h1 className={'mb-2 text-2xl font-bold text-black sm:text-3xl'}>
          {'Мої замовлення'}
        </h1>

        {orders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </div>
    </main>
  )
}
