'use client'

import { useCartControllerGetCart } from '@repo/api-client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { CartItemsList } from './CartItemsList'
import { OrderSummary } from './OrderSummary'
import { StepIndicator } from './StepIndicator'

export const CartView: React.FC = () => {
  const { data: session, status } = useSession()

  const userId = session?.user.id
  const accessToken = session?.accessToken

  const { data: cartData, isLoading: cartLoading } = useCartControllerGetCart(
    userId ?? '',
    {
      request: {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      },
      query: { enabled: Boolean(userId) && Boolean(accessToken) },
    },
  )

  if (status === 'loading' || cartLoading) {
    return (
      <div
        className={
          'flex-1 flex items-center justify-center text-sm text-gray-500'
        }
      >
        {'Завантаження…'}
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div
        className={
          'flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center'
        }
      >
        <p className={'text-base text-gray-700'}>
          {'Потрібна авторизація, щоб переглянути кошик.'}
        </p>
        <Link
          href={'/login?returnUrl=/cart'}
          className={
            'px-6 h-11 inline-flex items-center rounded-lg bg-gray-900 text-white text-sm font-medium'
          }
        >
          {'Увійти'}
        </Link>
      </div>
    )
  }

  const cartItems = cartData?.data.Items ?? []

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.Product.price) * item.quantity,
    0,
  )

  return (
    <div className={'min-h-screen bg-gray-50 p-6'}>
      <div className={'max-w-[1200px] mx-auto'}>
        <h1 className={'text-2xl font-semibold text-gray-900 mb-1'}>
          {'Кошик'}
        </h1>
        <p
          className={'text-sm text-gray-500 mb-6'}
        >{`(${totalItems} товарів)`}</p>

        <StepIndicator />

        <div className={'flex gap-6 items-start'}>
          <CartItemsList items={cartItems} />
          <OrderSummary totalItems={totalItems} totalAmount={totalAmount} />
        </div>
      </div>
    </div>
  )
}
