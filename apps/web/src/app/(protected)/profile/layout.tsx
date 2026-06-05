import { ProfileSidebar } from '@/src/components/profile/ProfileSidebar'
import type { ReactNode } from 'react'

type ProfileLayoutProps = {
  children: ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className={'min-h-screen bg-gray-50 p-6'}>
      <div className={'mx-auto max-w-[1200px]'}>
        <h1 className={'mb-6 text-2xl font-semibold text-gray-900'}>
          {'Мій профіль'}
        </h1>

        <div className={'flex gap-6'}>
          <ProfileSidebar />

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
