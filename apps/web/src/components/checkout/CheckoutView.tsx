'use client'

import {
  useCartControllerGetCart,
  useOrderControllerCreateOrder,
} from '@repo/api-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { CartItemsList } from '../cart/CartItemsList'
import { EmptyCart } from '../cart/EmptyCart'
import { StepIndicator } from '../cart/StepIndicator'
import { CheckoutOrderSummary } from './CheckoutOrderSummary'

const addressSchema = z.object({
  city: z.string().min(1, 'Введіть місто'),
  zip: z.string().min(1, 'Введіть поштовий індекс'),
  street: z.string().min(1, 'Введіть вулицю'),
  building: z.string().min(1, 'Введіть будинок'),
})

type AddressFormData = z.infer<typeof addressSchema>

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 placeholder:text-gray-400'
const errorClass = 'mt-1 text-xs text-red-500'

export const CheckoutView: React.FC = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const accessToken = session?.accessToken

  const { data: cartData, isLoading: cartLoading } = useCartControllerGetCart({
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
    query: { enabled: Boolean(accessToken) },
  })

  const { mutateAsync: createOrder, isPending } = useOrderControllerCreateOrder(
    {
      request: {
        headers: accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : {},
      },
    },
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  })

  const onSubmit = async (formData: AddressFormData) => {
    try {
      const result = await createOrder({ data: formData })
      router.push(`/orders/${result.data.id}/confirmation`)
    } catch {
      toast.error('Не вдалось оформити замовлення')
    }
  }

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
          {'Потрібна авторизація, щоб переглянути цю сторінку.'}
        </p>
        <Link
          href={'/login?returnUrl=/checkout'}
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

  if (cartItems.length === 0) {
    return <EmptyCart />
  }

  const hasOverStock = cartItems.some((item) => item.isOverStock)
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.Product.price) * item.quantity,
    0,
  )

  return (
    <div className={'min-h-screen bg-gray-50 p-6'}>
      <div className={'max-w-[1200px] mx-auto'}>
        <StepIndicator current={1} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={'flex gap-6 items-start'}>
            <div className={'flex-1 flex flex-col gap-6'}>
              {hasOverStock && (
                <div
                  className={
                    'flex items-center gap-2 px-4 py-3 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm'
                  }
                >
                  {'⚠ Деякі товари мають обмежену кількість на складі'}
                </div>
              )}

              <CartItemsList items={cartItems} />

              <section
                className={'bg-white rounded-2xl border border-gray-200 p-6'}
              >
                <h2 className={'text-base font-semibold text-gray-900 mb-5'}>
                  {'Адреса доставки'}
                </h2>

                <div className={'grid grid-cols-2 gap-4'}>
                  <div>
                    <label className={'block text-sm text-gray-700 mb-1'}>
                      {'Місто'}
                      <span className={'text-red-500'}>{'*'}</span>
                    </label>
                    <input
                      {...register('city')}
                      placeholder={'Київ'}
                      className={inputClass}
                    />
                    {errors.city && (
                      <p className={errorClass}>{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={'block text-sm text-gray-700 mb-1'}>
                      {'Поштовий індекс'}
                      <span className={'text-red-500'}>{'*'}</span>
                    </label>
                    <input
                      {...register('zip')}
                      placeholder={'01001'}
                      className={inputClass}
                    />
                    {errors.zip && (
                      <p className={errorClass}>{errors.zip.message}</p>
                    )}
                  </div>

                  <div className={'col-span-2'}>
                    <label className={'block text-sm text-gray-700 mb-1'}>
                      {'Вулиця'}
                      <span className={'text-red-500'}>{'*'}</span>
                    </label>
                    <input
                      {...register('street')}
                      placeholder={'вул. Хрещатик'}
                      className={inputClass}
                    />
                    {errors.street && (
                      <p className={errorClass}>{errors.street.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={'block text-sm text-gray-700 mb-1'}>
                      {'Будинок'}
                      <span className={'text-red-500'}>{'*'}</span>
                    </label>
                    <input
                      {...register('building')}
                      placeholder={'10'}
                      className={inputClass}
                    />
                    {errors.building && (
                      <p className={errorClass}>{errors.building.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={'block text-sm text-gray-700 mb-1'}>
                      {'Квартира'}
                      <span className={'text-gray-400 text-xs ml-1'}>
                        {'(необов’язково)'}
                      </span>
                    </label>
                    <input placeholder={'25'} className={inputClass} />
                  </div>
                </div>
              </section>
            </div>

            <CheckoutOrderSummary
              items={cartItems}
              totalAmount={totalAmount}
              hasOverStock={hasOverStock}
              isPending={isPending}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
