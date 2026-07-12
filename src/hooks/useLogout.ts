'use client'

import { auth } from '@/services/auth'
import { useUserStore } from '@/stores/userStore'

export function useLogout() {
  const setUser = useUserStore((s) => s.setUser)

  return async () => {
    try {
      await auth.logout()
    } finally {
      setUser(null)
      window.location.href = '/login'
    }
  }
}
