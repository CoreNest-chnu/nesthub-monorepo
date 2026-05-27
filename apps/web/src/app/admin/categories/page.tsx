'use client'

import { type CategoryModel, useCategoriesControllerFindAll } from '@repo/api-client'
import { useMemo } from 'react'
import { type CustomColumn, Table } from '@/src/components/ui/Table/Table'

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategoriesControllerFindAll()

  const categories = data?.data ?? []

  const columns = useMemo<CustomColumn<CategoryModel>[]>(
    () => [
      {
        id: 'index',
        header: '#',
        contentPosition: 'left',
        cell: ({ row: { index } }) => index + 1,
        cellClass: 'w-12 text-gray-500',
      },
      {
        accessorKey: 'name',
        header: 'Назва',
        contentPosition: 'left',
        cell: ({ row: { original } }) => original.name,
      },
      {
        accessorKey: 'createdAt',
        header: 'Дата створення',
        contentPosition: 'left',
        cell: ({ row: { original } }) =>
          new Date(original.createdAt).toLocaleDateString('uk-UA'),
        cellClass: 'text-gray-500',
      },
    ],
    [],
  )

  if (isLoading) {
    return (
      <div className={'flex flex-col gap-4'}>
        <h2 className={'text-lg font-semibold text-gray-900'}>{'Категорії'}</h2>
        <div className={'bg-white rounded-2xl border border-gray-200 overflow-hidden'}>
          <div className={'p-8 text-center text-sm text-gray-500'}>{'Завантаження…'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={'flex flex-col gap-4'}>
      <h2 className={'text-lg font-semibold text-gray-900'}>{'Категорії'}</h2>

      <div className={'bg-white rounded-2xl border border-gray-200 overflow-hidden'}>
        {categories.length === 0 ? (
          <div className={'p-8 text-center text-sm text-gray-500'}>{'Категорій немає'}</div>
        ) : (
          <Table data={categories} columns={columns} borderless />
        )}
      </div>
    </div>
  )
}
