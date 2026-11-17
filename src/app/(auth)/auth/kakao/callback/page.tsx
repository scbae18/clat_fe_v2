'use client'

import { Suspense } from 'react'
import OauthCallback from '@/components/auth/OauthCallback'

export default function KakaoCallbackPage() {
  return (
    <Suspense>
      <OauthCallback provider="kakao" />
    </Suspense>
  )
}
