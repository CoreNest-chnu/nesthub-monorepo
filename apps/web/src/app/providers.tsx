'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useState } from 'react'
import { Toaster } from 'sonner'

type ProvidersProps = {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          {children}
          <Toaster position={'bottom-right'} richColors />
          <ReactQueryDevtools />
        </NuqsAdapter>
      </QueryClientProvider>
    </SessionProvider>
  )
}
