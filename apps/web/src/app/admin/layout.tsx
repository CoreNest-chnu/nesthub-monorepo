'use client'

import { useSession } from 'next-auth/react'
import { Package, ShoppingBag, Tag } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

type AdminLayoutProps = {
  children: ReactNode
}

const navItems = [
  { href: '/admin/products', label: 'Товари', icon: Package },
  { href: '/admin/categories', label: 'Категорії', icon: Tag },
  { href: '/admin/orders', label: 'Замовлення', icon: ShoppingBag },
]

const baseLinkClass = 'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm'
const activeLinkClass = 'bg-gray-900 font-medium text-white'
const inactiveLinkClass = 'text-gray-700 hover:bg-gray-100'

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === 'loading') {
    return (
      <div
        className={
          'flex-1 flex items-center justify-center text-sm text-gray-500'
        }
      >
        {'Завантаження…'}
      </div>
    )
  }

  if (status === 'unauthenticated' || session?.user.role !== 'admin') {
    return (
      <div
        className={
          'flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center'
        }
      >
        <p className={'text-base text-gray-700'}>
          {'Доступ заборонено. Ця сторінка доступна лише адміністраторам.'}
        </p>
        <Link
          href={'/'}
          className={
            'px-6 h-11 inline-flex items-center rounded-lg bg-gray-900 text-white text-sm font-medium'
          }
        >
          {'На головну'}
        </Link>
      </div>
    )
  }

  return (
    <div className={'min-h-screen bg-gray-50 p-6'}>
      <div className={'mx-auto max-w-[1400px]'}>
        <h1 className={'mb-6 text-2xl font-semibold text-gray-900'}>
          {'Адмін-панель'}
        </h1>

        <div className={'flex gap-6'}>
          <aside
            className={
              'h-fit w-[220px] shrink-0 rounded-2xl border border-gray-200 bg-white p-3'
            }
          >
            <nav className={'flex flex-col gap-1'}>
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={
                    pathname.startsWith(href)
                      ? `${baseLinkClass} ${activeLinkClass}`
                      : `${baseLinkClass} ${inactiveLinkClass}`
                  }
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          <section className={'flex-1 min-w-0'}>
            {children}
          </section>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
