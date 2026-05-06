'use client'

import {
  getProductControllerFindbyIdQueryKey,
  productControllerFindbyId,
  useCartControllerGetCart,
} from '@repo/api-client'
import type { CartItemModel, ProductModel } from '@repo/api-client'
import { useQueries } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const steps = ['Кошик', 'Доставка', 'Оплата', 'Підтвердження']

const StepIndicator: React.FC = () => (
  <div className={'flex items-center mb-8'}>
    {steps.map((step, i) => (
      <div key={step} className={'flex items-center flex-1 last:flex-none'}>
        <div
          className={`flex items-center gap-2 ${
            i === 0 ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <span
            className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold ${
              i === 0 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {i + 1}
          </span>
          <span className={'text-sm'}>{step}</span>
        </div>
        {i < steps.length - 1 && (
          <div className={'flex-1 h-px bg-gray-200 mx-3'} />
        )}
      </div>
    ))}
  </div>
)

type CartItemRowProps = {
  item: CartItemModel
  product: ProductModel | undefined
  isLoading: boolean
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item, product, isLoading }) => {
  const unitPrice = Number(product?.price ?? 0)
  const subtotal = unitPrice * item.quantity

  if (isLoading) {
    return (
      <div className={'flex items-center gap-4 py-4 border-b border-gray-100 animate-pulse'}>
        <div className={'w-16 h-16 bg-gray-200 rounded-lg shrink-0'} />
        <div className={'flex-1 flex flex-col gap-2'}>
          <div className={'h-4 bg-gray-200 rounded w-3/4'} />
          <div className={'h-3 bg-gray-200 rounded w-1/4'} />
        </div>
      </div>
    )
  }

  return (
    <div className={'flex items-center gap-4 py-4 border-b border-gray-100 last:border-0'}>
      <div className={'w-16 h-16 bg-gray-100 rounded-lg shrink-0 relative overflow-hidden'}>
        {product?.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes={'64px'}
            className={'object-cover'}
          />
        ) : (
          <div className={'flex items-center justify-center h-full text-xs text-gray-400'}>
            {'Фото'}
          </div>
        )}
      </div>

      <div className={'flex-1 min-w-0'}>
        <Link
          href={`/products/${item.productId}`}
          className={'text-sm text-blue-600 hover:underline line-clamp-2'}
        >
          {product?.name ?? '—'}
        </Link>
      </div>

      <input
        type={'number'}
        value={item.quantity}
        min={1}
        readOnly
        className={'w-12 border border-gray-200 rounded px-2 py-1 text-sm text-center outline-none'}
      />

      <span className={'text-sm font-medium text-gray-800 min-w-[90px] text-right shrink-0'}>
        {`${subtotal.toLocaleString('uk-UA')} ₴`}
      </span>

      <button
        type={'button'}
        className={'text-gray-300 hover:text-red-400 cursor-pointer bg-transparent border-none p-1 shrink-0'}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const userId = session?.user.id
  const accessToken = session?.accessToken

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?returnUrl=/cart')
    }
  }, [status, router])

  const { data: cartData, isLoading: cartLoading } = useCartControllerGetCart(
    userId ?? '',
    {
      request: {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      },
      query: { enabled: Boolean(userId) && Boolean(accessToken) },
    },
  )

  const cartItems = (cartData?.data.Items as CartItemModel[] | undefined) ?? []

  const productQueries = useQueries({
    queries: cartItems.map((item) => ({
      queryKey: getProductControllerFindbyIdQueryKey(item.productId),
      queryFn: () => productControllerFindbyId(item.productId),
    })),
  })

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const totalAmount = cartItems.reduce((sum, item, i) => {
    const price = Number(productQueries[i]?.data?.data.price ?? 0)
    return sum + price * item.quantity
  }, 0)

  if (status === 'loading' || status === 'unauthenticated' || cartLoading) {
    return (
      <div className={'flex-1 flex items-center justify-center text-sm text-gray-500'}>
        {'Завантаження…'}
      </div>
    )
  }

  return (
    <div className={'min-h-screen bg-gray-50 p-6'}>
      <div className={'max-w-[1200px] mx-auto'}>
        <h1 className={'text-2xl font-semibold text-gray-900 mb-1'}>{'Кошик'}</h1>
        <p className={'text-sm text-gray-500 mb-6'}>{`(${totalItems} товарів)`}</p>

        <StepIndicator />

        <div className={'flex gap-6 items-start'}>
          {/* Список товарів */}
          <section className={'flex-1 bg-white rounded-2xl border border-gray-200 p-6'}>
            <h2 className={'text-base font-semibold text-gray-900 mb-2'}>
              {'Товари в кошику'}
            </h2>
            {cartItems.length === 0 ? (
              <p className={'text-sm text-gray-500 py-8 text-center'}>{'Кошик порожній'}</p>
            ) : (
              cartItems.map((item, i) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  product={productQueries[i]?.data?.data}
                  isLoading={productQueries[i]?.isLoading ?? false}
                />
              ))
            )}
          </section>

          {/* Підсумок */}
          <div className={'w-[320px] shrink-0'}>
            <div className={'bg-white rounded-2xl border border-gray-200 p-6'}>
              <h2 className={'text-base font-semibold text-gray-900 mb-5'}>
                {'Ваше замовлення'}
              </h2>

              <div className={'flex flex-col gap-3 mb-5'}>
                <div className={'flex justify-between text-sm'}>
                  <span className={'text-gray-500'}>{`Товари (${totalItems})`}</span>
                  <span className={'text-gray-800'}>{`${totalAmount.toLocaleString('uk-UA')} ₴`}</span>
                </div>
                <div className={'flex justify-between text-sm'}>
                  <span className={'text-gray-500'}>{'Знижка'}</span>
                  <span className={'text-gray-800'}>{'0 ₴'}</span>
                </div>
                <div className={'flex justify-between text-sm'}>
                  <span className={'text-gray-500'}>{'Доставка'}</span>
                  <span className={'text-gray-800'}>{'Безкоштовно'}</span>
                </div>
              </div>

              <div className={'border-t border-gray-200 py-4 flex justify-between items-center'}>
                <span className={'text-base font-semibold text-gray-900'}>{'Разом:'}</span>
                <span className={'text-xl font-bold text-gray-900'}>
                  {`${totalAmount.toLocaleString('uk-UA')} ₴`}
                </span>
              </div>

              <button
                type={'button'}
                style={{ display: 'block', width: '100%' }}
                className={
                  'py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold cursor-pointer hover:bg-gray-700 border-none font-[inherit] text-center'
                }
              >
                {'Оформити замовлення'}
              </button>

              <div className={'mt-5 flex flex-col gap-2'}>
                <p className={'text-sm text-gray-700'}>{'Промокод:'}</p>
                <div className={'flex gap-2'}>
                  <input
                    type={'text'}
                    placeholder={'Введіть промокод'}
                    className={
                      'flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400'
                    }
                  />
                  <button
                    type={'button'}
                    className={
                      'shrink-0 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 bg-white font-[inherit]'
                    }
                  >
                    {'Застосувати'}
                  </button>
                </div>
              </div>

              <label className={'mt-4 flex items-start gap-2 cursor-pointer'}>
                <input type={'checkbox'} className={'cursor-pointer mt-0.5 shrink-0'} />
                <span className={'text-sm text-gray-600'}>
                  {'Погоджуюсь з умовами використання'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
