import Link from 'next/link'

type OrderSummaryProps = {
  totalItems: number
  totalAmount: number
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  totalItems,
  totalAmount,
}) => (
  <div className={'w-[320px] shrink-0'}>
    <div className={'bg-white rounded-2xl border border-gray-200 p-6'}>
      <h2 className={'text-base font-semibold text-gray-900 mb-5'}>
        {'Ваше замовлення'}
      </h2>

      <div className={'flex flex-col gap-3 mb-5'}>
        <div className={'flex justify-between text-sm'}>
          <span
            className={'text-gray-500'}
          >{`Товари (${totalItems})`}</span>
          <span
            className={'text-gray-800'}
          >{`${totalAmount.toLocaleString('uk-UA')} ₴`}</span>
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
