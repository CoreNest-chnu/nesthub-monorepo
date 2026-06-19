'use client'

import { useOrderControllerGetOrder } from '@repo/api-client'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { use } from 'react'

import { StatusBadge } from '../../../../../components/orders/StatusBadge'

type OrderPageProps = {
  params: Promise<{ id: string }>
}

export default function OrderPage({ params }: OrderPageProps) {
  const { id } = use(params)
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const { data, isLoading, isError } = useOrderControllerGetOrder(id, {
    query: { enabled: status === 'authenticated' },
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  })

  if (isLoading) {
    return (
      <p className={'text-sm text-gray-500'}>{'Завантаження замовлення…'}</p>
    )
  }

  if (isError || !data?.data) {
    return (
      <div className={'flex flex-col gap-3'}>
        <p className={'text-sm text-red-500'}>
          {'Не вдалося завантажити замовлення'}
        </p>
        <Link
          href={'/profile/orders'}
          className={'text-sm text-blue-600 hover:underline'}
        >
          {'← Назад до замовлень'}
        </Link>
      </div>
    )
  }

  const order = data.data
  const itemsCount = order.Items.reduce(
    (sum, { quantity }) => sum + quantity,
    0,
  )
  const totalAmount = Number(order.totalAmount)
  const { shippingAddress } = order

  return (
    <main className={'mx-auto flex max-w-5xl flex-col gap-6'}>
      <Link
        href={'/profile/orders'}
        className={'text-sm text-blue-600 hover:underline self-start'}
      >
        {'← Назад до замовлень'}
      </Link>

      <div className={'flex items-center gap-3 flex-wrap'}>
        <h1 className={'text-2xl font-bold text-black sm:text-3xl'}>
          {`Замовлення #${order.id.slice(0, 8)}`}
        </h1>
        <StatusBadge status={order.status} />
      </div>

      <p className={'text-sm text-gray-500'}>
        {format(new Date(order.createdAt), 'dd.MM.yyyy HH:mm')}
      </p>

      {order.status === 'pending' && (
        <Link
          href={`/profile/orders/${order.id}/payment`}
          className={
            'px-5 h-11 self-start inline-flex items-center rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700'
          }
        >
          {'Оплатити Замовлення'}
        </Link>
      )}

      <section className={'bg-white rounded-2xl border border-gray-200 p-4 sm:p-6'}>
        <h2 className={'text-base font-semibold text-gray-900 mb-4'}>
          {`Товари (${itemsCount})`}
        </h2>

        <div className={'flex flex-col divide-y divide-gray-100'}>
          {order.Items.map((item) => {
            const lineTotal = Number(item.priceAtPurchase) * item.quantity

            return (
              <div
                key={item.id}
                className={'flex items-center justify-between py-3'}
              >
                <div className={'flex flex-col gap-1 min-w-0 flex-1 mr-4'}>
                  <Link
                    href={`/products/${item.productId}`}
                    className={
                      'text-sm text-blue-600 hover:underline line-clamp-1'
                    }
                  >
                    {item.productName}
                  </Link>
                  <span className={'text-xs text-gray-500'}>
                    {`${Number(item.priceAtPurchase).toLocaleString('uk-UA')} ₴ × ${item.quantity}`}
                  </span>
                </div>
                <span
                  className={
                    'text-sm font-medium text-gray-900 shrink-0 min-w-[90px] text-right'
                  }
                >
                  {`${lineTotal.toLocaleString('uk-UA')} ₴`}
                </span>
              </div>
            )
          })}
        </div>

        <div
          className={
            'mt-4 pt-4 border-t border-gray-200 flex justify-between items-center'
          }
        >
          <span className={'text-base font-semibold text-gray-900'}>
            {'Разом:'}
          </span>
          <span className={'text-xl font-bold text-gray-900'}>
            {`${totalAmount.toLocaleString('uk-UA')} ₴`}
          </span>
        </div>
      </section>

      <section className={'bg-white rounded-2xl border border-gray-200 p-4 sm:p-6'}>
        <h2 className={'text-base font-semibold text-gray-900 mb-4'}>
          {'Адреса доставки'}
        </h2>
        <dl className={'grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2'}>
          <div>
            <dt className={'text-gray-500'}>{'Місто'}</dt>
            <dd className={'text-gray-900 font-medium'}>
              {shippingAddress.city}
            </dd>
          </div>
          <div>
            <dt className={'text-gray-500'}>{'Поштовий індекс'}</dt>
            <dd className={'text-gray-900 font-medium'}>
              {shippingAddress.zip}
            </dd>
          </div>
          <div className={'col-span-2'}>
            <dt className={'text-gray-500'}>{'Вулиця'}</dt>
            <dd className={'text-gray-900 font-medium'}>
              {shippingAddress.street}
            </dd>
          </div>
          <div>
            <dt className={'text-gray-500'}>{'Будинок'}</dt>
            <dd className={'text-gray-900 font-medium'}>
              {shippingAddress.building}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
