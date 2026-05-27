'use client'

import { type CategoryModel, useCategoriesControllerFindAll } from '@repo/api-client'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<CategoryModel>()

const columns = [
  columnHelper.display({ id: 'index', header: '#' }),
  columnHelper.accessor('name', { header: 'Назва' }),
  columnHelper.accessor('createdAt', { header: 'Дата створення' }),
]

const CategoryRow: React.FC<{ category: CategoryModel; index: number }> = ({
  category,
  index,
}) => (
  <tr className={'border-t border-gray-100 hover:bg-gray-50 transition-colors'}>
    <td className={'px-4 py-3 text-sm text-gray-500'}>{index + 1}</td>
    <td className={'px-4 py-3 text-sm font-medium text-gray-900'}>{category.name}</td>
    <td className={'px-4 py-3 text-sm text-gray-500'}>
      {new Date(category.createdAt).toLocaleDateString('uk-UA')}
    </td>
  </tr>
)

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategoriesControllerFindAll()

  const categories = data?.data ?? []

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
              {table.getRowModel().rows.map((row, index) => (
                <CategoryRow key={row.id} category={row.original} index={index} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
