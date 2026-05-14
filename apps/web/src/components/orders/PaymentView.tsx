'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { StepIndicator } from '../cart/StepIndicator'

const paymentSchema = z.object({
  cardHolder: z.string().min(2, "Введіть ім'я власника картки"),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, 'Введіть 16 цифр номера картки'),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Формат MM/РР'),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, 'CVV — 3 або 4 цифри'),
})

type PaymentFormData = z.infer<typeof paymentSchema>

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 placeholder:text-gray-400'
const errorClass = 'mt-1 text-xs text-red-500'

type PaymentViewProps = {
  orderId: string
}

export const PaymentView: React.FC<PaymentViewProps> = ({ orderId }) => {
  const router = useRouter()

  useEffect(() => {
    if (!sessionStorage.getItem('checkout_shipping')) {
      router.replace('/checkout')
    }
  }, [router])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentFormData>({ resolver: zodResolver(paymentSchema) })

  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, '').slice(0, 16)

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  const onSubmit = (data: PaymentFormData) => {
    sessionStorage.setItem(
      'checkout_payment',
      JSON.stringify({ cardHolder: data.cardHolder, last4: data.cardNumber.slice(-4) }),
    )
    router.push(`/orders/${orderId}/confirmation`)
  }

  return (
    <div className={'min-h-screen bg-gray-50 p-6'}>
      <div className={'max-w-[1200px] mx-auto'}>
        <StepIndicator current={2} />

        <div className={'flex gap-6 items-start justify-center'}>
          <div className={'flex-1 max-w-lg'}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={'bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5'}
            >
              <h2 className={'text-base font-semibold text-gray-900'}>
                {'Дані оплати'}
              </h2>

              <div
                className={'rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-5 text-white flex flex-col gap-4 select-none'}
              >
                <div className={'text-xs text-gray-400 uppercase tracking-widest'}>
                  {'Банківська картка'}
                </div>
                <div className={'text-lg font-mono tracking-[0.2em]'}>
                  {watch('cardNumber')
                    ? watch('cardNumber')
                        .replace(/\D/g, '')
                        .slice(0, 16)
                        .replace(/(.{4})/g, '$1 ')
                        .trim()
                    : '•••• •••• •••• ••••'}
                </div>
                <div className={'flex justify-between text-sm'}>
                  <span>{watch('cardHolder') || "ІМ'Я ВЛАСНИКА"}</span>
                  <span>{watch('expiry') || 'MM/РР'}</span>
                </div>
              </div>

              <label className={'block'}>
                <span className={'block text-sm text-gray-700 mb-1'}>
                  {"Ім'я власника картки"}
                  <span className={'text-red-500'}>{'*'}</span>
                </span>
                <input
                  {...register('cardHolder')}
                  placeholder={'IVAN PETRENKO'}
                  className={inputClass}
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.cardHolder && (
                  <p className={errorClass}>{errors.cardHolder.message}</p>
                )}
              </label>

              <label className={'block'}>
                <span className={'block text-sm text-gray-700 mb-1'}>
                  {'Номер картки'}
                  <span className={'text-red-500'}>{'*'}</span>
                </span>
                <input
                  {...register('cardNumber')}
                  placeholder={'0000 0000 0000 0000'}
                  maxLength={16}
                  inputMode={'numeric'}
                  className={inputClass}
                  onChange={(e) => {
                    e.target.value = formatCardNumber(e.target.value)
                  }}
                />
                {errors.cardNumber && (
                  <p className={errorClass}>{errors.cardNumber.message}</p>
                )}
              </label>

              <div className={'grid grid-cols-2 gap-4'}>
                <label className={'block'}>
                  <span className={'block text-sm text-gray-700 mb-1'}>
                    {'Термін дії'}
                    <span className={'text-red-500'}>{'*'}</span>
                  </span>
                  <input
                    {...register('expiry')}
                    placeholder={'MM/РР'}
                    maxLength={5}
                    inputMode={'numeric'}
                    className={inputClass}
                    onChange={(e) => {
                      e.target.value = formatExpiry(e.target.value)
                    }}
                  />
                  {errors.expiry && (
                    <p className={errorClass}>{errors.expiry.message}</p>
                  )}
                </label>

                <label className={'block'}>
                  <span className={'block text-sm text-gray-700 mb-1'}>
                    {'CVV / CVC'}
                    <span className={'text-red-500'}>{'*'}</span>
                  </span>
                  <input
                    {...register('cvv')}
                    placeholder={'•••'}
                    maxLength={4}
                    inputMode={'numeric'}
                    type={'password'}
                    className={inputClass}
                  />
                  {errors.cvv && (
                    <p className={errorClass}>{errors.cvv.message}</p>
                  )}
                </label>
              </div>

              <button
                type={'submit'}
                className={
                  'py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold cursor-pointer hover:bg-gray-700 border-none font-[inherit] flex items-center justify-center gap-2'
                }
              >
                {'Перейти до підтвердження'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
