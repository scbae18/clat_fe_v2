'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BodyScrollLock from '@/components/common/Modal/BodyScrollLock'
import TutorialProvider from '@/features/tutorial/TutorialProvider'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: true,
        retry: 1,
      },
    },
  })
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <TutorialProvider>
        <BodyScrollLock />
        {children}
      </TutorialProvider>
    </QueryClientProvider>
  )
}
