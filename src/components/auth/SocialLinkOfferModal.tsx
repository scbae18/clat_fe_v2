'use client'

import { useState } from 'react'
import Modal from '@/components/common/Modal/Modal'
import Button from '@/components/common/Button/Button'
import Text from '@/components/common/Text/Text'
import { auth, type OauthProvider } from '@/services/auth'
import { apiErrorMessage } from '@/lib/api/http'
import { useUserStore } from '@/stores/userStore'
import SocialStartButtons from './SocialStartButtons'
import { stackStyle } from './IdentityVerificationModal.css'

export default function SocialLinkOfferModal() {
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const open = Boolean(user && !user.needs_identity_verification && user.needs_social_prompt)

  const skip = async () => {
    setError(null)
    setIsLoading(true)
    try {
      setUser(await auth.dismissSocialPrompt())
    } catch (err: unknown) {
      setError(apiErrorMessage(err, '안내를 닫지 못했습니다.'))
      setIsLoading(false)
    }
  }

  const link = async (provider: OauthProvider) => {
    setError(null)
    setIsLoading(true)
    try {
      const url = await auth.oauthLinkUrl(provider)
      window.location.assign(url)
    } catch (err: unknown) {
      setError(apiErrorMessage(err, '소셜 연결을 열지 못했어요.'))
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={open} onClose={() => undefined} size="sm">
      <div className={stackStyle}>
        <Text variant="headingMd" color="gray700">소셜 계정에 연결할 수 있어요</Text>
        <Text variant="bodyMd" color="gray500">
          카카오나 구글을 연결하면 다음에도 그 계정으로 로그인할 수 있습니다.
        </Text>
        <SocialStartButtons
          disabled={isLoading}
          kakaoLabel="카카오 연결"
          googleLabel="구글 연결"
          onKakao={() => link('kakao')}
          onGoogle={() => link('google')}
        />
        <Button variant="ghost" size="md" shape="capsule" fullWidth type="button" disabled={isLoading} onClick={skip}>
          안할래요
        </Button>
        {error && <Text variant="bodyMd" color="error500">{error}</Text>}
      </div>
    </Modal>
  )
}
