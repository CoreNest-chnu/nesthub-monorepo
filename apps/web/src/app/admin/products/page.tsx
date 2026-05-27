'use client'

import { type ProductModel, useProductControllerProducts } from '@repo/api-client'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { PaginationControls } from '@/src/components/ui/pagination'

const take = 10

const columnHelper = createColumnHelper<ProductModel>()

const columns = [
  columnHelper.display({ id: 'image', header: '' }),
  columnHelper.accessor('name', { header: 'Назва' }),
  columnHelper.display({ id: 'category', header: 'Категорія' }),
  columnHelper.accessor('price', { header: 'Ціна' }),
  columnHelper.accessor('stock', { header: 'Склад' }),
]

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
    <td className={'px-4 py-3 text-sm text-gray-700'}>{product.Category.name}</td>
    <td className={'px-4 py-3 text-sm text-gray-700'}>
      {`₴${Number(product.price).toFixed(2)}`}
    </td>
    <td className={'px-4 py-3'}>
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
        }`}
      >
        {product.stock}
      </span>
    </td>
  </tr>
)

export default function AdminProductsPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useProductControllerProducts({ page, take })

  const products = data?.data.products ?? []
  const totalPages = data?.data.totalPages ?? 1

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className={'flex flex-col gap-4'}>
        <div className={'flex items-center justify-between'}>
          <h2 className={'text-lg font-semibold text-gray-900'}>{'Товари'}</h2>
        </div>
        <div className={'bg-white rounded-2xl border border-gray-200 overflow-hidden'}>
          <div className={'p-8 text-center text-sm text-gray-500'}>{'Завантаження…'}</div>
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

      <div className={'bg-white rounded-2xl border border-gray-200 overflow-hidden'}>
        {products.length === 0 ? (
          <div className={'p-8 text-center text-sm text-gray-500'}>{'Товарів немає'}</div>
        ) : (
          <table className={'w-full'}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className={'bg-gray-50 text-left'}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={
                        'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'
                      }
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <ProductRow key={row.id} product={row.original} />
              ))}
            </tbody>
          </table>
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
