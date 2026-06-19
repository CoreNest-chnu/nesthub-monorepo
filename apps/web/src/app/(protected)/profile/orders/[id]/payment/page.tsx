'use client'

import {
  type SavedCardModel,
  useOrderControllerGetOrder,
  usePaymentControllerCards,
  usePaymentControllerCreate,
} from '@repo/api-client'
import { zodResolver } from '@hookform/resolvers/zod'
import confetti from 'canvas-confetti'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const NEW_CARD = 'new'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear + i)
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

const inputClass =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 placeholder:text-gray-400'
const errorClass = 'mt-1 text-xs text-red-500'

const paymentSchema = z
  .object({
    selectedCardId: z.string().min(1),
    cardNumber: z.string(),
    cardholderName: z.string(),
    expiryMonth: z.number().int().min(1).max(12),
    expiryYear: z.number().int(),
    cvv: z.string().regex(/^\d{3,4}$/, 'CVV має бути 3-4 цифри'),
    save: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.selectedCardId !== NEW_CARD) return

    if (!/^\d{13,19}$/.test(data.cardNumber)) {
      ctx.addIssue({
        code: 'custom',
        path: ['cardNumber'],
        message: 'Невірний номер картки',
      })
    }

    if (!data.cardholderName.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['cardholderName'],
        message: 'Введіть власника',
      })
    }
  })

type PaymentFormData = z.infer<typeof paymentSchema>

type PaymentPageProps = {
  params: Promise<{ id: string }>
}

type SavedCardRadioProps = {
  card: SavedCardModel
  register: ReturnType<typeof useForm<PaymentFormData>>['register']
}

const SavedCardRadio: React.FC<SavedCardRadioProps> = ({ card, register }) => (
  <label
    className={
      'flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50'
    }
  >
    <input
      type={'radio'}
      value={card.id}
      className={'cursor-pointer'}
      {...register('selectedCardId')}
    />
    <span className={'text-sm text-gray-900 font-medium uppercase'}>
      {card.brand}
    </span>
    <span className={'text-sm text-gray-700'}>{`•••• ${card.last4}`}</span>
    <span className={'text-xs text-gray-500 ml-auto'}>
      {`${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`}
    </span>
  </label>
)

export default function PaymentPage({ params }: PaymentPageProps) {
  const { id } = use(params)
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken

  const authHeaders = useMemo<Record<string, string>>(() => {
    const headers: Record<string, string> = {}

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    return headers
  }, [accessToken])

  const { data: orderData } = useOrderControllerGetOrder(id, {
    query: { enabled: status === 'authenticated' },
    request: { headers: authHeaders },
  })

  const { data: cardsData } = usePaymentControllerCards({
    query: { enabled: status === 'authenticated' },
    request: { headers: authHeaders },
  })

  const { mutateAsync: createPayment, isPending } = usePaymentControllerCreate({
    request: { headers: authHeaders },
  })

  const cards = cardsData?.data ?? []
  const order = orderData?.data

  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      selectedCardId: NEW_CARD,
      cardNumber: '',
      cardholderName: '',
      expiryMonth: 1,
      expiryYear: currentYear,
      cvv: '',
      save: false,
    },
  })

  const selectedCardId = watch('selectedCardId')

  const didAutoSelectRef = useRef(false)

  useEffect(() => {
    if (didAutoSelectRef.current) return

    const first = cards[0]

    if (first) {
      setValue('selectedCardId', first.id)
      didAutoSelectRef.current = true
    }
  }, [cards, setValue])

  useEffect(() => {
    if (!success) return

    const end = Date.now() + 1500
    const fire = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
      })

      if (Date.now() < end) {
        requestAnimationFrame(fire)
      }
    }
    fire()
  }, [success])

  const cardNumberReg = register('cardNumber')
  const cvvReg = register('cvv')

  const handleCardNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value = event.target.value.replace(/\D/g, '').slice(0, 19)
      void cardNumberReg.onChange(event)
    },
    [cardNumberReg],
  )

  const handleCvvChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4)
      void cvvReg.onChange(event)
    },
    [cvvReg],
  )

  const onSubmit = useCallback(
    async (data: PaymentFormData) => {
      try {
        await createPayment({
          data: {
            orderId: id,
            ...(data.selectedCardId === NEW_CARD
              ? {
                  cardNumber: data.cardNumber,
                  cardholderName: data.cardholderName,
                  expiryMonth: data.expiryMonth,
                  expiryYear: data.expiryYear,
                  cvv: data.cvv,
                  save: data.save,
                }
              : {
                  savedCardId: data.selectedCardId,
                  cvv: data.cvv,
                }),
          },
        })
        setSuccess(true)
      } catch {
        toast.error('Не вдалося провести оплату')
      }
    },
    [createPayment, id],
  )

  if (success) {
    return (
      <div className={'min-h-[60vh] flex items-center justify-center'}>
        <div
          className={
            'bg-white rounded-2xl border border-gray-200 p-10 max-w-md w-full text-center flex flex-col items-center gap-4'
          }
        >
          <div className={'text-5xl'}>{'🎉'}</div>
          <h1 className={'text-2xl font-bold text-gray-900'}>
            {'Ура! Оплата пройшла'}
          </h1>
          <p className={'text-sm text-gray-600'}>
            {'Дякуємо за покупку — деталі надішлемо на пошту.'}
          </p>
          <div className={'flex flex-wrap justify-center gap-3 mt-2'}>
            <Link
              href={`/profile/orders/${id}`}
              className={
                'px-5 h-11 inline-flex items-center rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700'
              }
            >
              {'Переглянути замовлення'}
            </Link>
            <Link
              href={'/'}
              className={
                'px-5 h-11 inline-flex items-center rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50'
              }
            >
              {'На головну'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className={'mx-auto flex max-w-3xl flex-col gap-6'}>
      <Link
        href={`/profile/orders/${id}`}
        className={'text-sm text-blue-600 hover:underline self-start'}
      >
        {'← Назад до замовлення'}
      </Link>

      <h1 className={'text-2xl font-bold text-black sm:text-3xl'}>{'Оплата'}</h1>

      {order && (
        <p className={'text-sm text-gray-600'}>
          {`Замовлення #${order.id.slice(0, 8)} · до сплати `}
          <span className={'font-semibold text-gray-900'}>
            {`${Number(order.totalAmount).toLocaleString('uk-UA')} ₴`}
          </span>
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={
          'bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 flex flex-col gap-5'
        }
      >
        {cards.length > 0 && (
          <fieldset className={'flex flex-col gap-2'}>
            <legend className={'text-sm text-gray-700 mb-2'}>
              {'Збережені картки'}
            </legend>
            {cards.map((card) => (
              <SavedCardRadio key={card.id} card={card} register={register} />
            ))}
            <label
              className={
                'flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50'
              }
            >
              <input
                type={'radio'}
                value={NEW_CARD}
                className={'cursor-pointer'}
                {...register('selectedCardId')}
              />
              <span className={'text-sm text-gray-900'}>{'Нова картка'}</span>
            </label>
          </fieldset>
        )}

        {selectedCardId === NEW_CARD && (
          <div className={'grid grid-cols-2 gap-4'}>
            <label className={'block col-span-2'}>
              <span className={'block text-sm text-gray-700 mb-1'}>
                {'Номер картки'}
              </span>
              <input
                type={'text'}
                inputMode={'numeric'}
                placeholder={'4111 1111 1111 1111'}
                className={inputClass}
                {...cardNumberReg}
                onChange={handleCardNumberChange}
              />
              {errors.cardNumber && (
                <p className={errorClass}>{errors.cardNumber.message}</p>
              )}
            </label>

            <label className={'block col-span-2'}>
              <span className={'block text-sm text-gray-700 mb-1'}>
                {'Ім’я власника'}
              </span>
              <input
                type={'text'}
                placeholder={'IVAN PETRENKO'}
                className={inputClass}
                {...register('cardholderName')}
              />
              {errors.cardholderName && (
                <p className={errorClass}>{errors.cardholderName.message}</p>
              )}
            </label>

            <label className={'block'}>
              <span className={'block text-sm text-gray-700 mb-1'}>
                {'Місяць'}
              </span>
              <select
                className={inputClass}
                {...register('expiryMonth', { valueAsNumber: true })}
              >
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </label>

            <label className={'block'}>
              <span className={'block text-sm text-gray-700 mb-1'}>
                {'Рік'}
              </span>
              <select
                className={inputClass}
                {...register('expiryYear', { valueAsNumber: true })}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>

            <label
              className={
                'flex items-center gap-2 col-span-2 cursor-pointer text-sm text-gray-700'
              }
            >
              <input
                type={'checkbox'}
                className={'cursor-pointer'}
                {...register('save')}
              />
              {'Зберегти картку для майбутніх оплат'}
            </label>
          </div>
        )}

        <label className={'block max-w-[140px]'}>
          <span className={'block text-sm text-gray-700 mb-1'}>{'CVV'}</span>
          <input
            type={'password'}
            inputMode={'numeric'}
            placeholder={'•••'}
            className={inputClass}
            {...cvvReg}
            onChange={handleCvvChange}
          />
          {errors.cvv && <p className={errorClass}>{errors.cvv.message}</p>}
        </label>

        <button
          type={'submit'}
          disabled={isPending}
          className={
            'py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold cursor-pointer hover:bg-gray-700 border-none font-[inherit] text-center disabled:opacity-50 disabled:cursor-not-allowed'
          }
        >
          {isPending ? 'Обробка…' : 'Оплатити'}
        </button>
      </form>
    </main>
  )
}
