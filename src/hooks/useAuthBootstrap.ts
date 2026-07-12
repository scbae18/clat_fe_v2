'use client'

import { useEffect } from 'react'
import { auth } from '@/services/auth'
import { useUserStore } from '@/stores/userStore'

/** Loads /auth/me into Zustand once on mount. */
export function useAuthBootstrap() {
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    auth.me().then(setUser).catch(() => {})
  }, [setUser])
}
