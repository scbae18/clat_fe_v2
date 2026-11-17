'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/common/Modal/Modal'
import Button from '@/components/common/Button/Button'
import Input from '@/components/common/Input/Input'
import Text from '@/components/common/Text/Text'
import { auth, type OauthProvider } from '@/services/auth'
import { apiErrorMessage } from '@/lib/api/http'
import { useUserStore } from '@/stores/userStore'
import { formatPhoneInput, normalizeKoreanMobile } from '@/lib/phone'
import SocialStartButtons from './SocialStartButtons'
import { stackStyle } from './IdentityVerificationModal.css'

export default function IdentityVerificationModal() {
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const open = Boolean(user?.needs_identity_verification)
  const normalized = normalizeKoreanMobile(phone)

  useEffect(() => {
    if (user?.phone) setPhone(formatPhoneInput(user.phone))
  }, [user?.phone])

  const sendCode = async () => {
    setError(null)
    if (!normalized) {
      setError('전화번호는 010으로 시작하는 휴대폰 번호여야 합니다.')
      return
    }
    setIsLoading(true)
    try {
      await auth.sendVerifyCode(normalized)
    } catch (err: unknown) {
      setError(apiErrorMessage(err, '인증 문자를 보내지 못했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  const confirm = async () => {
    setError(null)
    if (!normalized) return
    setIsLoading(true)
    try {
      const next = await auth.verifyPhone(normalized, code.trim())
      setUser(next)
    } catch (err: unknown) {
      setError(apiErrorMessage(err, '인증번호가 올바르지 않습니다.'))
    } finally {
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
        <Text variant="headingMd" color="gray700">계정을 확인해 주세요</Text>
        <Text variant="bodyMd" color="gray500">
          전화번호 인증 또는 소셜 연결 중 하나를 하면 다음부터는 이 창이 뜨지 않습니다.
        </Text>
        <Input
          placeholder="전화번호 (010-0000-0000)"
          shape="capsule"
          value={phone}
          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
          type="tel"
          inputMode="tel"
        />
        <Button variant="secondary" size="md" shape="capsule" fullWidth type="button" disabled={!normalized || isLoading} onClick={sendCode}>
          인증 문자 받기
        </Button>
        <Input
          placeholder="인증번호 6자리"
          shape="capsule"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
        />
        <Button variant="primary" size="md" shape="capsule" fullWidth type="button" disabled={code.length !== 6 || isLoading} onClick={confirm}>
          전화번호 인증
        </Button>
        <SocialStartButtons
          disabled={isLoading}
          kakaoLabel="카카오 연결"
          googleLabel="구글 연결"
          onKakao={() => link('kakao')}
          onGoogle={() => link('google')}
        />
        {error && <Text variant="bodyMd" color="error500">{error}</Text>}
      </div>
    </Modal>
  )
}
