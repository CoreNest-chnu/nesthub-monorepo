'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  type PromoResultModel,
  useCartControllerGetCart,
  useOrderControllerCreateOrder,
} from '@repo/api-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { clearAppliedPromo, readAppliedPromo } from '../../lib/promoStorage'
import { type Address, useAddressStore } from '../../store/useAddressStore'
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

type SavedAddressChipProps = {
  address: Address
  onApply: (address: Address) => void
}

const SavedAddressChip: React.FC<SavedAddressChipProps> = ({
  address,
  onApply,
}) => {
  const handleApply = useCallback(() => onApply(address), [onApply, address])

  return (
    <button
      type={'button'}
      onClick={handleApply}
      className={
        'inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-100'
      }
    >
      <span className={'font-medium'}>{address.label}</span>
      <span className={'text-gray-400'}>
        {`${address.city}, ${address.street}`}
      </span>
    </button>
  )
}

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
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      },
    },
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  })

  const savedAddresses = useAddressStore((s) => s.items)

  const [promoResult, setPromoResult] = useState<PromoResultModel | null>(null)
  const [mode, setMode] = useState<'edit' | 'review'>('edit')
  const [reviewData, setReviewData] = useState<AddressFormData | null>(null)
  const [prefilled, setPrefilled] = useState(false)

  useEffect(() => {
    setPromoResult(readAppliedPromo())
  }, [])

  const applyAddress = useCallback(
    (address: Address) => {
      reset({
        city: address.city,
        zip: address.zip,
        street: address.street,
        building: address.building,
      })
    },
    [reset],
  )

  // Prefill once with the default saved address (or the first one).
  useEffect(() => {
    if (prefilled || savedAddresses.length === 0) {
      return
    }
    const preferred =
      savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0]

    if (preferred) {
      applyAddress(preferred)
      setPrefilled(true)
    }
  }, [prefilled, savedAddresses, applyAddress])

  const onSubmit = async (formData: AddressFormData) => {
    if (mode === 'edit') {
      setReviewData(formData)
      setMode('review')

      return
    }

    try {
      const result = await createOrder({
        data: { ...formData, promoCode: promoResult?.code },
      })
      clearAppliedPromo()
      const orderId = z.string().parse(result.data.id)
      router.push(`/profile/orders/${orderId}/payment`)
    } catch {
      toast.error('Не вдалось оформити замовлення')
    }
  }

  const handleBackToEdit = useCallback(() => {
    setMode('edit')
  }, [])

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
    <div className={'min-h-screen bg-gray-50 p-4 sm:p-6'}>
      <div className={'max-w-[1200px] mx-auto'}>
        <StepIndicator current={mode === 'review' ? 2 : 1} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={'flex flex-col gap-6 lg:flex-row lg:items-start'}>
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
                className={
                  'bg-white rounded-2xl border border-gray-200 p-4 sm:p-6'
                }
              >
                <div className={'flex items-center justify-between mb-5'}>
                  <h2 className={'text-base font-semibold text-gray-900'}>
                    {'Адреса доставки'}
                  </h2>
                  {mode === 'review' && (
                    <button
                      type={'button'}
                      onClick={handleBackToEdit}
                      className={
                        'text-sm text-blue-600 hover:underline cursor-pointer bg-transparent border-none p-0'
                      }
                    >
                      {'Редагувати'}
                    </button>
                  )}
                </div>

                {mode === 'edit' && savedAddresses.length > 0 && (
                  <div className={'mb-5 flex flex-col gap-2'}>
                    <span className={'text-xs font-medium text-gray-500'}>
                      {'Збережені адреси'}
                    </span>
                    <div className={'flex flex-wrap gap-2'}>
                      {savedAddresses.map((address) => (
                        <SavedAddressChip
                          key={address.id}
                          address={address}
                          onApply={applyAddress}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={
                    mode === 'review'
                      ? 'hidden'
                      : 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                  }
                >
                  <label className={'block'}>
                    <span className={'block text-sm text-gray-700 mb-1'}>
                      {'Місто'}
                      <span className={'text-red-500'}>{'*'}</span>
                    </span>
                    <input
                      {...register('city')}
                      placeholder={'Київ'}
                      className={inputClass}
                    />
                    {errors.city && (
                      <p className={errorClass}>{errors.city.message}</p>
                    )}
                  </label>

                  <label className={'block'}>
                    <span className={'block text-sm text-gray-700 mb-1'}>
                      {'Поштовий індекс'}
                      <span className={'text-red-500'}>{'*'}</span>
                    </span>
                    <input
                      {...register('zip')}
                      placeholder={'01001'}
                      className={inputClass}
                    />
                    {errors.zip && (
                      <p className={errorClass}>{errors.zip.message}</p>
                    )}
                  </label>

                  <label className={'block sm:col-span-2'}>
                    <span className={'block text-sm text-gray-700 mb-1'}>
                      {'Вулиця'}
                      <span className={'text-red-500'}>{'*'}</span>
                    </span>
                    <input
                      {...register('street')}
                      placeholder={'вул. Хрещатик'}
                      className={inputClass}
                    />
                    {errors.street && (
                      <p className={errorClass}>{errors.street.message}</p>
                    )}
                  </label>

                  <label className={'block'}>
                    <span className={'block text-sm text-gray-700 mb-1'}>
                      {'Будинок'}
                      <span className={'text-red-500'}>{'*'}</span>
                    </span>
                    <input
                      {...register('building')}
                      placeholder={'10'}
                      className={inputClass}
                    />
                    {errors.building && (
                      <p className={errorClass}>{errors.building.message}</p>
                    )}
                  </label>

                  <label className={'block'}>
                    <span className={'block text-sm text-gray-700 mb-1'}>
                      {'Квартира'}
                      <span className={'text-gray-400 text-xs ml-1'}>
                        {'(необов’язково)'}
                      </span>
                    </span>
                    <input placeholder={'25'} className={inputClass} />
                  </label>
                </div>

                {mode === 'review' && reviewData && (
                  <dl
                    className={
                      'grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm'
                    }
                  >
                    <div>
                      <dt className={'text-gray-500'}>{'Місто'}</dt>
                      <dd className={'text-gray-900 font-medium'}>
                        {reviewData.city}
                      </dd>
                    </div>
                    <div>
                      <dt className={'text-gray-500'}>{'Поштовий індекс'}</dt>
                      <dd className={'text-gray-900 font-medium'}>
                        {reviewData.zip}
                      </dd>
                    </div>
                    <div className={'sm:col-span-2'}>
                      <dt className={'text-gray-500'}>{'Вулиця'}</dt>
                      <dd className={'text-gray-900 font-medium'}>
                        {reviewData.street}
                      </dd>
                    </div>
                    <div>
                      <dt className={'text-gray-500'}>{'Будинок'}</dt>
                      <dd className={'text-gray-900 font-medium'}>
                        {reviewData.building}
                      </dd>
                    </div>
                  </dl>
                )}
              </section>
            </div>

            <CheckoutOrderSummary
              items={cartItems}
              totalAmount={totalAmount}
              hasOverStock={hasOverStock}
              isPending={isPending}
              promoResult={promoResult}
              mode={mode}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
