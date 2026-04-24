'use client'

import { useProductControllerProducts } from '@repo/api-client'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { useCallback, useState } from 'react'
import { ProductCard } from './ProductCard'

const TAKE = 12
const SKELETON_COUNT = 8
const skeletonKeys = Array.from({ length: SKELETON_COUNT }, () => crypto.randomUUID())
const gridClass = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'

const ProductCardSkeleton: React.FC = () => (
  <div className={'flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden'}>
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

const EmptyState: React.FC = () => (
  <div className={'flex flex-col items-center justify-center py-24 gap-2'}>
    <p className={'text-sm font-medium text-gray-500'}>{'Каталог порожній'}</p>
  </div>
)

type ErrorMessageProps = { onRetry: () => void }
const ErrorMessage: React.FC<ErrorMessageProps> = ({ onRetry }) => (
  <div className={'flex flex-col items-center justify-center py-24 gap-3'}>
    <p className={'text-sm font-medium text-red-500'}>{'Не вдалося завантажити товари'}</p>
    <p className={'text-xs text-gray-400'}>{'Спробуйте оновити сторінку'}</p>
    <button
      type={'button'}
      onClick={onRetry}
      className={
        'flex items-center gap-1.5 mt-1 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium cursor-pointer hover:bg-gray-700 font-[inherit] border-none'
      }
    >
      <RefreshCw size={14} />
      {'Спробувати знову'}
    </button>
  </div>
)

export const Catalog: React.FC = () => {
  const [page, setPage] = useState(1)

  // Pass `undefined` as second arg to force UseQueryResult overload (data: TData | undefined)
  const query = useProductControllerProducts({ page, take: TAKE }, undefined)

  const totalPages = query.isSuccess ? query.data.data.totalPages : 1

  const handlePrev = useCallback(() => {
    setPage((p) => Math.max(1, p - 1))
  }, [])

  const handleNext = useCallback(() => {
    setPage((p) => Math.min(totalPages, p + 1))
  }, [totalPages])

  const renderContent = () => {
    if (query.isFetching && !query.isSuccess) {
      return (
        <div className={gridClass}>
          {skeletonKeys.map((key) => (
            <ProductCardSkeleton key={key} />
          ))}
        </div>
      )
    }

    if (query.isError) {
      return <ErrorMessage onRetry={query.refetch} />
    }

    const { products } = query.data.data

    if (products.length === 0) {
      return <EmptyState />
    }

    return (
      <>
        <div className={gridClass}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className={'flex items-center justify-center gap-3 mt-8'}>
            <button
              type={'button'}
              onClick={handlePrev}
              disabled={page === 1}
              className={
                'flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-50 font-[inherit]'
              }
            >
              <ChevronLeft size={16} />
              {'Назад'}
            </button>
            <span className={'text-sm text-gray-500'}>{`${page} / ${totalPages}`}</span>
            <button
              type={'button'}
              onClick={handleNext}
              disabled={page === totalPages}
              className={
                'flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-50 font-[inherit]'
              }
            >
              {'Вперед'}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <div className={'flex-1 flex flex-col'}>
      <div className={'flex items-center justify-between mb-6'}>
        <h1 className={'text-xl font-semibold text-gray-900'}>
          {query.isSuccess
            ? `Каталог товарів (${query.data.data.total.toLocaleString('uk-UA')} товарів)`
            : 'Каталог товарів'}
        </h1>
      </div>

      {renderContent()}
    </div>
  )
}
