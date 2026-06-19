'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  getUserControllerGetMeQueryKey,
  useUserControllerGetMe,
  useUserControllerUpdateUser,
} from '@repo/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Field } from '../../../../components/Field'
import { formatDate } from '../../../../utils/date.util'

import { useSession } from 'next-auth/react'

const genderLabel: Record<'male' | 'female' | 'other', string> = {
  male: 'Чоловіча',
  female: 'Жіноча',
  other: 'Інше',
}

const PHONE_REGEX = /^\+?[\d\s\-()]{7,15}$/

const profileSchema = z.object({
  firstName: z.string().min(2, "Ім'я має містити мінімум 2 символи"),
  lastName: z.string().min(2, 'Прізвище має містити мінімум 2 символи'),
  phone: z.string().refine(
    (val) => val.length === 0 || PHONE_REGEX.test(val),
    { message: 'Невірний формат телефону' },
  ),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const disabledInputClass =
  'w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-800 outline-none disabled:cursor-default'

const editableInputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400'

const errorInputClass =
  'w-full rounded-lg border border-red-300 bg-white px-4 py-3 text-base text-gray-800 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400'

export default function PersonalDataPage() {
  const { data: session } = useSession()

  const accessToken =
    typeof session?.accessToken === 'string'
      ? session.accessToken
      : undefined

  const queryClient = useQueryClient()

  const { data: meData, isLoading } = useUserControllerGetMe({
    query: {
      enabled: Boolean(accessToken),
    },
    request: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    },
  })

  const user = meData?.data

  const mutation = useUserControllerUpdateUser({
    request: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    },
    mutation: {
      onSuccess: () => {
        toast.success('Профіль успішно оновлено')

        void queryClient.invalidateQueries({
          queryKey: getUserControllerGetMeQueryKey(),
        })
      },

      onError: () => {
        toast.error('Не вдалося оновити профіль')
      },
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
    },
  })

  useEffect(() => {
    if (!user) {
      return
    }

    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? '',
    })
  }, [user, reset])

  const onFormSubmit = useCallback(
    (values: ProfileFormValues) => {
      mutation.mutate({
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone === '' ? undefined : values.phone,
        },
      })
    },
    [mutation],
  )

  const handleCancel = useCallback(() => {
    if (!user) {
      return
    }

    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone ?? '',
    })
  }, [reset, user])

  return (
    <>
      <h2 className={'mb-6 text-lg font-semibold text-gray-900'}>
        {'Особисті дані'}
      </h2>

      {isLoading || !user ? (
        <p className={'text-sm text-gray-500'}>
          {'Завантаження…'}
        </p>
      ) : (
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className={'flex flex-col gap-5'}>
            <div className={'flex items-center gap-4'}>
              <div
                className={
                  'relative flex size-20 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-400'
                }
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    fill
                    sizes={'80px'}
                    className={'object-cover'}
                    unoptimized
                  />
                ) : (
                  <UserIcon size={32} />
                )}
              </div>
            </div>

            <div className={'grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2'}>
              <Field
                htmlFor={'firstName'}
                label={"Ім'я"}
                error={errors.firstName?.message}
              >
                <input
                  id={'firstName'}
                  type={'text'}
                  className={
                    errors.firstName
                      ? errorInputClass
                      : editableInputClass
                  }
                  {...register('firstName')}
                />
              </Field>

              <Field
                htmlFor={'lastName'}
                label={'Прізвище'}
                error={errors.lastName?.message}
              >
                <input
                  id={'lastName'}
                  type={'text'}
                  className={
                    errors.lastName
                      ? errorInputClass
                      : editableInputClass
                  }
                  {...register('lastName')}
                />
              </Field>

              <Field htmlFor={'email'} label={'Email'}>
                <input
                  id={'email'}
                  type={'email'}
                  value={user.email}
                  disabled
                  className={disabledInputClass}
                />
              </Field>

              <Field
                htmlFor={'phone'}
                label={'Телефон'}
                error={errors.phone?.message}
              >
                <input
                  id={'phone'}
                  type={'tel'}
                  className={
                    errors.phone
                      ? errorInputClass
                      : editableInputClass
                  }
                  {...register('phone')}
                />
              </Field>

              <Field
                htmlFor={'birthDate'}
                label={'Дата народження'}
              >
                <input
                  id={'birthDate'}
                  type={'date'}
                  value={formatDate(user.birthDate)}
                  disabled
                  className={disabledInputClass}
                />
              </Field>

              <Field htmlFor={'gender'} label={'Стать'}>
                <input
                  id={'gender'}
                  type={'text'}
                  value={user.gender ? genderLabel[user.gender] : ''}
                  disabled
                  className={disabledInputClass}
                />
              </Field>
            </div>

            <div className={'flex flex-wrap items-center gap-3 pt-2'}>
              <button
                type={'submit'}
                disabled={mutation.isPending || !isDirty}
                className={
                  'cursor-pointer rounded-lg border-none bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50'
                }
              >
                {mutation.isPending
                  ? 'Збереження...'
                  : 'Зберегти'}
              </button>

              <button
                type={'button'}
                onClick={handleCancel}
                disabled={mutation.isPending || !isDirty}
                className={
                  'cursor-pointer rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
                }
              >
                {'Скасувати'}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  )
}
