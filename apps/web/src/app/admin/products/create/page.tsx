'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useCategoriesControllerFindAll } from '@repo/api-client'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { ArrowLeft, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Field } from '@/src/components/Field'
import {
  type CreateProductFormData,
  createProductSchema,
} from '@/src/validation/validationSchema'

function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false
  try {
    new URL(url)

    return true
  } catch {
    return false
  }
}

const inputClass = (hasError: boolean) =>
  `w-full border rounded-lg px-3 h-[42px] text-sm outline-none font-[inherit] text-gray-900 bg-white ${hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'
  }`

const CreateProductPage: React.FC = () => {
  const router = useRouter()
  const { data: session } = useSession()

  const { data: categoriesData } = useCategoriesControllerFindAll()
  const categories = categoriesData?.data ?? []

  const { mutateAsync: createProduct, isPending } = useMutation({
    mutationFn: async (dto: CreateProductFormData): Promise<unknown> => {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.accessToken
            ? { Authorization: `Bearer ${session.accessToken}` }
            : {}),
        },
        body: JSON.stringify(dto),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        let message = res.statusText
        try {
          const body: unknown = JSON.parse(text)

          if (
            typeof body === 'object' &&
            body !== null &&
            'message' in body &&
            typeof body.message === 'string'
          ) {
            message = body.message
          }
        } catch { /* fallback to statusText */ }
        throw new Error(message)
      }

      const data: unknown = await res.json()

      return data
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      categoryId: '',
      stock: undefined,
      imageUrl: '',
    },
  })

  const imageUrl = watch('imageUrl')
  const hasValidImage = isValidImageUrl(imageUrl)

  const onSubmit = useCallback(
    async (values: CreateProductFormData) => {
      try {
        await createProduct({
          name: values.name,
          description: values.description ?? undefined,
          price: values.price,
          categoryId: values.categoryId,
          stock: values.stock,
          imageUrl: values.imageUrl !== '' ? values.imageUrl : undefined,
        })
        toast.success('Товар успішно створено')
        router.push('/admin/products')
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Помилка створення товару',
        )
      }
    },
    [createProduct, router],
  )

  return (
    <div className={'min-h-screen bg-gray-50 p-6'}>
      <div className={'max-w-[800px] mx-auto'}>
        <div className={'flex items-center gap-3 mb-6'}>
          <Link
            href={'/admin/products'}
            className={
              'flex items-center justify-center size-9 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-colors'
            }
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className={'text-xl font-semibold text-gray-900'}>
              {'Новий товар'}
            </h1>
            <p className={'text-sm text-gray-500'}>{'Заповніть дані товару'}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={'flex flex-col gap-5'}
        >
          <div
            className={
              'bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4'
            }
          >
            <h2 className={'text-sm font-semibold text-gray-700 uppercase tracking-wide'}>
              {'Основна інформація'}
            </h2>

            <Field
              htmlFor={'name'}
              label={'Назва товару'}
              error={errors.name?.message}
            >
              <input
                id={'name'}
                {...register('name')}
                type={'text'}
                placeholder={'Введіть назву товару'}
                className={inputClass(Boolean(errors.name))}
              />
            </Field>

            <Field
              htmlFor={'description'}
              label={'Опис'}
              error={errors.description?.message}
            >
              <textarea
                id={'description'}
                {...register('description')}
                rows={3}
                placeholder={"Опис товару (необов'язково)"}
                className={`w-full border rounded-lg px-3 py-2 text-sm outline-none font-[inherit] text-gray-900 bg-white resize-none ${errors.description
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300'
                  }`}
              />
            </Field>

            <div className={'grid grid-cols-2 gap-4'}>
              <Field
                htmlFor={'price'}
                label={'Ціна (₴)'}
                error={errors.price?.message}
              >
                <input
                  id={'price'}
                  {...register('price', { valueAsNumber: true })}
                  type={'number'}
                  min={'0'}
                  step={'0.01'}
                  placeholder={'0.00'}
                  className={inputClass(Boolean(errors.price))}
                />
              </Field>

              <Field
                htmlFor={'stock'}
                label={'Кількість на складі'}
                error={errors.stock?.message}
              >
                <input
                  id={'stock'}
                  {...register('stock', { valueAsNumber: true })}
                  type={'number'}
                  min={'0'}
                  step={'1'}
                  placeholder={'0'}
                  className={inputClass(Boolean(errors.stock))}
                />
              </Field>
            </div>

            <Field
              htmlFor={'categoryId'}
              label={'Категорія'}
              error={errors.categoryId?.message}
            >
              <select
                id={'categoryId'}
                {...register('categoryId')}
                className={`${inputClass(Boolean(errors.categoryId))} cursor-pointer`}
              >
                <option value={''}>{'Оберіть категорію'}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div
            className={
              'bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4'
            }
          >
            <h2 className={'text-sm font-semibold text-gray-700 uppercase tracking-wide'}>
              {'Зображення'}
            </h2>

            <Field
              htmlFor={'imageUrl'}
              label={'URL зображення'}
              error={errors.imageUrl?.message}
            >
              <input
                id={'imageUrl'}
                {...register('imageUrl')}
                type={'url'}
                placeholder={'https://example.com/image.jpg'}
                className={inputClass(Boolean(errors.imageUrl))}
              />
            </Field>

            <div
              className={
                'relative w-full aspect-video rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center'
              }
            >
              {hasValidImage ? (
                <Image
                  src={imageUrl ?? ''}
                  alt={'Попередній перегляд'}
                  fill
                  className={'object-contain'}
                  unoptimized
                />
              ) : (
                <div
                  className={
                    'flex flex-col items-center gap-2 text-gray-400'
                  }
                >
                  <ImageIcon size={32} strokeWidth={1.5} />
                  <span className={'text-xs'}>{'Попередній перегляд зображення'}</span>
                </div>
              )}
            </div>
          </div>

          <div className={'flex items-center justify-end gap-3'}>
            <Link
              href={'/admin/products'}
              className={
                'px-5 h-10 inline-flex items-center rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'
              }
            >
              {'Скасувати'}
            </Link>
            <button
              type={'submit'}
              disabled={isPending}
              className={`px-5 h-10 rounded-lg text-sm font-medium border-none font-[inherit] transition-colors ${isPending
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer'
                }`}
            >
              {isPending ? 'Збереження…' : 'Створити товар'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProductPage
