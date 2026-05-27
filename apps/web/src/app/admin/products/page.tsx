'use client'

import {
  type ProductModel,
  useProductControllerProducts,
} from '@repo/api-client'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { type CustomColumn, Table } from '@/src/components/ui/Table/Table'
import { PaginationControls } from '@/src/components/ui/pagination'

const take = 10

export default function AdminProductsPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useProductControllerProducts({ page, take })

  const products = data?.data.products ?? []
  const totalPages = data?.data.totalPages ?? 1

  const columns = useMemo<CustomColumn<ProductModel>[]>(
    () => [
      {
        id: 'image',
        header: '',
        contentPosition: 'left',
        cellClass: 'w-14',
        cell: ({ row: { original } }) =>
          original.imageUrl ? (
            <div className={'relative size-10 rounded-lg overflow-hidden'}>
              <Image
                src={original.imageUrl}
                alt={original.name}
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
          ),
      },
      {
        accessorKey: 'name',
        header: 'Назва',
        contentPosition: 'left',
        cell: ({ row: { original } }) => original.name,
        cellClass: 'font-medium text-gray-900 max-w-[220px] truncate',
      },
      {
        id: 'category',
        header: 'Категорія',
        contentPosition: 'left',
        cell: ({ row: { original } }) => original.Category.name,
        cellClass: 'text-gray-700',
      },
      {
        accessorKey: 'price',
        header: 'Ціна',
        contentPosition: 'left',
        cell: ({ row: { original } }) =>
          `₴${Number(original.price).toFixed(2)}`,
        cellClass: 'text-gray-700',
      },
      {
        accessorKey: 'stock',
        header: 'Склад',
        contentPosition: 'left',
        cell: ({ row: { original } }) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              original.stock > 0
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {original.stock}
          </span>
        ),
      },
    ],
    [],
  )

  if (isLoading) {
    return (
      <div className={'flex flex-col gap-4'}>
        <div className={'flex items-center justify-between'}>
          <h2 className={'text-lg font-semibold text-gray-900'}>{'Товари'}</h2>
        </div>
        <div
          className={
            'bg-white rounded-2xl border border-gray-200 overflow-hidden'
          }
        >
          <div className={'p-8 text-center text-sm text-gray-500'}>
            {'Завантаження…'}
          </div>
        </div>
      </div>
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
        className={'bg-white rounded-sm border border-gray-200 overflow-hidden'}
      >
        {products.length === 0 ? (
          <div className={'p-8 text-center text-sm text-gray-500'}>
            {'Товарів немає'}
          </div>
        ) : (
          <Table data={products} columns={columns} borderless />
        )}
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
