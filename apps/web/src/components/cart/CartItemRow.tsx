'use client'

import {
  type CartItemModel,
  getCartControllerGetCartQueryKey,
  useCartControllerUpdateItem,
} from '@repo/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

type CartItemRowProps = {
  item: CartItemModel
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { Product: product } = item
  const unitPrice = Number(product.price)

  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const [quantity, setQuantity] = useState(item.quantity)
  const subtotal = unitPrice * quantity

  const { mutateAsync: updateQuantity, isPending } =
    useCartControllerUpdateItem({
      request: {
        headers: session?.accessToken
          ? { Authorization: `Bearer ${session.accessToken}` }
          : {},
      },
    })

  const handleChange = useCallback(
    async (newQuantity: number) => {
      const prevQuantity = quantity
      setQuantity(newQuantity)
      try {
        await updateQuantity({ id: item.id, data: { qty: newQuantity } })
        await queryClient.invalidateQueries({
          queryKey: getCartControllerGetCartQueryKey(),
        })
      } catch {
        setQuantity(prevQuantity)
        toast.error('Не вдалось оновити кількість')
      }
    },
    [quantity, item.id, updateQuantity, queryClient],
  )

  const handleDecrement = useCallback(() => {
    handleChange(quantity - 1)
  }, [handleChange, quantity])

  const handleIncrement = useCallback(() => {
    handleChange(quantity + 1)
  }, [handleChange, quantity])

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

      <div className={'flex items-center gap-1'}>
        <button
          type={'button'}
          aria-label={'Зменшити кількість'}
          disabled={quantity <= 1 || isPending}
          onClick={handleDecrement}
          className={
            'flex items-center justify-center w-6 h-6 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors'
          }
        >
          <Minus size={11} />
        </button>

        <span className={'w-8 text-center text-sm font-medium'}>
          {quantity}
        </span>

        <button
          type={'button'}
          aria-label={'Збільшити кількість'}
          disabled={quantity >= product.stock || isPending}
          onClick={handleIncrement}
          className={
            'flex items-center justify-center w-6 h-6 rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors'
          }
        >
          <Plus size={11} />
        </button>
      </div>

      <span
        className={
          'text-sm font-medium text-gray-800 min-w-[90px] text-right shrink-0'
        }
      >
        {`${subtotal.toLocaleString('uk-UA')} ₴`}
      </span>

      <button
        type={'button'}
        aria-label={'Видалити товар'}
        className={
          'text-gray-300 hover:text-red-400 cursor-pointer bg-transparent border-none p-1 shrink-0'
        }
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
