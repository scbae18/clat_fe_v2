'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/common/Modal/Modal'
import Button from '@/components/common/Button/Button'
import Input from '@/components/common/Input/Input'
import Text from '@/components/common/Text/Text'
import { auth } from '@/services/auth'
import { apiErrorMessage } from '@/lib/api/http'
import { useLogout } from '@/hooks/useLogout'
import { useUserStore } from '@/stores/userStore'
import { formatPhoneInput, normalizeKoreanMobile } from '@/lib/phone'
import { SIGNUP_APPROVAL_PHONE } from './PendingApprovalModal'
import { phoneBlockStyle, phoneChangeButtonStyle, phoneHelpStyle, stackStyle } from './IdentityVerificationModal.css'

export default function IdentityVerificationModal() {
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)
  const logout = useLogout()
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPhoneHelp, setShowPhoneHelp] = useState(false)
  const open = Boolean(user?.needs_identity_verification)
  const storedPhone = user?.phone ? normalizeKoreanMobile(user.phone) : null
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

  return (
    <Modal isOpen={open} onClose={() => undefined} size="sm">
      <div className={stackStyle}>
        <Text variant="headingMd" color="gray700">전화번호를 인증해 주세요</Text>
        <Text variant="bodyMd" color="gray500">
          {storedPhone
            ? '등록된 전화번호로 인증해야 이 창이 닫힙니다.'
            : '인증한 휴대폰 번호가 이 계정의 전화번호로 저장됩니다.'}
        </Text>
        <div className={phoneBlockStyle}>
          <Input
            placeholder="전화번호 (010-0000-0000)"
            shape="capsule"
            variant={storedPhone ? 'gray' : 'default'}
            value={phone}
            onChange={(e) => {
              if (storedPhone) return
              setPhone(formatPhoneInput(e.target.value))
            }}
            type="tel"
            inputMode="tel"
            readOnly={Boolean(storedPhone)}
          />
          {storedPhone && (
            <button type="button" className={phoneChangeButtonStyle} onClick={() => setShowPhoneHelp(true)}>
              전화번호가 달라요.
            </button>
          )}
          {storedPhone && showPhoneHelp && (
            <Text variant="labelSm" color="gray500" className={phoneHelpStyle}>
              운영자에게 문의하세요 {SIGNUP_APPROVAL_PHONE}
            </Text>
          )}
        </div>
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
        {error && <Text variant="bodyMd" color="error500">{error}</Text>}
        <Button
          variant="ghost"
          size="md"
          shape="capsule"
          fullWidth
          type="button"
          disabled={isLoggingOut}
          onClick={() => {
            setIsLoggingOut(true)
            void logout()
          }}
        >
          로그아웃
        </Button>
      </div>
    </Modal>
  )
}
