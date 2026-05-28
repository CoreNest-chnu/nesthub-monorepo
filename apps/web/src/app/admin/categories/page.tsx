'use client'

import {
  useAdminControllerCreateCategory,
  useAdminControllerDeleteCategory,
  useAdminControllerUpdateCategory,
  type CategoryModel,
} from '@repo/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

import {
  getCategoriesControllerFindAllQueryKey,
  useGetCategories,
} from '@/src/hooks/useGetCategories'

type InlineEditProps = {
  value: string
  onSave: (name: string) => Promise<void>
}

const InlineEdit = ({ value, onSave }: InlineEditProps) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleEdit = useCallback(() => {
    setDraft(value)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [value])

  const handleCancel = useCallback(() => {
    setEditing(false)
    setDraft(value)
  }, [value])

  const handleSave = useCallback(async () => {
    const trimmed = draft.trim()

    if (!trimmed || trimmed === value) {
      handleCancel()

      return
    }

    setSaving(true)

    try {
      await onSave(trimmed)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }, [draft, handleCancel, onSave, value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value),
    [],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSave()
      if (e.key === 'Escape') handleCancel()
    },
    [handleCancel, handleSave],
  )

  if (editing) {
    return (
      <div className={'flex items-center gap-1.5'}>
        <input
          ref={inputRef}
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={saving}
          className={
            'border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-48 disabled:opacity-50'
          }
        />
        <button
          type={'button'}
          onClick={handleSave}
          disabled={saving}
          className={
            'inline-flex items-center justify-center size-7 rounded-md bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition-colors'
          }
        >
          <Check size={13} />
        </button>
        <button
          type={'button'}
          onClick={handleCancel}
          disabled={saving}
          className={
            'inline-flex items-center justify-center size-7 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 disabled:opacity-50 transition-colors'
          }
        >
          <X size={13} />
        </button>
      </div>
    )
  }

  return (
    <div className={'flex items-center gap-1.5 group/name'}>
      <span className={'text-sm text-gray-900 font-medium'}>{value}</span>
      <button
        type={'button'}
        onClick={handleEdit}
        className={
          'inline-flex items-center justify-center size-6 rounded-md text-gray-400 opacity-0 group-hover/name:opacity-100 hover:text-gray-700 transition-all'
        }
      >
        <Pencil size={12} />
      </button>
    </div>
  )
}

type ConfirmDeleteProps = {
  categoryName: string
  productCount: number
  onConfirm: () => Promise<void>
  onCancel: () => void
}

const ConfirmDelete = ({
  categoryName,
  productCount,
  onConfirm,
  onCancel,
}: ConfirmDeleteProps) => {
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = useCallback(async () => {
    setDeleting(true)

    try {
      await onConfirm()
    } finally {
      setDeleting(false)
    }
  }, [onConfirm])

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  return (
    <div
      className={'fixed inset-0 z-50 flex items-center justify-center bg-black/40'}
      onClick={onCancel}
    >
      <div
        className={'bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4'}
        onClick={stopPropagation}
      >
        <h3 className={'text-base font-semibold text-gray-900 mb-2'}>
          {'Видалити категорію?'}
        </h3>
        {productCount > 0 ? (
          <p className={'text-sm text-red-600 mb-5'}>
            {`Категорія «${categoryName}» містить ${productCount} ${productCount === 1 ? 'товар' : 'товарів'}. Спочатку видаліть або перемістіть товари.`}
          </p>
        ) : (
          <p className={'text-sm text-gray-600 mb-5'}>
            {`Категорія «${categoryName}» буде видалена назавжди.`}
          </p>
        )}
        <div className={'flex gap-2 justify-end'}>
          <button
            type={'button'}
            onClick={onCancel}
            className={
              'px-4 h-9 rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-gray-300 transition-colors'
            }
          >
            {'Скасувати'}
          </button>
          <button
            type={'button'}
            onClick={handleConfirm}
            disabled={deleting || productCount > 0}
            className={
              'px-4 h-9 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors'
            }
          >
            {deleting ? 'Видалення…' : 'Видалити'}
          </button>
        </div>
      </div>
    </div>
  )
}

type NewCategoryFormProps = {
  onClose: () => void
  onCreate: (name: string) => Promise<void>
}

const NewCategoryForm = ({ onClose, onCreate }: NewCategoryFormProps) => {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    [],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = name.trim()

      if (!trimmed) return

      setSaving(true)

      try {
        await onCreate(trimmed)
        onClose()
      } finally {
        setSaving(false)
      }
    },
    [name, onCreate, onClose],
  )

  return (
    <tr className={'bg-blue-50 border-b border-gray-100'}>
      <td className={'px-4 py-3 w-12 text-gray-400 text-sm'}>{'–'}</td>
      <td className={'px-4 py-3'}>
        <form onSubmit={handleSubmit} className={'flex items-center gap-1.5'}>
          <input
            autoFocus
            value={name}
            onChange={handleChange}
            placeholder={'Назва категорії…'}
            disabled={saving}
            className={
              'border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-52 disabled:opacity-50'
            }
          />
          <button
            type={'submit'}
            disabled={saving || !name.trim()}
            className={
              'inline-flex items-center justify-center size-7 rounded-md bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 transition-colors'
            }
          >
            <Check size={13} />
          </button>
          <button
            type={'button'}
            onClick={onClose}
            disabled={saving}
            className={
              'inline-flex items-center justify-center size-7 rounded-md border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 disabled:opacity-50 transition-colors'
            }
          >
            <X size={13} />
          </button>
        </form>
      </td>
      <td className={'px-4 py-3'} />
      <td className={'px-4 py-3'} />
    </tr>
  )
}

type CategoryRowProps = {
  category: CategoryModel
  index: number
  onDelete: (id: string) => void
  onUpdate: (id: string, name: string) => Promise<void>
}

const CategoryRow = ({ category, index, onDelete, onUpdate }: CategoryRowProps) => {
  const handleDelete = useCallback(() => {
    onDelete(category.id)
  }, [category.id, onDelete])

  const handleUpdate = useCallback(
    (name: string) => onUpdate(category.id, name),
    [category.id, onUpdate],
  )

  return (
    <tr
      className={
        'border-t border-gray-100 hover:bg-gray-50 transition-colors group'
      }
    >
      <td className={'px-4 py-3 text-sm text-gray-400'}>{index + 1}</td>
      <td className={'px-4 py-3'}>
        <InlineEdit value={category.name} onSave={handleUpdate} />
      </td>
      <td className={'px-4 py-3'}>
        <span
          className={
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600'
          }
        >
          {category._count?.Products ?? 0}
        </span>
      </td>
      <td className={'px-4 py-3'}>
        <div className={'flex justify-end'}>
          <button
            type={'button'}
            onClick={handleDelete}
            className={
              'inline-flex items-center justify-center size-8 rounded-lg border border-gray-200 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:border-red-200 transition-all'
            }
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const { categories, isLoading } = useGetCategories()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)

  const { mutateAsync: createCategory } = useAdminControllerCreateCategory()
  const { mutateAsync: updateCategory } = useAdminControllerUpdateCategory()
  const { mutateAsync: deleteCategory } = useAdminControllerDeleteCategory()

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: getCategoriesControllerFindAllQueryKey() }),
    [queryClient],
  )

  const handleCreate = useCallback(
    async (name: string) => {
      try {
        await createCategory({ data: { name } })
        await invalidate()
        toast.success('Категорію створено')
      } catch {
        toast.error('Не вдалося створити категорію')
        throw new Error('create failed')
      }
    },
    [createCategory, invalidate],
  )

  const handleUpdate = useCallback(
    async (id: string, name: string) => {
      try {
        await updateCategory({ id, data: { name } })
        await invalidate()
        toast.success('Назву оновлено')
      } catch {
        toast.error('Не вдалося оновити назву')
        throw new Error('update failed')
      }
    },
    [invalidate, updateCategory],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteCategory({ id })
        await invalidate()
        toast.success('Категорію видалено')
      } catch {
        toast.error('Не вдалося видалити категорію')
        throw new Error('delete failed')
      } finally {
        setDeletingId(null)
      }
    },
    [deleteCategory, invalidate],
  )

  const handleShowNewForm = useCallback(() => setShowNewForm(true), [])
  const handleCloseNewForm = useCallback(() => setShowNewForm(false), [])
  const handleCancelDelete = useCallback(() => setDeletingId(null), [])
  const handleStartDelete = useCallback((id: string) => setDeletingId(id), [])

  const handleConfirmDelete = useCallback(async () => {
    if (deletingId) await handleDelete(deletingId)
  }, [deletingId, handleDelete])

  const deletingCategory = deletingId
    ? categories.find((c) => c.id === deletingId)
    : null

  if (isLoading) {
    return (
      <div className={'flex flex-col gap-4'}>
        <div className={'flex items-center justify-between'}>
          <h2 className={'text-lg font-semibold text-gray-900'}>{'Категорії'}</h2>
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
    <>
      <div className={'flex flex-col gap-4'}>
        <div className={'flex items-center justify-between'}>
          <h2 className={'text-lg font-semibold text-gray-900'}>{'Категорії'}</h2>
          <button
            type={'button'}
            onClick={handleShowNewForm}
            className={
              'px-4 h-9 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors'
            }
          >
            <Plus size={15} />
            {'Нова категорія'}
          </button>
        </div>

        <div
          className={
            'bg-white rounded-sm border border-gray-200 overflow-hidden'
          }
        >
          <table className={'min-w-full'}>
            <thead className={'bg-gray-50'}>
              <tr>
                <th
                  className={
                    'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-12'
                  }
                >
                  {'#'}
                </th>
                <th
                  className={
                    'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'
                  }
                >
                  {'Назва'}
                </th>
                <th
                  className={
                    'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'
                  }
                >
                  {'Товарів'}
                </th>
                <th
                  className={
                    'px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide w-20'
                  }
                />
              </tr>
            </thead>
            <tbody>
              {showNewForm && (
                <NewCategoryForm
                  onClose={handleCloseNewForm}
                  onCreate={handleCreate}
                />
              )}
              {categories.length === 0 && !showNewForm ? (
                <tr>
                  <td
                    colSpan={4}
                    className={'px-4 py-8 text-center text-sm text-gray-500'}
                  >
                    {'Категорій немає'}
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    index={index}
                    onDelete={handleStartDelete}
                    onUpdate={handleUpdate}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deletingCategory && (
        <ConfirmDelete
          categoryName={deletingCategory.name}
          productCount={deletingCategory._count?.Products ?? 0}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  )
}
