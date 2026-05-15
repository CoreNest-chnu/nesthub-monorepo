'use client'

import {
  useCartControllerDeleteItem,
  useCartControllerUpdateItem,
} from '@repo/api-client'
import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { getCartControllerGetCartQueryKey } from '@repo/api-client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

export type OutOfStockItem = {
  cartItemId: string
  productName: string
  requestedQty: number
  availableQty: number
}

type OutOfStockModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: OutOfStockItem[]
}

export function OutOfStockModal({
  open,
  onOpenChange,
  items,
}: OutOfStockModalProps) {
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const queryClient = useQueryClient()

  const authHeaders: HeadersInit = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {}

  const { mutateAsync: updateItem, isPending: isUpdating } =
    useCartControllerUpdateItem({
      request: { headers: authHeaders },
    })

  const { mutateAsync: deleteItem, isPending: isDeleting } =
    useCartControllerDeleteItem({
      request: { headers: authHeaders },
    })

  const isPending = isUpdating || isDeleting

  const invalidateCart = () =>
    queryClient.invalidateQueries({ queryKey: getCartControllerGetCartQueryKey() })

  const handleUpdateAll = async () => {
    await Promise.all(
      items
        .filter((item) => item.availableQty > 0)
        .map((item) =>
          updateItem({ id: item.cartItemId, data: { qty: item.availableQty } }),
        ),
    )
    await Promise.all(
      items
        .filter((item) => item.availableQty === 0)
        .map((item) => deleteItem({ id: item.cartItemId })),
    )
    await invalidateCart()
    onOpenChange(false)
  }

  const handleDeleteAll = async () => {
    await Promise.all(items.map((item) => deleteItem({ id: item.cartItemId })))
    await invalidateCart()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={'max-w-md'}>
        <DialogHeader>
          <DialogTitle>{'Деякі товари відсутні на складі'}</DialogTitle>
          <DialogDescription>
            {'Вкажіть дію для кожної проблемної позиції перед оформленням замовлення.'}
          </DialogDescription>
        </DialogHeader>

        <div className={'flex flex-col gap-3 max-h-72 overflow-y-auto pr-1'}>
          {items.map((item) => (
            <div
              key={item.cartItemId}
              className={
                'rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col gap-2'
              }
            >
              <p className={'text-sm font-medium text-gray-900 line-clamp-2'}>
                {item.productName}
              </p>

              <div className={'flex gap-4 text-xs'}>
                <span className={'text-gray-500'}>
                  {'Запит: '}
                  <span className={'font-medium text-gray-800'}>
                    {item.requestedQty}
                  </span>
                </span>
                <span
                  className={
                    item.availableQty === 0
                      ? 'text-red-600 font-medium'
                      : 'text-orange-600 font-medium'
                  }
                >
                  {'Доступно: '}
                  <span className={'font-semibold'}>
                    {item.availableQty === 0 ? 'немає' : item.availableQty}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className={'flex flex-col gap-2 mt-6'}>
          <button
            type={'button'}
            onClick={handleUpdateAll}
            disabled={isPending}
            className={
              'w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none cursor-pointer font-[inherit]'
            }
          >
            {isUpdating && <Loader2 size={15} className={'animate-spin'} />}
            {'Оновити кількість'}
          </button>

          <button
            type={'button'}
            onClick={handleDeleteAll}
            disabled={isPending}
            className={
              'w-full py-3 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-transparent cursor-pointer font-[inherit]'
            }
          >
            {isDeleting && <Loader2 size={15} className={'animate-spin'} />}
            {'Видалити з кошика'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
