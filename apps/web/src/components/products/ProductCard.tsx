'use client'

import type { ProductModel } from '@repo/api-client'
import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = { product: ProductModel }

export const ProductCard: React.FC<Props> = ({ product }) => {
  const inStock = product.stock > 0
  const price = Number(product.price).toLocaleString('uk-UA')
  const id = JSON.stringify(product.id)

  return (
    <div
      className={
        'flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
      }
    >
      <Link href={`/products/${id}`} className={'relative block aspect-square bg-gray-100'}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes={'(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
            className={'object-cover'}
          />
        ) : (
          <div className={'flex items-center justify-center h-full text-xs text-gray-400'}>
            {'Фото товару'}
          </div>
        )}
      </Link>

      <div className={'flex flex-col gap-2 p-3 flex-1'}>
        <span className={'text-xs text-blue-600 font-medium'}>{product.category.name}</span>

        <Link
          href={`/products/${id}`}
          className={'text-sm text-gray-900 font-medium line-clamp-2 hover:underline'}
        >
          {product.name}
        </Link>

        <p className={'text-base font-semibold text-orange-500'}>{`${price} ₴`}</p>

        <p className={`text-xs ${inStock ? 'text-green-600' : 'text-gray-400'}`}>
          {inStock ? 'В наявності' : 'Немає в наявності'}
        </p>

        <div className={'flex items-center gap-2 mt-auto pt-1'}>
          <button
            type={'button'}
            disabled={!inStock}
            className={
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium border-none cursor-pointer font-[inherit] bg-gray-900 text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
            }
          >
            <ShoppingCart size={13} />
            {'До кошика'}
          </button>
          <button
            type={'button'}
            className={
              'p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-red-400 cursor-pointer bg-transparent'
            }
          >
            <Heart size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
