'use client'

import { useProductControllerProducts } from '@repo/api-client'
import { useState } from 'react'
import { PaginationControls } from '@/src/components/ui/pagination'
import { ProductCard } from './ProductCard'

const take = 12
const skeletonKeys = Array.from({ length: take }, () => crypto.randomUUID())

const ProductCardSkeleton: React.FC = () => (
  <div
    className={
      'flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden'
    }
  >
    <div className={'aspect-square bg-gray-200 animate-pulse'} />
    <div className={'flex flex-col gap-2 p-3'}>
      <div className={'h-3 w-16 bg-gray-200 rounded animate-pulse'} />
      <div className={'h-4 w-full bg-gray-200 rounded animate-pulse'} />
      <div className={'h-4 w-3/4 bg-gray-200 rounded animate-pulse'} />
      <div className={'h-4 w-20 bg-gray-200 rounded animate-pulse'} />
      <div className={'h-8 w-full bg-gray-200 rounded-lg animate-pulse mt-1'} />
    </div>
  </div>
)

export const Catalog: React.FC = () => {
  const [page, setPage] = useState(1)

  const {
    data: productData,
    isLoading,
    isError,
  } = useProductControllerProducts({
    page,
    take,
  })

  const products = productData?.data.products ?? []
  const total = productData?.data.total ?? 0
  const totalPages = productData?.data.totalPages ?? 1

  return (
    <div className={'flex-1 flex flex-col'}>
      <div className={'flex items-center justify-between mb-6'}>
        <h1 className={'text-xl font-semibold text-gray-900'}>
          {isLoading
            ? 'Каталог товарів'
            : `Каталог товарів (${total.toLocaleString('uk-UA')} товарів)`}
        </h1>
      </div>

      {isError ? (
        <div
          className={'flex flex-col items-center justify-center py-24 gap-2'}
        >
          <p className={'text-sm font-medium text-red-500'}>
            {'Не вдалося завантажити товари'}
          </p>
          <p className={'text-xs text-gray-400'}>
            {'Спробуйте оновити сторінку'}
          </p>
        </div>
      ) : (
        <>
          <div
            className={'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'}
          >
            {isLoading
              ? skeletonKeys.map((key) => <ProductCardSkeleton key={key} />)
              : products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          {!isLoading && (
            <PaginationControls
              className={'mt-8'}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              prevText={'Назад'}
              nextText={'Вперед'}
            />
          )}
        </>
      )}
    </div>
  )
}
