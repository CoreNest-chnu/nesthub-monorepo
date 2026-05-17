'use client'

import {
  getCartControllerGetCartQueryKey,
  getCartControllerGetRecommendationsQueryKey,
  type ProductModel,
  useCartControllerAddItem,
  useCartControllerGetRecommendations,
} from '@repo/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useCallback } from 'react'
import { toast } from 'sonner'

type RecommendationCardProps = {
  product: ProductModel
  accessToken: string | undefined
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  product,
  accessToken,
}) => {
  const queryClient = useQueryClient()

  const { mutateAsync: addItem, isPending } = useCartControllerAddItem({
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  })

  const handleAdd = useCallback(async () => {
    try {
      await addItem({ data: { productId: product.id, qty: 1 } })
      toast.success('Додано до кошика')
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getCartControllerGetCartQueryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: getCartControllerGetRecommendationsQueryKey(),
        }),
      ])
    } catch {
      toast.error('Не вдалось додати товар')
    }
  }, [addItem, product.id, queryClient])

  return (
    <div
      className={
        'flex flex-col gap-2 p-3 rounded-xl border border-gray-200 bg-white'
      }
    >
      <div
        className={
          'w-full aspect-square bg-gray-100 rounded-lg relative overflow-hidden'
        }
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes={'176px'}
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
      <p
        className={
          'text-sm text-gray-800 line-clamp-2 min-h-[2.5rem] leading-tight'
        }
      >
        {product.name}
      </p>
      <div className={'flex items-center justify-between mt-auto'}>
        <span className={'text-sm font-semibold text-gray-900'}>
          {`${Number(product.price).toLocaleString('uk-UA')} ₴`}
        </span>
        <button
          type={'button'}
          aria-label={'Додати до кошика'}
          onClick={handleAdd}
          disabled={isPending}
          className={
            'flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 text-white cursor-pointer hover:bg-gray-700 border-none disabled:opacity-40 disabled:cursor-not-allowed'
          }
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}

export const CartRecommendations: React.FC = () => {
  const { data: session } = useSession()
  const accessToken = session?.accessToken

  const { data } = useCartControllerGetRecommendations({
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
    query: { enabled: Boolean(accessToken) },
  })

  const products = data?.data ?? []

  if (products.length === 0) {
    return null
  }

  return (
    <section
      className={'flex-1 bg-white rounded-2xl border border-gray-200 p-6'}
    >
      <h2 className={'text-base font-semibold text-gray-900 mb-4'}>
        {'Часто купують разом'}
      </h2>
      <div className={'grid grid-cols-3 gap-3'}>
        {products.map((product) => (
          <RecommendationCard
            key={product.id}
            product={product}
            accessToken={accessToken}
          />
        ))}
      </div>
    </section>
  )
}
