'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

type ProtectedLayoutProps = {
  children: React.ReactNode
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { status } = useSession()

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

  if (status === 'unauthenticated') {
    return (
      <div
        className={
          'flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center'
        }
      >
        <p className={'text-base text-gray-700'}>
          {'Потрібна авторизація, щоб переглянути цю сторінку.'}
        </p>
        <Link
          href={'/login'}
          className={
            'px-6 h-11 inline-flex items-center rounded-lg bg-gray-900 text-white text-sm font-medium'
          }
        >
          {'Увійти'}
        </Link>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedLayout
