import { ProfileSidebar } from '@/src/components/profile/ProfileSidebar'
import type { ReactNode } from 'react'

type ProfileLayoutProps = {
  children: ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className={'min-h-screen bg-gray-50 p-4 sm:p-6'}>
      <div className={'mx-auto max-w-[1200px]'}>
        <h1 className={'mb-4 text-xl font-semibold text-gray-900 sm:mb-6 sm:text-2xl'}>
          {'Мій профіль'}
        </h1>

        <div className={'flex flex-col gap-6 lg:flex-row'}>
          <ProfileSidebar />

          <section
            className={
              'min-h-[400px] min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white p-5 sm:p-8'
            }
          >
            {children}
          </section>
        </div>
      </div>
    </div>
  )
}
