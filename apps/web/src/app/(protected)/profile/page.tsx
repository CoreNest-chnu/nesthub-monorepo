'use client'

import { useUserControllerGetMe } from '@repo/api-client'
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
import Link from 'next/link'
import { useCallback } from 'react'
import { Field } from '@/src/components/field'
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

const ProfilePage: React.FC = () => {
  const { data: session } = useSession()
  const accessToken = session?.accessToken

  const { data, isLoading } = useUserControllerGetMe({
    query: { enabled: Boolean(accessToken) },
    request: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  })

  const user = data?.data

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: '/login' })
  }, [])

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-gray-50 text-gray-800 outline-none disabled:cursor-default'

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
              <div className={'flex flex-col gap-5'}>
                <div className={'flex items-center gap-4'}>
                  <div
                    className={
                      'size-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden'
                    }
                  >
                    <UserIcon size={32} />
                  </div>
                </div>

                <div className={'grid grid-cols-2 gap-x-5 gap-y-5'}>
                  <Field htmlFor={'firstName'} label={"Ім'я"}>
                    <input
                      id={'firstName'}
                      type={'text'}
                      value={user.firstName}
                      // FIXME: Disabled bc of MVP, will be editable in the future
                      disabled
                      className={inputClass}
                    />
                  </Field>

                  <Field htmlFor={'lastName'} label={'Прізвище'}>
                    <input
                      id={'lastName'}
                      type={'text'}
                      value={user.lastName}
                      // FIXME: Disabled bc of MVP, will be editable in the future
                      disabled
                      className={inputClass}
                    />
                  </Field>

                  <Field htmlFor={'email'} label={'Email'}>
                    <input
                      id={'email'}
                      type={'email'}
                      value={user.email}
                      // FIXME: Disabled bc of MVP, will be editable in the future
                      disabled
                      className={inputClass}
                    />
                  </Field>

                  <Field htmlFor={'phone'} label={'Телефон'}>
                    <input
                      id={'phone'}
                      type={'tel'}
                      value={user.phone ?? ''}
                      // FIXME: Disabled bc of MVP, will be editable in the future
                      disabled
                      className={inputClass}
                    />
                  </Field>

                  <Field htmlFor={'birthDate'} label={'Дата народження'}>
                    <input
                      id={'birthDate'}
                      type={'date'}
                      value={formatDate(user.birthDate)}
                      // FIXME: Disabled bc of MVP, will be editable in the future
                      disabled
                      className={inputClass}
                    />
                  </Field>

                  <Field htmlFor={'gender'} label={'Стать'}>
                    <input
                      id={'gender'}
                      type={'text'}
                      value={user.gender ? genderLabel[user.gender] : ''}
                      // FIXME: Disabled bc of MVP, will be editable in the future
                      disabled
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
