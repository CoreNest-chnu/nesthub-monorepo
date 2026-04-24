'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  getUserControllerGetMeQueryKey,
  useUserControllerGetMe,
  useUserControllerUpdateUser,
} from '@repo/api-client'
import { useQueryClient } from '@tanstack/react-query'
import {
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings,
  Star,
  User as UserIcon,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Field } from '@/src/components/Field'
import { formatDate } from '@/src/utils/date.util'

const navItems = [
  {
    href: '/profile',
    label: 'Особисті дані',
    icon: <UserIcon size={16} />,
    active: true,
  },
  { href: '/orders', label: 'Мої замовлення', icon: <Package size={16} /> },
  { href: '/addresses', label: 'Адреси доставки', icon: <MapPin size={16} /> },
  {
    href: '/payments',
    label: 'Способи оплати',
    icon: <CreditCard size={16} />,
  },
  { href: '/favorites', label: 'Обрані товари', icon: <Heart size={16} /> },
  { href: '/reviews', label: 'Відгуки', icon: <Star size={16} /> },
  { href: '/settings', label: 'Налаштування', icon: <Settings size={16} /> },
]

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
  'w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-gray-50 text-gray-800 outline-none disabled:cursor-default'

const editableInputClass =
  'w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-white text-gray-800 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400'

const errorInputClass =
  'w-full border border-red-300 rounded-lg px-4 py-3 text-base bg-white text-gray-800 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400'

const ProfilePage: React.FC = () => {
  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const queryClient = useQueryClient()

  const { data: meData, isLoading } = useUserControllerGetMe({
    query: { enabled: Boolean(accessToken) },
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  })

  const user = meData?.data

  const mutation = useUserControllerUpdateUser({
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
    mutation: {
      onSuccess: () => {
        toast.success('Профіль успішно оновлено')
        queryClient.invalidateQueries({
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
    defaultValues: { firstName: '', lastName: '', phone: '' },
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

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: '/login' })
  }, [])

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
    <div className={'min-h-screen bg-gray-50 p-6'}>
      <div className={'max-w-[1200px] mx-auto'}>
        <h1 className={'text-2xl font-semibold text-gray-900 mb-6'}>
          {'Мій профіль'}
        </h1>

        <div className={'flex gap-6'}>
          <aside
            className={
              'w-[260px] shrink-0 bg-white rounded-2xl border border-gray-200 p-3 h-fit'
            }
          >
            <nav className={'flex flex-col gap-1'}>
              {navItems.map(({ href, label, icon, active }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                    active
                      ? 'bg-gray-900 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}
              <button
                type={'button'}
                onClick={handleSignOut}
                className={
                  'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 bg-transparent border-none cursor-pointer text-left font-[inherit]'
                }
              >
                <LogOut size={16} />
                <span>{'Вийти'}</span>
              </button>
            </nav>
          </aside>

          <section
            className={'flex-1 bg-white rounded-2xl border border-gray-200 p-8'}
          >
            <h2 className={'text-lg font-semibold text-gray-900 mb-6'}>
              {'Особисті дані'}
            </h2>

            {isLoading || !user ? (
              <p className={'text-sm text-gray-500'}>{'Завантаження…'}</p>
            ) : (
              <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className={'flex flex-col gap-5'}>
                  <div className={'flex items-center gap-4'}>
                    <div
                      className={
                        'size-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden relative'
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

                  <div className={'grid grid-cols-2 gap-x-5 gap-y-5'}>
                    <Field
                      htmlFor={'firstName'}
                      label={"Ім'я"}
                      error={errors.firstName?.message}
                    >
                      <input
                        id={'firstName'}
                        type={'text'}
                        className={
                          errors.firstName ? errorInputClass : editableInputClass
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
                          errors.lastName ? errorInputClass : editableInputClass
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
                          errors.phone ? errorInputClass : editableInputClass
                        }
                        {...register('phone')}
                      />
                    </Field>

                    <Field htmlFor={'birthDate'} label={'Дата народження'}>
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

                  <div className={'flex items-center gap-3 pt-2'}>
                    <button
                      type={'submit'}
                      disabled={mutation.isPending || !isDirty}
                      className={
                        'px-6 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium cursor-pointer hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border-none font-[inherit]'
                      }
                    >
                      {mutation.isPending ? 'Збереження...' : 'Зберегти'}
                    </button>
                    <button
                      type={'button'}
                      onClick={handleCancel}
                      disabled={mutation.isPending || !isDirty}
                      className={
                        'px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-[inherit]'
                      }
                    >
                      {'Скасувати'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
