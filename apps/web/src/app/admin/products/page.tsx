'use client'

import {
  type ProductModel,
  useProductControllerProducts,
} from '@repo/api-client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { PaginationControls } from '@/src/components/ui/pagination'

const TAKE = 10

const ProductRow: React.FC<{ product: ProductModel }> = ({ product }) => (
  <tr className={'border-t border-gray-100 hover:bg-gray-50 transition-colors'}>
    <td className={'px-4 py-3'}>
      {product.imageUrl ? (
        <div className={'relative size-10 rounded-lg overflow-hidden'}>
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={'object-cover'}
            unoptimized
          />
        </div>
      ) : (
        <div
          className={
            'size-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs'
          }
        >
          {'—'}
        </div>
      )}
    </td>
    <td
      className={
        'px-4 py-3 text-sm font-medium text-gray-900 max-w-[220px] truncate'
      }
    >
      {product.name}
    </td>
    <td className={'px-4 py-3 text-sm text-gray-700'}>
      {product.Category.name}
    </td>
    <td className={'px-4 py-3 text-sm text-gray-700'}>
      {`₴${Number(product.price).toFixed(2)}`}
    </td>
    <td className={'px-4 py-3'}>
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          product.stock > 0
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-600'
        }`}
      >
        {product.stock}
      </span>
    </td>
  </tr>
)

export default function AdminProductsPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useProductControllerProducts({ page, take: TAKE })

  const products = data?.data.products ?? []
  const totalPages = data?.data.totalPages ?? 1

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className={'p-8 text-center text-sm text-gray-500'}>
          {'Завантаження…'}
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div className={'p-8 text-center text-sm text-gray-500'}>
          {'Товарів немає'}
        </div>
      )
    }

    return (
      <table className={'w-full'}>
        <thead>
          <tr className={'bg-gray-50 text-left'}>
            <th
              className={
                'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-14'
              }
            >
              {''}
            </th>
            <th
              className={
                'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'
              }
            >
              {'Назва'}
            </th>
            <th
              className={
                'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'
              }
            >
              {'Категорія'}
            </th>
            <th
              className={
                'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'
              }
            >
              {'Ціна'}
            </th>
            <th
              className={
                'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'
              }
            >
              {'Склад'}
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex items-center justify-between'}>
        <h2 className={'text-lg font-semibold text-gray-900'}>{'Товари'}</h2>
        <Link
          href={'/admin/products/create'}
          className={
            'px-4 h-9 inline-flex items-center rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors'
          }
        >
          {'+ Додати товар'}
        </Link>
      </div>

      <div
        className={
          'bg-white rounded-2xl border border-gray-200 overflow-hidden'
        }
      >
        {renderBody()}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          prevText={'Назад'}
          nextText={'Вперед'}
        />
      )}
    </div>
  )
}
