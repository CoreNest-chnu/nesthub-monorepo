'use client'

import { type CategoryModel, useCategoriesControllerFindAll } from '@repo/api-client'

const CategoryRow: React.FC<{ category: CategoryModel; index: number }> = ({
  category,
  index,
}) => (
  <tr className={'border-t border-gray-100 hover:bg-gray-50 transition-colors'}>
    <td className={'px-4 py-3 text-sm text-gray-500'}>{index + 1}</td>
    <td className={'px-4 py-3 text-sm font-medium text-gray-900'}>
      {category.name}
    </td>
    <td className={'px-4 py-3 text-sm text-gray-500'}>
      {new Date(category.createdAt).toLocaleDateString('uk-UA')}
    </td>
  </tr>
)

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategoriesControllerFindAll()

  const categories = data?.data ?? []

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className={'p-8 text-center text-sm text-gray-500'}>
          {'Завантаження…'}
        </div>
      )
    }

    if (categories.length === 0) {
      return (
        <div className={'p-8 text-center text-sm text-gray-500'}>
          {'Категорій немає'}
        </div>
      )
    }

    return (
      <table className={'w-full'}>
        <thead>
          <tr className={'bg-gray-50 text-left'}>
            <th
              className={
                'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-12'
              }
            >
              {'#'}
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
              {'Дата створення'}
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <CategoryRow key={category.id} category={category} index={index} />
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className={'flex flex-col gap-4'}>
      <h2 className={'text-lg font-semibold text-gray-900'}>{'Категорії'}</h2>

      <div
        className={
          'bg-white rounded-2xl border border-gray-200 overflow-hidden'
        }
      >
        {renderBody()}
      </div>
    </div>
  )
}
