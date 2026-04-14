'use client'

import { useEffect } from 'react'
import { auth } from '@/services/auth'
import { useUserStore } from '@/stores/userStore'

export default function UserInitializer() {
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    auth.me().then(setUser).catch(() => {})
  }, [])

  return null
}