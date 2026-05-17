'use client'

import {
  type PromoResultModel,
  usePromoControllerApply,
} from '@repo/api-client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import {
  clearAppliedPromo,
  readAppliedPromo,
  writeAppliedPromo,
} from '../../lib/promoStorage'

type OrderSummaryProps = {
  totalItems: number
  totalAmount: number
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  totalItems,
  totalAmount,
}) => {
  const { data: session } = useSession()
  const [code, setCode] = useState('')
  const [promoResult, setPromoResult] = useState<PromoResultModel | null>(null)

  useEffect(() => {
    setPromoResult(readAppliedPromo())
  }, [])

  const { mutateAsync: applyPromo, isPending } = usePromoControllerApply({
    request: {
      headers: session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {},
    },
  })

  const handleApply = useCallback(async () => {
    if (!code.trim()) return
    try {
      const response = await applyPromo({ data: { code: code.trim() } })
      setPromoResult(response.data)
      writeAppliedPromo(response.data)
      toast.success('Промокод застосовано')
    } catch {
      toast.error('Невірний промокод')
    }
  }, [applyPromo, code])

  const handleRemovePromo = useCallback(() => {
    setPromoResult(null)
    setCode('')
    clearAppliedPromo()
  }, [])

  const handleCodeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCode(event.target.value)
    },
    [],
  )

  const discountAmount = promoResult ? Number(promoResult.discountAmount) : 0
  const finalTotal = promoResult ? Number(promoResult.finalTotal) : totalAmount

  return (
    <div className={'w-[320px] shrink-0'}>
      <div className={'bg-white rounded-2xl border border-gray-200 p-6'}>
        <h2 className={'text-base font-semibold text-gray-900 mb-5'}>
          {'Ваше замовлення'}
        </h2>

        <div className={'flex flex-col gap-3 mb-5'}>
          <div className={'flex justify-between text-sm'}>
            <span className={'text-gray-500'}>{`Товари (${totalItems})`}</span>
            <span
              className={'text-gray-800'}
            >{`${totalAmount.toLocaleString('uk-UA')} ₴`}</span>
          </div>
          <div className={'flex justify-between text-sm'}>
            <span className={'text-gray-500'}>{'Знижка'}</span>
            <span
              className={
                discountAmount > 0 ? 'text-emerald-600' : 'text-gray-800'
              }
            >
              {discountAmount > 0
                ? `−${discountAmount.toLocaleString('uk-UA')} ₴`
                : '0 ₴'}
            </span>
          </div>
          <div className={'flex justify-between text-sm'}>
            <span className={'text-gray-500'}>{'Доставка'}</span>
            <span className={'text-gray-800'}>{'Безкоштовно'}</span>
          </div>
        </div>

        <div
          className={
            'border-t border-gray-200 py-4 flex justify-between items-center'
          }
        >
          <span className={'text-base font-semibold text-gray-900'}>
            {'Разом:'}
          </span>
          <span className={'text-xl font-bold text-gray-900'}>
            {`${finalTotal.toLocaleString('uk-UA')} ₴`}
          </span>
        </div>

        <Link
          href={'/checkout'}
          style={{ display: 'block', width: '100%' }}
          className={
            'py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold cursor-pointer hover:bg-gray-700 text-center'
          }
        >
          {'Оформити замовлення'}
        </Link>

        <div className={'mt-5 flex flex-col gap-2'}>
          <p className={'text-sm text-gray-700'}>{'Промокод:'}</p>
          {promoResult ? (
            <div
              className={
                'flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm'
              }
            >
              <span className={'font-medium'}>{promoResult.code}</span>
              <button
                type={'button'}
                aria-label={'Видалити промокод'}
                onClick={handleRemovePromo}
                className={
                  'text-emerald-700 hover:text-emerald-900 cursor-pointer bg-transparent border-none p-0.5'
                }
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className={'flex gap-2'}>
              <input
                type={'text'}
                placeholder={'Введіть промокод'}
                value={code}
                onChange={handleCodeChange}
                disabled={isPending}
                className={
                  'flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 disabled:opacity-60'
                }
              />
              <button
                type={'button'}
                onClick={handleApply}
                disabled={isPending || !code.trim()}
                className={
                  'shrink-0 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 bg-white font-[inherit] disabled:opacity-50 disabled:cursor-not-allowed'
                }
              >
                {'Застосувати'}
              </button>
            </div>
          )}
        </div>

        <label className={'mt-4 flex items-start gap-2 cursor-pointer'}>
          <input
            type={'checkbox'}
            className={'cursor-pointer mt-0.5 shrink-0'}
          />
          <span className={'text-sm text-gray-600'}>
            {'Погоджуюсь з умовами використання'}
          </span>
        </label>
      </div>
    </div>
  )
}
