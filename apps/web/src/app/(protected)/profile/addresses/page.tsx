'use client'

import { MapPin, Pencil, Plus, Star, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  type Address,
  type AddressInput,
  useAddressStore,
} from '@/src/store/useAddressStore'

const emptyForm: AddressInput = {
  label: '',
  city: '',
  street: '',
  building: '',
  zip: '',
}

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400'

const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700'

type AddressCardProps = {
  address: Address
  onEdit: (address: Address) => void
  onSetDefault: (id: string) => void
  onRemove: (address: Address) => void
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onSetDefault,
  onRemove,
}) => {
  const handleEdit = useCallback(() => onEdit(address), [onEdit, address])
  const handleSetDefault = useCallback(
    () => onSetDefault(address.id),
    [onSetDefault, address.id],
  )
  const handleRemove = useCallback(
    () => onRemove(address),
    [onRemove, address],
  )

  return (
    <div
      className={
        'flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4'
      }
    >
      <div className={'flex gap-3'}>
        <div
          className={
            'flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100'
          }
        >
          <MapPin size={18} className={'text-gray-500'} />
        </div>
        <div className={'flex flex-col gap-0.5'}>
          <div className={'flex items-center gap-2'}>
            <span className={'font-semibold text-gray-900'}>
              {address.label}
            </span>
            {address.isDefault && (
              <span
                className={
                  'inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700'
                }
              >
                <Star size={11} className={'fill-green-700'} />
                {'Основна'}
              </span>
            )}
          </div>
          <span className={'text-sm text-gray-600'}>
            {`${address.city}, ${address.street}, ${address.building}`}
            {address.zip ? `, ${address.zip}` : ''}
          </span>
        </div>
      </div>

      <div className={'flex shrink-0 items-center gap-1'}>
        {!address.isDefault && (
          <button
            type={'button'}
            onClick={handleSetDefault}
            className={
              'rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-green-600'
            }
            title={'Зробити основною'}
          >
            <Star size={16} />
          </button>
        )}
        <button
          type={'button'}
          onClick={handleEdit}
          className={
            'rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700'
          }
          title={'Редагувати'}
        >
          <Pencil size={16} />
        </button>
        <button
          type={'button'}
          onClick={handleRemove}
          className={
            'rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-red-600'
          }
          title={'Видалити'}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default function AddressesPage() {
  const items = useAddressStore((s) => s.items)
  const add = useAddressStore((s) => s.add)
  const update = useAddressStore((s) => s.update)
  const remove = useAddressStore((s) => s.remove)
  const setDefault = useAddressStore((s) => s.setDefault)

  const [mounted, setMounted] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<AddressInput>(emptyForm)

  useEffect(() => setMounted(true), [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.currentTarget
      setForm((prev) => ({ ...prev, [name]: value }))
    },
    [],
  )

  const openCreate = useCallback(() => {
    setEditingId(null)
    setForm(emptyForm)
    setIsFormOpen(true)
  }, [])

  const openEdit = useCallback((address: Address) => {
    setEditingId(address.id)
    setForm({
      label: address.label,
      city: address.city,
      street: address.street,
      building: address.building,
      zip: address.zip,
    })
    setIsFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setIsFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!form.city.trim() || !form.street.trim() || !form.building.trim()) {
        toast.error('Заповніть місто, вулицю та будинок')

        return
      }

      const payload: AddressInput = {
        label: form.label.trim() || 'Адреса доставки',
        city: form.city.trim(),
        street: form.street.trim(),
        building: form.building.trim(),
        zip: form.zip.trim(),
      }

      if (editingId) {
        update(editingId, payload)
        toast.success('Адресу оновлено')
      } else {
        add(payload)
        toast.success('Адресу додано')
      }

      closeForm()
    },
    [form, editingId, update, add, closeForm],
  )

  const handleRemove = useCallback(
    (address: Address) => {
      remove(address.id)
      toast.success('Адресу видалено')
    },
    [remove],
  )

  return (
    <div className={'flex flex-col gap-6'}>
      <div className={'flex items-start justify-between gap-4'}>
        <div>
          <h2 className={'text-xl font-semibold text-gray-900'}>
            {'Адреси доставки'}
          </h2>
          <p className={'mt-1 text-sm text-gray-500'}>
            {mounted && items.length > 0
              ? `Збережено: ${items.length}`
              : 'Збережіть адреси, щоб швидше оформлювати замовлення'}
          </p>
        </div>

        {!isFormOpen && (
          <button
            type={'button'}
            onClick={openCreate}
            className={
              'inline-flex shrink-0 items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800'
            }
          >
            <Plus size={16} />
            {'Додати'}
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className={'rounded-2xl border border-gray-200 bg-white p-5'}
        >
          <div className={'mb-4 flex items-center justify-between'}>
            <h3 className={'text-base font-semibold text-gray-900'}>
              {editingId ? 'Редагувати адресу' : 'Нова адреса'}
            </h3>
            <button
              type={'button'}
              onClick={closeForm}
              className={'text-gray-400 transition-colors hover:text-gray-700'}
              aria-label={'Закрити'}
            >
              <X size={20} />
            </button>
          </div>

          <div className={'grid grid-cols-1 gap-4 sm:grid-cols-2'}>
            <div className={'sm:col-span-2'}>
              <label className={labelClass} htmlFor={'label'}>
                {'Назва (напр. Дім, Робота)'}
              </label>
              <input
                id={'label'}
                name={'label'}
                className={inputClass}
                value={form.label}
                onChange={handleChange}
                placeholder={'Дім'}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={'city'}>
                {'Місто *'}
              </label>
              <input
                id={'city'}
                name={'city'}
                className={inputClass}
                value={form.city}
                onChange={handleChange}
                placeholder={'Київ'}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={'zip'}>
                {'Індекс'}
              </label>
              <input
                id={'zip'}
                name={'zip'}
                className={inputClass}
                value={form.zip}
                onChange={handleChange}
                placeholder={'01001'}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={'street'}>
                {'Вулиця *'}
              </label>
              <input
                id={'street'}
                name={'street'}
                className={inputClass}
                value={form.street}
                onChange={handleChange}
                placeholder={'вул. Хрещатик'}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor={'building'}>
                {'Будинок / квартира *'}
              </label>
              <input
                id={'building'}
                name={'building'}
                className={inputClass}
                value={form.building}
                onChange={handleChange}
                placeholder={'12, кв. 5'}
              />
            </div>
          </div>

          <div className={'mt-5 flex flex-wrap gap-3'}>
            <button
              type={'submit'}
              className={
                'inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800'
              }
            >
              {editingId ? 'Зберегти' : 'Додати адресу'}
            </button>
            <button
              type={'button'}
              onClick={closeForm}
              className={
                'inline-flex items-center rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50'
              }
            >
              {'Скасувати'}
            </button>
          </div>
        </form>
      )}

      {mounted && items.length === 0 && !isFormOpen && (
        <div
          className={
            'flex flex-col items-center justify-center gap-4 py-16 text-center'
          }
        >
          <div
            className={
              'flex size-16 items-center justify-center rounded-full bg-gray-100'
            }
          >
            <MapPin size={28} className={'text-gray-400'} strokeWidth={1.5} />
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-base font-semibold text-gray-900'}>
              {'Немає збережених адрес'}
            </p>
            <p className={'max-w-xs text-sm text-gray-500'}>
              {
                'Додайте адресу, щоб підставляти її під час оформлення замовлення'
              }
            </p>
          </div>
          <button
            type={'button'}
            onClick={openCreate}
            className={
              'mt-2 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800'
            }
          >
            <Plus size={16} />
            {'Додати адресу'}
          </button>
        </div>
      )}

      {mounted && items.length > 0 && (
        <div className={'flex flex-col gap-3'}>
          {items.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={openEdit}
              onSetDefault={setDefault}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  )
}
