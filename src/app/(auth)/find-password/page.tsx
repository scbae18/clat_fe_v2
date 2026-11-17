'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth } from '@/services/auth'
import { apiErrorMessage } from '@/lib/api/http'
import {
  containerStyle,
  loginBoxStyle,
  logoSectionStyle,
  formStyle,
  submitButtonStyle,
  footerLinkStyle,
  footerLinkAnchorStyle,
  noticeStyle,
  logoMarkStyle,
} from '../login/login.css'
import Input from '@/components/common/Input/Input'
import Button from '@/components/common/Button/Button'
import Text from '@/components/common/Text/Text'
import Logo from '@/assets/logo/logo-full.svg'

const MIN_PASSWORD_LEN = 8

export default function FindPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendCode = async () => {
    setError(null)
    setIsLoading(true)
    try {
      await auth.sendAccountCode('reset', email.trim())
      setSent(true)
    } catch (err: unknown) {
      setError(apiErrorMessage(err, '인증 문자를 보내지 못했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  const reset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < MIN_PASSWORD_LEN) {
      setError(`비밀번호는 ${MIN_PASSWORD_LEN}자 이상이어야 합니다.`)
      return
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setIsLoading(true)
    try {
      await auth.resetPassword({ email: email.trim(), code: code.trim(), new_password: password })
      router.push('/login')
    } catch (err: unknown) {
      setError(apiErrorMessage(err, '비밀번호를 바꾸지 못했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={containerStyle}>
      <div className={loginBoxStyle}>
        <div className={logoSectionStyle}>
          <Logo className={logoMarkStyle} />
          <Text variant="headingMd" color="gray500">비밀번호 찾기</Text>
        </div>
        <form className={formStyle} onSubmit={reset}>
          <Input
            placeholder="가입 이메일"
            shape="capsule"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setSent(false)
              setCode('')
            }}
            type="email"
            autoComplete="email"
          />
          <Input placeholder="새 비밀번호 (8자 이상)" shape="capsule" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" />
          <Input placeholder="새 비밀번호 확인" shape="capsule" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} type="password" autoComplete="new-password" />
          <Text variant="bodyMd" color="gray500">
            인증번호는 이 계정에 등록된 휴대폰으로 갑니다.
          </Text>
          <Button variant="secondary" size="lg" shape="capsule" fullWidth type="button" disabled={!email || isLoading} onClick={sendCode}>
            {isLoading && !sent ? '보내는 중...' : '인증번호 받기'}
          </Button>
          {sent && (
            <>
              <Text variant="bodyMd" color="gray500">
                등록된 번호로 문자를 보냈습니다. 번호가 없는 계정은 문자가 가지 않습니다.
              </Text>
              <Input placeholder="인증번호 6자리" shape="capsule" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" />
            </>
          )}
          <Button variant="primary" size="lg" shape="capsule" fullWidth type="submit" className={submitButtonStyle} disabled={!sent || code.length !== 6 || password.length < MIN_PASSWORD_LEN || isLoading}>
            {isLoading && sent ? '변경 중...' : '비밀번호 변경'}
          </Button>
          {error && (
            <div className={noticeStyle}>
              <Text variant="bodyMd" color="error500">{error}</Text>
            </div>
          )}
        </form>
        <div className={footerLinkStyle}>
          <Link href="/login" className={footerLinkAnchorStyle}>
            <Text variant="bodyLg" color="gray300">로그인</Text>
          </Link>
        </div>
      </div>
    </div>
  )
}
