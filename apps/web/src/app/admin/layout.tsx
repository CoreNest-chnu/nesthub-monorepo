'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import type { ReactNode } from 'react'

type AdminLayoutProps = {
  children: ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession()

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

  return <>{children}</>
}

export default AdminLayout
