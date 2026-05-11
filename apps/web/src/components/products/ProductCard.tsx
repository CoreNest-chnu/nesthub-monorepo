'use client'

import {
  type ProductModel,
  useCartControllerAddItem,
  getCartControllerGetCartQueryKey,
} from '@repo/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { toast } from 'sonner'

type ProductCardProps = {
  product: ProductModel
}

const starKeys = Array.from({ length: 5 }, (_, i) => `star-${i}`)

const Rating: React.FC<{ value: number }> = ({ value }) => (
  <div className={'flex items-center gap-1'}>
    <span className={'flex items-center gap-0.5'}>
      {starKeys.map((key, index) => (
        <Star
          key={key}
          size={12}
          className={
            index < value
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-200 text-gray-200'
          }
        />
      ))}
    </span>
  </div>
)

const ProductImage: React.FC<{ product: ProductModel }> = ({ product }) => {
  if (!product.imageUrl) {
    return (
      <div
        className={
          'flex items-center justify-center h-full text-xs text-gray-400'
        }
      >
        {'Фото товару'}
      </div>
    )
  }

  return (
    <Image
      src={product.imageUrl}
      alt={product.name}
      fill
      sizes={'(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
      className={'object-cover'}
    />
  )
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const inStock = product.stock > 0
  const price = Number(product.price).toLocaleString('uk-UA')
  const href = `/products/${product.id}`

  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()

  const { mutateAsync: addToCart, isPending } = useCartControllerAddItem({
    request: {
      headers: session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {},
    },
  })

  const handleAddToCart = useCallback(async () => {
    if (!session) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`)
      return
    }
    try {
      await addToCart({ data: { productId: product.id, qty: 1 } })
      toast.success('Товар додано до кошика')
      queryClient.invalidateQueries({
        queryKey: getCartControllerGetCartQueryKey(session.user.id),
      })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Помилка додавання до кошика',
      )
    }
  }, [session, router, pathname, addToCart, product.id, queryClient])

  return (
    <article
      className={
        'group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all'
      }
    >
      <Link
        href={href}
        className={'relative block aspect-square bg-gray-100 overflow-hidden'}
      >
        <ProductImage product={product} />
      </Link>

      <div className={'flex flex-col gap-2 p-3 flex-1'}>
        <div className={'flex items-center justify-between gap-2'}>
          <span className={'text-xs text-blue-600 font-medium truncate'}>
            {product.Category.name}
          </span>
          <Rating value={product.rating} />
        </div>

        <Link
          href={href}
          className={
            'text-sm text-gray-900 font-medium line-clamp-2 hover:underline'
          }
        >
          {product.name}
        </Link>

        <div className={'flex items-center justify-between gap-2 mt-auto'}>
          <p className={'text-base font-semibold text-orange-500'}>
            {`${price} ₴`}
          </p>
          <p
            className={`text-xs ${inStock ? 'text-green-600' : 'text-gray-400'}`}
          >
            {inStock ? 'В наявності' : 'Немає в наявності'}
          </p>
        </div>

        <div className={'flex items-center gap-2'}>
          <button
            type={'button'}
            disabled={!inStock || isPending}
            onClick={handleAddToCart}
            className={
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium border-none cursor-pointer font-[inherit] bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
            }
          >
            <ShoppingCart size={13} />
            {'До кошика'}
          </button>
          <button
            type={'button'}
            aria-label={'Додати в обране'}
            className={
              'p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 cursor-pointer bg-transparent transition-colors'
            }
          >
            <Heart size={13} />
          </button>
        </div>
      </div>
    </article>
  )
}
