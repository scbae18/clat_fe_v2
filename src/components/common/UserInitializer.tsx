'use client'

import { useAuthBootstrap } from '@/hooks/useAuthBootstrap'

export default function UserInitializer() {
  useAuthBootstrap()
  return null
}
