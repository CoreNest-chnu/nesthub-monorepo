import { CartItemModel } from '@repo/api-client'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type CartItemRowProps = {
  item: CartItemModel
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { Product: product } = item
  const unitPrice = Number(product.price)
  const subtotal = unitPrice * item.quantity

  return (
    <div
      className={
        'flex items-center gap-4 py-4 border-b border-gray-100 last:border-0'
      }
    >
      <div
        className={
          'w-16 h-16 bg-gray-100 rounded-lg shrink-0 relative overflow-hidden'
        }
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes={'64px'}
            className={'object-cover'}
          />
        ) : (
          <div
            className={
              'flex items-center justify-center h-full text-xs text-gray-400'
            }
          >
            {'Фото'}
          </div>
        )}
      </div>

      <div className={'flex-1 min-w-0'}>
        <Link
          href={`/products/${item.productId}`}
          className={'text-sm text-blue-600 hover:underline line-clamp-2'}
        >
          {product.name}
        </Link>
      </div>

      <input
        type={'number'}
        value={item.quantity}
        min={1}
        readOnly
        className={
          'w-12 border border-gray-200 rounded px-2 py-1 text-sm text-center outline-none'
        }
      />

      <span
        className={
          'text-sm font-medium text-gray-800 min-w-[90px] text-right shrink-0'
        }
      >
        {`${subtotal.toLocaleString('uk-UA')} ₴`}
      </span>

      <button
        type={'button'}
        className={
          'text-gray-300 hover:text-red-400 cursor-pointer bg-transparent border-none p-1 shrink-0'
        }
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
