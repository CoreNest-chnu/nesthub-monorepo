import { CartItemWithStockModel } from '@repo/api-client'
import { CartItemRow } from './CartItemRow'

type CartItemsListProps = {
  items: CartItemWithStockModel[]
}

export const CartItemsList: React.FC<CartItemsListProps> = ({ items }) => (
  <section
    className={'flex-1 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6'}
  >
    <h2 className={'text-base font-semibold text-gray-900 mb-2'}>
      {'Товари в кошику'}
    </h2>
    {items.length === 0 ? (
      <p className={'text-sm text-gray-500 py-8 text-center'}>
        {'Кошик порожній'}
      </p>
    ) : (
      items.map((item) => <CartItemRow key={item.id} item={item} />)
    )}
  </section>
)
