'use client'

import { useProductControllerProducts } from '@repo/api-client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Container } from '@/src/components/Container'
import { ProductCard } from '@/src/components/products/ProductCard'

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

export default function ProductsPage() {
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

  const handlePrev = useCallback(() => {
    setPage((prevPage) => Math.max(1, prevPage - 1))
  }, [])

  const handleNext = useCallback(() => {
    setPage((prevPage) => Math.min(totalPages, prevPage + 1))
  }, [totalPages])

  return (
    <div className={'min-h-screen bg-gray-50 py-8'}>
      <Container>
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
              className={'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'}
            >
              {isLoading
                ? skeletonKeys.map((key) => <ProductCardSkeleton key={key} />)
                : products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>

            {!isLoading && totalPages > 1 && (
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
                <span className={'text-sm text-gray-500'}>
                  {`${page} / ${totalPages}`}
                </span>
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
        )}
      </Container>
    </div>
  )
}
