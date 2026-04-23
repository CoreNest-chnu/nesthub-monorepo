'use client'

import { useUserControllerGetMe } from '@repo/api-client'
import { format } from 'date-fns'
import {
  ChevronDown,
  CreditCard,
  Eye,
  EyeOff,
  Heart,
  LogOut,
  MapPin,
  Settings,
  ShoppingBag,
  Star,
  User,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { useToggle } from 'usehooks-ts'

type UserProfile = {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  gender: string
}

function parseProfile(data: Record<string, unknown>): UserProfile {
  return {
    firstName: typeof data.firstName === 'string' ? data.firstName : '',
    lastName: typeof data.lastName === 'string' ? data.lastName : '',
    email: typeof data.email === 'string' ? data.email : '',
    phone: typeof data.phone === 'string' ? data.phone : '',
    birthDate: typeof data.birthDate === 'string' ? data.birthDate : '',
    gender: typeof data.gender === 'string' ? data.gender : '',
  }
}

const navItems = [
  { href: '/profile', label: 'Особисті дані', icon: User },
  { href: '/profile/orders', label: 'Мої замовлення', icon: ShoppingBag },
  { href: '/profile/addresses', label: 'Адреси доставки', icon: MapPin },
  { href: '/profile/payment', label: 'Способи оплати', icon: CreditCard },
  { href: '/profile/favorites', label: 'Обрані товари', icon: Heart },
  { href: '/profile/reviews', label: 'Відгуки', icon: Star },
  { href: '/profile/settings', label: 'Налаштування', icon: Settings },
]

const CalendarIcon: React.FC = () => (
  <svg
    width={'16'}
    height={'16'}
    viewBox={'0 0 24 24'}
    fill={'none'}
    stroke={'currentColor'}
    strokeWidth={'2'}
    aria-hidden={'true'}
  >
    <rect x={'3'} y={'4'} width={'18'} height={'18'} rx={'2'} ry={'2'} />
    <line x1={'16'} y1={'2'} x2={'16'} y2={'6'} />
    <line x1={'8'} y1={'2'} x2={'8'} y2={'6'} />
    <line x1={'3'} y1={'10'} x2={'21'} y2={'10'} />
  </svg>
)

const FieldSkeleton: React.FC = () => (
  <div className={'flex flex-col gap-1'}>
    <div className={'h-4 w-24 rounded bg-gray-200 animate-pulse'} />
    <div className={'h-[42px] w-full rounded-lg bg-gray-200 animate-pulse'} />
  </div>
)

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [showCurrentPassword, toggleCurrentPassword] = useToggle(false)
  const [showNewPassword, toggleNewPassword] = useToggle(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?returnUrl=/profile')
    }
  }, [status, router])

  const { data: userData, isLoading, isError } = useUserControllerGetMe({
    request: {
      headers: {
        Authorization: session?.accessToken
          ? `Bearer ${session.accessToken}`
          : '',
      },
    },
    query: {
      enabled: status === 'authenticated',
    },
  })

  const profile =
    userData?.data !== undefined ? parseProfile(userData.data) : undefined

  const formattedBirthDate =
    profile?.birthDate
      ? format(new Date(profile.birthDate), 'dd.MM.yyyy')
      : ''

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: '/login' })
  }, [])

  const handleToggleCurrentPassword = useCallback(() => {
    toggleCurrentPassword()
  }, [toggleCurrentPassword])

  const handleToggleNewPassword = useCallback(() => {
    toggleNewPassword()
  }, [toggleNewPassword])

  if (status === 'loading' || status === 'unauthenticated') {
    return null
  }

  return (
    <div className={'min-h-screen bg-gray-100'}>
      <div
        className={'max-w-[1200px] mx-auto px-6 py-8 flex gap-6 items-start'}
      >
        <aside className={'w-[220px] shrink-0'}>
          <nav className={'flex flex-col gap-1'}>
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  href === '/profile'
                    ? 'bg-gray-900 !text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <button
              type={'button'}
              onClick={handleSignOut}
              className={
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-none bg-transparent font-[inherit] w-full text-left'
              }
            >
              <LogOut size={16} />
              {'Вийти'}
            </button>
          </nav>
        </aside>

        <main
          className={'flex-1 bg-white rounded-2xl border border-gray-200 p-8'}
        >
          <h1 className={'text-lg font-semibold text-gray-900 mb-6'}>
            {'Особисті дані'}
          </h1>

          {isError ? (
            <div
              className={
                'flex flex-col items-center justify-center py-16 gap-3'
              }
            >
              <p className={'text-sm font-medium text-red-500'}>
                {'Не вдалося завантажити дані профілю'}
              </p>
              <p className={'text-xs text-gray-400'}>
                {'Спробуйте оновити сторінку'}
              </p>
            </div>
          ) : (
            <>
              <div className={'flex items-center gap-4 mb-8'}>
                {isLoading ? (
                  <>
                    <div
                      className={
                        'w-16 h-16 rounded-full bg-gray-200 animate-pulse shrink-0'
                      }
                    />
                    <div
                      className={'h-8 w-20 rounded-lg bg-gray-200 animate-pulse'}
                    />
                  </>
                ) : (
                  <>
                    <div
                      className={
                        'w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0'
                      }
                    >
                      <User size={28} className={'text-gray-400'} />
                    </div>
                    <button
                      type={'button'}
                      className={
                        'text-sm text-gray-700 border border-gray-300 rounded-lg px-4 py-1.5 hover:bg-gray-50 cursor-pointer bg-transparent font-[inherit]'
                      }
                    >
                      {'Змінити'}
                    </button>
                  </>
                )}
              </div>

              <div className={'grid grid-cols-2 gap-4 mb-8'}>
                {isLoading ? (
                  <>
                    <FieldSkeleton />
                    <FieldSkeleton />
                    <FieldSkeleton />
                    <FieldSkeleton />
                    <FieldSkeleton />
                    <FieldSkeleton />
                  </>
                ) : (
                  <>
                    <div className={'flex flex-col gap-1'}>
                      <label
                        htmlFor={'firstName'}
                        className={'text-sm font-medium text-gray-700'}
                      >
                        {"Ім'я"}
                      </label>
                      <input
                        id={'firstName'}
                        readOnly
                        value={profile?.firstName ?? ''}
                        placeholder={"Введіть ім'я"}
                        className={
                          'border border-gray-300 rounded-lg px-3 h-[42px] text-sm text-gray-900 bg-white outline-none font-[inherit]'
                        }
                      />
                    </div>

                    <div className={'flex flex-col gap-1'}>
                      <label
                        htmlFor={'lastName'}
                        className={'text-sm font-medium text-gray-700'}
                      >
                        {'Прізвище'}
                      </label>
                      <input
                        id={'lastName'}
                        readOnly
                        value={profile?.lastName ?? ''}
                        placeholder={'Введіть прізвище'}
                        className={
                          'border border-gray-300 rounded-lg px-3 h-[42px] text-sm text-gray-900 bg-white outline-none font-[inherit]'
                        }
                      />
                    </div>

                    <div className={'flex flex-col gap-1'}>
                      <label
                        htmlFor={'email'}
                        className={'text-sm font-medium text-gray-700'}
                      >
                        {'Email'}
                      </label>
                      <input
                        id={'email'}
                        readOnly
                        value={profile?.email ?? ''}
                        placeholder={'email@example.com'}
                        className={
                          'border border-gray-300 rounded-lg px-3 h-[42px] text-sm text-gray-900 bg-white outline-none font-[inherit]'
                        }
                      />
                    </div>

                    <div className={'flex flex-col gap-1'}>
                      <label
                        htmlFor={'phone'}
                        className={'text-sm font-medium text-gray-700'}
                      >
                        {'Телефон'}
                      </label>
                      <input
                        id={'phone'}
                        readOnly
                        value={profile?.phone ?? ''}
                        placeholder={'+38 (099) 123-45-67'}
                        className={
                          'border border-gray-300 rounded-lg px-3 h-[42px] text-sm text-gray-900 bg-white outline-none font-[inherit]'
                        }
                      />
                    </div>

                    <div className={'flex flex-col gap-1'}>
                      <label
                        htmlFor={'birthDate'}
                        className={'text-sm font-medium text-gray-700'}
                      >
                        {'Дата народження'}
                      </label>
                      <div className={'relative'}>
                        <input
                          id={'birthDate'}
                          readOnly
                          value={formattedBirthDate}
                          placeholder={'Оберіть дату'}
                          className={
                            'w-full border border-gray-300 rounded-lg px-3 h-[42px] text-sm text-gray-900 bg-white outline-none font-[inherit] pr-10'
                          }
                        />
                        <span
                          className={
                            'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
                          }
                        >
                          <CalendarIcon />
                        </span>
                      </div>
                    </div>

                    <div className={'flex flex-col gap-1'}>
                      <label
                        htmlFor={'gender'}
                        className={'text-sm font-medium text-gray-700'}
                      >
                        {'Стать'}
                      </label>
                      <div className={'relative'}>
                        <input
                          id={'gender'}
                          readOnly
                          value={profile?.gender ?? ''}
                          placeholder={'Виберіть стать'}
                          className={
                            'w-full border border-gray-300 rounded-lg px-3 h-[42px] text-sm text-gray-900 bg-white outline-none font-[inherit] pr-10'
                          }
                        />
                        <span
                          className={
                            'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
                          }
                        >
                          <ChevronDown size={16} />
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div>
                <h2
                  className={'text-base font-semibold text-gray-900 mb-4'}
                >
                  {'Зміна пароля'}
                </h2>
                <div className={'flex flex-col gap-4'}>
                  <div className={'flex flex-col gap-1'}>
                    <label
                      htmlFor={'currentPassword'}
                      className={'text-sm font-medium text-gray-700'}
                    >
                      {'Поточний пароль'}
                    </label>
                    <div
                      className={
                        'flex items-center border border-gray-300 rounded-lg px-3 h-[42px]'
                      }
                    >
                      <input
                        id={'currentPassword'}
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder={'Введіть поточний пароль'}
                        className={
                          'flex-1 border-none outline-none text-sm bg-transparent text-gray-900 font-[inherit]'
                        }
                      />
                      <button
                        type={'button'}
                        onClick={handleToggleCurrentPassword}
                        className={
                          'bg-transparent border-none cursor-pointer p-0 flex text-gray-400'
                        }
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className={'flex flex-col gap-1'}>
                    <label
                      htmlFor={'newPassword'}
                      className={'text-sm font-medium text-gray-700'}
                    >
                      {'Новий пароль'}
                    </label>
                    <div
                      className={
                        'flex items-center border border-gray-300 rounded-lg px-3 h-[42px]'
                      }
                    >
                      <input
                        id={'newPassword'}
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder={'Введіть новий пароль'}
                        className={
                          'flex-1 border-none outline-none text-sm bg-transparent text-gray-900 font-[inherit]'
                        }
                      />
                      <button
                        type={'button'}
                        onClick={handleToggleNewPassword}
                        className={
                          'bg-transparent border-none cursor-pointer p-0 flex text-gray-400'
                        }
                        tabIndex={-1}
                      >
                        {showNewPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={'flex items-center gap-3 mt-8'}>
                <button
                  type={'button'}
                  className={
                    'bg-gray-900 text-white text-sm font-medium rounded-xl px-6 py-2.5 border-none cursor-pointer font-[inherit]'
                  }
                >
                  {'Зберегти зміни'}
                </button>
                <button
                  type={'button'}
                  className={
                    'bg-transparent text-gray-700 text-sm font-medium rounded-xl px-6 py-2.5 border border-gray-300 cursor-pointer font-[inherit]'
                  }
                >
                  {'Скасувати'}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
