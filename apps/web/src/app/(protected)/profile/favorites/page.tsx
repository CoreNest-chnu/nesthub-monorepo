'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useFavoritesStore } from '@/src/store/useFavoritesStore'
import { ProductCard } from '@/src/components/products/ProductCard'

export default function FavoritesPage() {
  const items = useFavoritesStore((s) => s.items)

  return (
    <div className={'flex flex-col gap-6'}>
      <div>
        <h2 className={'text-xl font-semibold text-gray-900'}>{'Обране'}</h2>
        <p className={'mt-1 text-sm text-gray-500'}>
          {items.length > 0
            ? `${items.length} ${items.length === 1 ? 'товар' : 'товарів'}`
            : 'Збережені товари'}
        </p>
      </div>

      {items.length === 0 ? (
        <div
          className={
            'flex flex-col items-center justify-center gap-4 py-16 text-center'
          }
        >
          <div
            className={
              'flex items-center justify-center size-16 rounded-full bg-red-50'
            }
          >
            <Heart size={28} className={'text-red-400'} strokeWidth={1.5} />
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-base font-semibold text-gray-900'}>
              {'Список обраного порожній'}
            </p>
            <p className={'text-sm text-gray-500 max-w-xs'}>
              {'Натисніть ♡ на картці товару, щоб додати його до обраного'}
            </p>
          </div>
          <Link
            href={'/'}
            className={
              'mt-2 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors'
            }
          >
            {'Перейти до каталогу'}
          </Link>
        </div>
      ) : (
        <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
