'use client'

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
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useCallback } from 'react'

type ProfileLayoutProps = {
  children: ReactNode
}

const baseLinkClass =
  'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm'

const activeLinkClass =
  'bg-gray-900 font-medium text-white'

const inactiveLinkClass =
  'text-gray-700 hover:bg-gray-100'

export default function ProfileLayout({
  children,
}: ProfileLayoutProps) {
  const pathname = usePathname()

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: '/login' })
  }, [])

  const personalDataClass =
    pathname === '/profile/personal-data'
      ? `${baseLinkClass} ${activeLinkClass}`
      : `${baseLinkClass} ${inactiveLinkClass}`

  const ordersClass =
    pathname === '/profile/orders'
      ? `${baseLinkClass} ${activeLinkClass}`
      : `${baseLinkClass} ${inactiveLinkClass}`

  const addressesClass =
    pathname === '/profile/addresses'
      ? `${baseLinkClass} ${activeLinkClass}`
      : `${baseLinkClass} ${inactiveLinkClass}`

  const paymentsClass =
    pathname === '/profile/payments'
      ? `${baseLinkClass} ${activeLinkClass}`
      : `${baseLinkClass} ${inactiveLinkClass}`

  const favoritesClass =
    pathname === '/profile/favorites'
      ? `${baseLinkClass} ${activeLinkClass}`
      : `${baseLinkClass} ${inactiveLinkClass}`

  const reviewsClass =
    pathname === '/profile/reviews'
      ? `${baseLinkClass} ${activeLinkClass}`
      : `${baseLinkClass} ${inactiveLinkClass}`

  const settingsClass =
    pathname === '/profile/settings'
      ? `${baseLinkClass} ${activeLinkClass}`
      : `${baseLinkClass} ${inactiveLinkClass}`

  return (
    <div className={'min-h-screen bg-gray-50 p-6'}>
      <div className={'mx-auto max-w-[1200px]'}>
        <h1 className={'mb-6 text-2xl font-semibold text-gray-900'}>
          {'Мій профіль'}
        </h1>

        <div className={'flex gap-6'}>
          <aside
            className={
              'h-fit w-[260px] shrink-0 rounded-2xl border border-gray-200 bg-white p-3'
            }
          >
            <nav className={'flex flex-col gap-1'}>
              <Link
                href={'/profile/personal-data'}
                className={personalDataClass}
              >
                <UserIcon size={16} />
                <span>{'Особисті дані'}</span>
              </Link>

              <Link
                href={'/profile/orders'}
                className={ordersClass}
              >
                <Package size={16} />
                <span>{'Мої замовлення'}</span>
              </Link>

              <Link
                href={'/profile/addresses'}
                className={addressesClass}
              >
                <MapPin size={16} />
                <span>{'Адреси доставки'}</span>
              </Link>

              <Link
                href={'/profile/payments'}
                className={paymentsClass}
              >
                <CreditCard size={16} />
                <span>{'Способи оплати'}</span>
              </Link>

              <Link
                href={'/profile/favorites'}
                className={favoritesClass}
              >
                <Heart size={16} />
                <span>{'Обрані товари'}</span>
              </Link>

              <Link
                href={'/profile/reviews'}
                className={reviewsClass}
              >
                <Star size={16} />
                <span>{'Відгуки'}</span>
              </Link>

              <Link
                href={'/profile/settings'}
                className={settingsClass}
              >
                <Settings size={16} />
                <span>{'Налаштування'}</span>
              </Link>

              <button
                type={'button'}
                onClick={handleSignOut}
                className={
                  'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:bg-red-50'
                }
              >
                <LogOut size={16} />
                <span>{'Вийти'}</span>
              </button>
            </nav>
          </aside>

          <section
            className={
              'min-h-[400px] flex-1 rounded-2xl border border-gray-200 bg-white p-8'
            }
          >
            {children}
          </section>
        </div>
      </div>
    </div>
  )
}
