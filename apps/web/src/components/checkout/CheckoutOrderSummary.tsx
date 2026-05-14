import type { CartItemWithStockModel } from '@repo/api-client'

type CheckoutOrderSummaryProps = {
  items: CartItemWithStockModel[]
  totalAmount: number
  hasOverStock: boolean
  isPending: boolean
}

export const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({
  items,
  totalAmount,
  hasOverStock,
  isPending,
}) => (
  <div className={'w-[320px] shrink-0'}>
    <div className={'bg-white rounded-2xl border border-gray-200 p-6'}>
      <h2 className={'text-base font-semibold text-gray-900 mb-5'}>
        {'Підсумок'}
      </h2>

      <div className={'flex flex-col gap-2 mb-5'}>
        {items.map((item) => (
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

      <div
        className={'flex justify-between text-sm py-3 border-t border-gray-200'}
      >
        <span className={'text-gray-500'}>{'Доставка:'}</span>
        <span className={'text-green-600 font-medium'}>{'Безкоштовно'}</span>
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
          {`${totalAmount.toLocaleString('uk-UA')} ₴`}
        </span>
      </div>

      {hasOverStock && (
        <div
          className={
            'mb-4 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs'
          }
        >
          {'⚠ Є товари з нестачею — виправте кількість.'}
        </div>
      )}

      <button
        type={'submit'}
        disabled={hasOverStock || isPending}
        style={{ display: 'block', width: '100%' }}
        className={
          'py-3.5 rounded-xl bg-gray-900 text-white text-sm font-semibold cursor-pointer hover:bg-gray-700 border-none font-[inherit] text-center disabled:opacity-50 disabled:cursor-not-allowed'
        }
      >
        {isPending ? 'Оформлення…' : 'Підтвердити замовлення'}
      </button>
    </div>
  </div>
)
