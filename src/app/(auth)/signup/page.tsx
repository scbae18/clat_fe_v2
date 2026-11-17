'use client'

import { useRef, useState } from 'react'
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
  dividerStyle,
  noticeStyle,
  logoMarkStyle,
} from '../login/login.css'
import Input from '@/components/common/Input/Input'
import Button from '@/components/common/Button/Button'
import Text from '@/components/common/Text/Text'
import Logo from '@/assets/logo/logo-full.svg'
import { formatPhoneInput, normalizeKoreanMobile } from '@/lib/phone'

const MIN_PASSWORD_LEN = 8

function SignupContent() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [phoneProof, setPhoneProof] = useState<string | null>(null)
  const [codeSent, setCodeSent] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const router = useRouter()
  const passwordConfirmRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<'send' | 'confirm' | 'submit' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const passwordsMismatch = passwordConfirm.length > 0 && password !== passwordConfirm
  const passwordTooShort = password.length > 0 && password.length < MIN_PASSWORD_LEN
  const normalizedPhone = normalizeKoreanMobile(phone)
  const canSubmit =
    phoneProof != null &&
    name.trim().length > 0 &&
    email.length > 0 &&
    password.length >= MIN_PASSWORD_LEN &&
    password === passwordConfirm &&
    pending == null

  const sendCode = async () => {
    setError(null)
    if (!normalizedPhone) {
      setError('전화번호는 010으로 시작하는 휴대폰 번호여야 합니다.')
      return
    }
    setPending('send')
    try {
      await auth.sendSignupCode(normalizedPhone)
      setCodeSent(true)
    } catch (err: unknown) {
      setError(apiErrorMessage(err, '인증 문자를 보내지 못했습니다.'))
    } finally {
      setPending(null)
    }
  }

  const confirmCode = async () => {
    setError(null)
    if (!normalizedPhone) {
      setError('전화번호는 010으로 시작하는 휴대폰 번호여야 합니다.')
      return
    }
    setPending('confirm')
    try {
      const proof = await auth.confirmSignupCode(normalizedPhone, code.trim())
      setPhoneProof(proof)
    } catch (err: unknown) {
      setError(apiErrorMessage(err, '인증번호가 올바르지 않습니다.'))
    } finally {
      setPending(null)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!phoneProof || !normalizedPhone) {
      setError('전화번호 인증을 먼저 끝내 주세요.')
      return
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      passwordConfirmRef.current?.focus()
      return
    }
    setPending('submit')
    try {
      await auth.signup({
        email: email.trim(),
        password,
        name: name.trim(),
        phone: normalizedPhone,
        phoneProof,
      })
      router.push('/login?joined=1')
    } catch (err: unknown) {
      setError(apiErrorMessage(err, '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.'))
    } finally {
      setPending(null)
    }
  }

  return (
    <div className={containerStyle}>
      <div className={loginBoxStyle}>
        <div className={logoSectionStyle}>
          <Logo className={logoMarkStyle} />
          <Text variant="headingMd" color="gray500">
            학원 강사 행정 자동화 AI 수업 운영 플랫폼
          </Text>
        </div>

        <form className={formStyle} onSubmit={handleSignup}>
          <Input placeholder="이름" shape="capsule" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          <Input placeholder="이메일" shape="capsule" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" />
          <Input placeholder="비밀번호 (8자 이상)" shape="capsule" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" />
          <Input placeholder="비밀번호 확인" shape="capsule" ref={passwordConfirmRef} value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} type="password" autoComplete="new-password" />
          {passwordTooShort && <Text variant="bodyMd" color="error500">비밀번호는 {MIN_PASSWORD_LEN}자 이상이어야 합니다.</Text>}
          {passwordsMismatch && <Text variant="bodyMd" color="error500">비밀번호가 일치하지 않습니다.</Text>}
          <Input
            placeholder="전화번호 (010-0000-0000)"
            shape="capsule"
            value={phone}
            onChange={(e) => {
              setPhone(formatPhoneInput(e.target.value))
              setPhoneProof(null)
              setCodeSent(false)
              setCode('')
            }}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            disabled={phoneProof != null}
          />
          {phoneProof == null && (
            <Button variant="secondary" size="lg" shape="capsule" fullWidth type="button" disabled={!normalizedPhone || pending != null} onClick={sendCode}>
              {pending === 'send' ? '보내는 중...' : '인증번호 받기'}
            </Button>
          )}
          {phoneProof == null && codeSent && (
            <>
              <Input
                placeholder="인증번호 6자리"
                shape="capsule"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
              <Button variant="outlined" size="lg" shape="capsule" fullWidth type="button" disabled={code.length !== 6 || pending != null} onClick={confirmCode}>
                {pending === 'confirm' ? '확인 중...' : '인증 확인'}
              </Button>
            </>
          )}
          {phoneProof != null && (
            <Text variant="bodyMd" color="gray500">
              전화번호 인증이 끝났습니다.
            </Text>
          )}
          <Button variant="primary" size="lg" shape="capsule" fullWidth type="submit" className={submitButtonStyle} disabled={!canSubmit}>
            {pending === 'submit' ? '가입 중...' : '회원가입'}
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
          <div className={dividerStyle} />
          <Link href="/find-password" className={footerLinkAnchorStyle}>
            <Text variant="bodyLg" color="gray300">비밀번호 찾기</Text>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return <SignupContent />
}
