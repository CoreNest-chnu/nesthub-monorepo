'use client'

import { useProductControllerProductById } from '@repo/api-client'
import { ChevronRight, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import { Container } from '@/src/components/Container'

type Props = {
  params: Promise<{ id: string }>
}

const ProductSkeleton: React.FC = () => (
  <div className={'animate-pulse'}>
    <div className={'flex gap-10'}>
      <div className={'w-[420px] shrink-0 aspect-square bg-gray-200 rounded-2xl'} />
      <div className={'flex-1 flex flex-col gap-4 pt-2'}>
        <div className={'h-4 w-24 bg-gray-200 rounded'} />
        <div className={'h-8 w-3/4 bg-gray-200 rounded'} />
        <div className={'h-6 w-32 bg-gray-200 rounded'} />
        <div className={'h-4 w-full bg-gray-200 rounded'} />
        <div className={'h-4 w-5/6 bg-gray-200 rounded'} />
        <div className={'h-12 w-48 bg-gray-200 rounded-xl mt-4'} />
      </div>
    </div>
  </div>
)

export default function ProductPage({ params }: Props) {
  const { id: rawId } = use(params)
  // ProductCard passes JSON.stringify(id) → strip surrounding quotes if present
  const id = rawId.startsWith('"') && rawId.endsWith('"') ? rawId.slice(1, -1) : rawId

  const { data, isLoading, isError } = useProductControllerProductById(id)

  const product = data?.data

  return (
    <div className={'min-h-screen bg-gray-50 py-8'}>
      <Container>
        {/* Breadcrumbs */}
        <nav className={'flex items-center gap-1.5 text-sm text-gray-500 mb-6'}>
          <Link href={'/'} className={'hover:text-gray-900 transition-colors'}>
            {'Головна'}
          </Link>
          <ChevronRight size={14} className={'text-gray-400'} />
          <Link
            href={'/products'}
            className={'hover:text-gray-900 transition-colors'}
          >
            {'Каталог'}
          </Link>
          {product && (
            <>
              <ChevronRight size={14} className={'text-gray-400'} />
              <Link
                href={`/products?categoryId=${product.categoryId}`}
                className={'hover:text-gray-900 transition-colors'}
              >
                {product.category.name}
              </Link>
              <ChevronRight size={14} className={'text-gray-400'} />
              <span className={'text-gray-900 font-medium line-clamp-1'}>
                {product.name}
              </span>
            </>
          )}
        </nav>

        {isLoading && <ProductSkeleton />}

        {isError && (
          <div
            className={
              'flex flex-col items-center justify-center py-24 gap-3'
            }
          >
            <p className={'text-sm font-medium text-red-500'}>
              {'Не вдалося завантажити товар'}
            </p>
            <Link
              href={'/products'}
              className={
                'px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700'
              }
            >
              {'Повернутись до каталогу'}
            </Link>
          </div>
        )}

        {product && (
          <div className={'flex gap-10 items-start'}>
            {/* Image */}
            <div
              className={
                'w-[420px] shrink-0 aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden relative'
              }
            >
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes={'420px'}
                  className={'object-cover'}
                  priority
                  unoptimized
                />
              ) : (
                <div
                  className={
                    'flex items-center justify-center h-full text-sm text-gray-400'
                  }
                >
                  {'Фото товару'}
                </div>
              )}
            </div>

            {/* Info */}
            <div className={'flex-1 flex flex-col gap-4'}>
              {/* Category badge */}
              <span
                className={
                  'inline-flex items-center w-fit px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium'
                }
              >
                {product.category.name}
              </span>

              {/* Name */}
              <h1 className={'text-2xl font-bold text-gray-900 leading-snug'}>
                {product.name}
              </h1>

              {/* Price */}
              <p className={'text-3xl font-bold text-orange-500'}>
                {`${Number(product.price).toLocaleString('uk-UA')} ₴`}
              </p>

              {/* Stock */}
              <p
                className={`text-sm font-medium ${
                  product.stock > 0 ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {product.stock > 0
                  ? `В наявності: ${product.stock} шт.`
                  : 'Немає в наявності'}
              </p>

              {/* Description */}
              {product.description && (
                <p className={'text-sm text-gray-600 leading-relaxed'}>
                  {product.description}
                </p>
              )}

              {/* Actions */}
              <div className={'flex items-center gap-3 mt-2'}>
                <button
                  type={'button'}
                  disabled={product.stock === 0}
                  className={
                    'flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer border-none font-[inherit]'
                  }
                >
                  <ShoppingCart size={16} />
                  {'Додати до кошика'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
