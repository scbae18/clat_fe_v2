'use client'

import { Suspense } from 'react'
import OauthCallback from '@/components/auth/OauthCallback'

export default function GoogleCallbackPage() {
  return (
    <Suspense>
      <OauthCallback provider="google" />
    </Suspense>
  )
}
