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
import { useCallback } from 'react'

const baseLinkClass = 'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-colors'
const activeLinkClass = 'bg-gray-900 font-medium text-white'
const inactiveLinkClass = 'text-gray-700 hover:bg-gray-100'

const navItems = [
  { href: '/profile/personal-data', label: 'Особисті дані', icon: UserIcon, exact: true },
  { href: '/profile/orders', label: 'Мої замовлення', icon: Package, exact: false },
  { href: '/profile/addresses', label: 'Адреси доставки', icon: MapPin, exact: true },
  { href: '/profile/payments', label: 'Способи оплати', icon: CreditCard, exact: true },
  { href: '/profile/favorites', label: 'Обрані товари', icon: Heart, exact: true },
  { href: '/profile/reviews', label: 'Відгуки', icon: Star, exact: true },
  { href: '/profile/settings', label: 'Налаштування', icon: Settings, exact: true },
]

export const ProfileSidebar = () => {
  const pathname = usePathname()

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: '/login' })
  }, [])

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside
      className={
        'h-fit w-full rounded-2xl border border-gray-200 bg-white p-3 lg:w-[260px] lg:shrink-0'
      }
    >
      <nav className={'flex gap-1 overflow-x-auto lg:flex-col'}>
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={
              isActive(href, exact)
                ? `${baseLinkClass} ${activeLinkClass}`
                : `${baseLinkClass} ${inactiveLinkClass}`
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </Link>
        ))}

        <button
          type={'button'}
          onClick={handleSignOut}
          className={
            'flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-500 whitespace-nowrap hover:bg-red-50 transition-colors'
          }
        >
          <LogOut size={16} />
          <span>{'Вийти'}</span>
        </button>
      </nav>
    </aside>
  )
}
