'use client'

import {
  useCartControllerGetCart,
  useOrderControllerCreateOrder,
  useOrderControllerGetOrder,
} from '@repo/api-client'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { StepIndicator } from '../cart/StepIndicator'

type ShippingData = {
  city: string
  zip: string
  street: string
  building: string
}

type PaymentSummary = {
  cardHolder: string
  last4: string
}

const labelClass = 'text-sm text-gray-500'
const valueClass = 'text-sm font-medium text-gray-900'

function CheckmarkAnimation() {
  return (
    <div
      className={'flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-6'}
      style={{ animation: 'pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}
    >
      <style>{`
        @keyframes pop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes draw {
          from { stroke-dashoffset: 48; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          d="M8 20 L17 29 L32 12"
          stroke="#16a34a"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="48"
          strokeDashoffset="0"
          style={{ animation: 'draw 0.5s ease 0.3s both' }}
        />
      </svg>
    </div>
  )
}

type ConfirmedOrderViewProps = {
  orderId: string
}

function ConfirmedOrderView({ orderId }: ConfirmedOrderViewProps) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken

  const { data, isLoading, isError } = useOrderControllerGetOrder(orderId, {
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
    query: { enabled: Boolean(accessToken) },
  })

  if (isLoading) {
    return (
      <div className={'flex-1 flex items-center justify-center text-sm text-gray-500'}>
        <Loader2 size={20} className={'animate-spin mr-2'} />
        {'Завантаження…'}
      </div>
    )
  }

  if (isError || !data?.data) {
    return (
      <div className={'flex-1 flex items-center justify-center text-red-500 text-sm'}>
        {'Не вдалося завантажити замовлення'}
      </div>
    )
  }

  const order = data.data

  return (
    <div className={'min-h-screen bg-gray-50 p-6'}>
      <div className={'max-w-[680px] mx-auto'}>
        <StepIndicator current={3} />

        <div className={'bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6'}>
          <CheckmarkAnimation />

          <div className={'text-center'}>
            <p className={'text-sm text-gray-500 mb-1'}>{'Дякуємо за замовлення!'}</p>
            <h1 className={'text-4xl font-bold text-gray-900'}>
              {`#${order.id.slice(0, 8).toUpperCase()}`}
            </h1>
            <p className={'text-sm text-gray-400 mt-1'}>
              {format(new Date(order.createdAt), 'dd.MM.yyyy, HH:mm')}
            </p>
          </div>

          <div
            className={'inline-flex self-center items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200'}
          >
            <span className={'w-2 h-2 rounded-full bg-yellow-400'} />
            <span className={'text-sm font-medium text-yellow-800'}>
              {'Очікує обробки'}
            </span>
          </div>

          <hr className={'border-gray-100'} />

          <div>
            <h2 className={'text-sm font-semibold text-gray-700 mb-3'}>{'Товари'}</h2>
            <div className={'flex flex-col gap-2'}>
              {order.Items.map((item) => (
                <div key={String(item.id)} className={'flex justify-between text-sm'}>
                  <span className={'text-gray-600 flex-1 mr-2'}>
                    {`${item.productName} × ${item.quantity}`}
                  </span>
                  <span className={'text-gray-900 font-medium shrink-0'}>
                    {`${(Number(item.priceAtPurchase) * item.quantity).toLocaleString('uk-UA')} ₴`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={'flex justify-between items-center pt-3 border-t border-gray-100'}>
            <span className={'text-base font-semibold text-gray-900'}>{'Разом:'}</span>
            <span className={'text-2xl font-bold text-gray-900'}>
              {`${Number(order.totalAmount).toLocaleString('uk-UA')} ₴`}
            </span>
          </div>

          <hr className={'border-gray-100'} />

          <div>
            <h2 className={'text-sm font-semibold text-gray-700 mb-3'}>{'Адреса доставки'}</h2>
            <div className={'grid grid-cols-2 gap-2'}>
              <div>
                <p className={labelClass}>{'Місто'}</p>
                <p className={valueClass}>{order.shippingAddress.city}</p>
              </div>
              <div>
                <p className={labelClass}>{'Поштовий індекс'}</p>
                <p className={valueClass}>{order.shippingAddress.zip}</p>
              </div>
              <div>
                <p className={labelClass}>{'Вулиця'}</p>
                <p className={valueClass}>{order.shippingAddress.street}</p>
              </div>
              <div>
                <p className={labelClass}>{'Будинок'}</p>
                <p className={valueClass}>{order.shippingAddress.building}</p>
              </div>
            </div>
          </div>

          <a
            href={'/profile/orders'}
            className={
              'py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 text-center hover:bg-gray-50 transition'
            }
          >
            {'Перейти до замовлень'}
          </a>
        </div>
      </div>
    </div>
  )
}

type PreviewViewProps = {
  orderId: string
}

function PreviewView({ orderId }: PreviewViewProps) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const router = useRouter()

  const [shipping, setShipping] = useState<ShippingData | null>(null)
  const [payment, setPayment] = useState<PaymentSummary | null>(null)

  useEffect(() => {
    const s = sessionStorage.getItem('checkout_shipping')
    const p = sessionStorage.getItem('checkout_payment')
    if (!s) { router.replace('/checkout'); return }
    setShipping(JSON.parse(s) as ShippingData)
    if (p) setPayment(JSON.parse(p) as PaymentSummary)
  }, [router])

  const { data: cartData, isLoading: cartLoading } = useCartControllerGetCart({
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
    query: { enabled: Boolean(accessToken) },
  })

  const { mutateAsync: createOrder, isPending } = useOrderControllerCreateOrder({
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  })

  const cartItems = cartData?.data.Items ?? []
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.Product.price) * item.quantity,
    0,
  )

  const handleConfirm = async () => {
    if (!shipping) return
    try {
      const result = await createOrder({ data: shipping })
      const newId = String(result.data.id)
      sessionStorage.removeItem('checkout_shipping')
      sessionStorage.removeItem('checkout_payment')
      router.replace(`/orders/${newId}/confirmation`)
    } catch {
      toast.error('Не вдалось створити замовлення')
    }
  }

  if (!shipping || cartLoading) {
    return (
      <div className={'flex-1 flex items-center justify-center text-sm text-gray-500'}>
        <Loader2 size={20} className={'animate-spin mr-2'} />
        {'Завантаження…'}
      </div>
    )
  }

  return (
    <div className={'min-h-screen bg-gray-50 p-6'}>
      <div className={'max-w-[1200px] mx-auto'}>
        <StepIndicator current={3} />

        <div className={'flex gap-6 items-start'}>
          <div className={'flex-1 flex flex-col gap-6'}>
            <section className={'bg-white rounded-2xl border border-gray-200 p-6'}>
              <h2 className={'text-base font-semibold text-gray-900 mb-4'}>{'Товари'}</h2>
              <div className={'flex flex-col gap-3'}>
                {cartItems.map((item) => (
                  <div key={item.id} className={'flex justify-between text-sm'}>
                    <span className={'text-gray-600 flex-1 mr-2'}>
                      {`${item.Product.name} × ${item.quantity}`}
                    </span>
                    <span className={'text-gray-900 font-medium shrink-0'}>
                      {`${(Number(item.Product.price) * item.quantity).toLocaleString('uk-UA')} ₴`}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={'bg-white rounded-2xl border border-gray-200 p-6'}>
              <h2 className={'text-base font-semibold text-gray-900 mb-4'}>{'Адреса доставки'}</h2>
              <div className={'grid grid-cols-2 gap-2 text-sm'}>
                <div>
                  <p className={labelClass}>{'Місто'}</p>
                  <p className={valueClass}>{shipping.city}</p>
                </div>
                <div>
                  <p className={labelClass}>{'Поштовий індекс'}</p>
                  <p className={valueClass}>{shipping.zip}</p>
                </div>
                <div>
                  <p className={labelClass}>{'Вулиця'}</p>
                  <p className={valueClass}>{shipping.street}</p>
                </div>
                <div>
                  <p className={labelClass}>{'Будинок'}</p>
                  <p className={valueClass}>{shipping.building}</p>
                </div>
              </div>
            </section>

            {payment && (
              <section className={'bg-white rounded-2xl border border-gray-200 p-6'}>
                <h2 className={'text-base font-semibold text-gray-900 mb-4'}>{'Оплата'}</h2>
                <div className={'flex items-center gap-3 text-sm'}>
                  <div
                    className={'w-10 h-7 rounded bg-gray-800 flex items-center justify-center'}
                  >
                    <span className={'text-white text-xs font-bold'}>{'CARD'}</span>
                  </div>
                  <div>
                    <p className={valueClass}>{payment.cardHolder}</p>
                    <p className={labelClass}>{`•••• •••• •••• ${payment.last4}`}</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          <div className={'w-[320px] shrink-0'}>
            <div className={'bg-white rounded-2xl border border-gray-200 p-6'}>
              <h2 className={'text-base font-semibold text-gray-900 mb-5'}>{'Підсумок'}</h2>

              <div className={'flex flex-col gap-2 mb-5'}>
                {cartItems.map((item) => (
                  <div key={item.id} className={'flex justify-between text-sm'}>
                    <span className={'text-gray-600 line-clamp-1 flex-1 mr-2'}>
                      {`${item.Product.name} ×${item.quantity}`}
                    </span>
                    <span className={'text-gray-800 shrink-0'}>
                      {`${(Number(item.Product.price) * item.quantity).toLocaleString('uk-UA')} ₴`}
                    </span>
                  </div>
                ))}
              </div>

              <div className={'flex justify-between text-sm py-3 border-t border-gray-200'}>
                <span className={'text-gray-500'}>{'Доставка:'}</span>
                <span className={'text-green-600 font-medium'}>{'Безкоштовно'}</span>
              </div>

              <div className={'border-t border-gray-200 py-4 flex justify-between items-center'}>
                <span className={'text-base font-semibold text-gray-900'}>{'Разом:'}</span>
                <span className={'text-xl font-bold text-gray-900'}>
                  {`${totalAmount.toLocaleString('uk-UA')} ₴`}
                </span>
              </div>

              <button
                type={'button'}
                onClick={handleConfirm}
                disabled={isPending}
                style={{ display: 'flex', width: '100%' }}
                className={
                  'py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold cursor-pointer hover:bg-gray-700 border-none font-[inherit] items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                }
              >
                {isPending && <Loader2 size={16} className={'animate-spin'} aria-hidden />}
                {isPending ? 'Оформлення…' : 'Підтвердити замовлення'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type ConfirmationViewProps = {
  orderId: string
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({ orderId }) => {
  if (orderId === 'new') {
    return <PreviewView orderId={orderId} />
  }
  return <ConfirmedOrderView orderId={orderId} />
}
