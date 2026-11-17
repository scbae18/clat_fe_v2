'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { auth, type OauthCallbackResult, type OauthProvider } from '@/services/auth'
import { apiErrorMessage } from '@/lib/api/http'
import { useUserStore } from '@/stores/userStore'
import {
  containerStyle,
  loginBoxStyle,
  formStyle,
  submitButtonStyle,
  noticeStyle,
} from '@/app/(auth)/login/login.css'
import Input from '@/components/common/Input/Input'
import Button from '@/components/common/Button/Button'
import Text from '@/components/common/Text/Text'
import { formatPhoneInput, normalizeKoreanMobile } from '@/lib/phone'

const callbackInflight = new Map<string, Promise<OauthCallbackResult>>()

export default function OauthCallback({ provider }: { provider: OauthProvider }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setUser = useUserStore((s) => s.setUser)
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [nameHint, setNameHint] = useState('')
  const [emailHint, setEmailHint] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [smsMode, setSmsMode] = useState(false)
  const [mode, setMode] = useState<'signup' | 'connect'>('signup')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const normalizedPhone = normalizeKoreanMobile(phone)

  const finish = (user: Parameters<typeof setUser>[0]) => {
    setUser(user)
    router.replace('/home')
  }

  useEffect(() => {
    const codeParam = searchParams.get('code')
    const state = searchParams.get('state')
    if (!codeParam || !state) {
      setError('소셜 로그인 응답이 없어요. 다시 시도해 주세요.')
      return
    }
    const key = `${provider}:${state}`
    let pending = callbackInflight.get(key)
    if (!pending) {
      pending = auth.oauthCallback(provider, codeParam, state)
      callbackInflight.set(key, pending)
    }
    let cancelled = false
    setIsLoading(true)
    pending
      .then((result) => {
        if (cancelled) return
        if (result.status === 'choose') {
          const hintedName = result.name_hint ?? ''
          const hintedEmail = result.email_hint ?? ''
          setLinkToken(result.link_token)
          setNameHint(hintedName)
          setEmailHint(hintedEmail)
          setName(hintedName)
          setEmail(hintedEmail)
          setIsLoading(false)
          return
        }
        setUser(result.user)
        router.replace('/home')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(apiErrorMessage(err, '소셜 로그인에 실패했어요.'))
        setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [provider, router, searchParams, setUser])

  const complete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkToken) return
    setError(null)
    setIsLoading(true)
    try {
      const user = await auth.oauthComplete({
        linkToken,
        action: mode,
        name: mode === 'signup' ? name.trim() : undefined,
        email: email.trim(),
        password: mode === 'connect' && !smsMode ? password : undefined,
        code: mode === 'connect' && smsMode ? code.trim() : undefined,
      })
      finish(user)
    } catch (err: unknown) {
      setError(apiErrorMessage(err, '계정을 연결하지 못했어요.'))
      setIsLoading(false)
    }
  }

  const chooseMode = (next: 'signup' | 'connect') => {
    setMode(next)
    setError(null)
    setPassword('')
    setPhone('')
    setCode('')
    setCodeSent(false)
    setSmsMode(false)
    if (next === 'connect') {
      setName('')
      setEmail('')
      return
    }
    setName(nameHint)
    setEmail(emailHint)
  }

  const sendLinkCode = async () => {
    if (!linkToken || !email.trim() || !normalizedPhone) return
    setError(null)
    setIsLoading(true)
    try {
      await auth.sendAccountCode('link', email.trim(), linkToken, normalizedPhone)
      setCodeSent(true)
    } catch (err: unknown) {
      setError(apiErrorMessage(err, '인증 문자를 보내지 못했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  const canContinue =
    !isLoading &&
    (mode === 'signup'
      ? name.trim().length > 0 && email.trim().length > 0
      : email.trim().length > 0 && (smsMode ? code.length === 6 : password.length > 0))

  return (
    <div className={containerStyle}>
      <div className={loginBoxStyle}>
        {!linkToken && <Text variant="bodyLg" color="gray500">{error ?? '로그인 확인 중...'}</Text>}
        {linkToken && (
          <form className={formStyle} onSubmit={complete}>
            <Text variant="headingMd" color="gray700">계정을 어떻게 쓸까요?</Text>
            <Button variant={mode === 'signup' ? 'primary' : 'outlined'} size="md" shape="capsule" type="button" onClick={() => chooseMode('signup')}>
              새로 가입
            </Button>
            <Button variant={mode === 'connect' ? 'primary' : 'outlined'} size="md" shape="capsule" type="button" onClick={() => chooseMode('connect')}>
              기존 계정 연결
            </Button>
            {mode === 'signup' && (
              <Input placeholder="이름" shape="capsule" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <Input
              placeholder={mode === 'connect' ? '가입한 이메일' : '이메일'}
              shape="capsule"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setCodeSent(false)
                setCode('')
              }}
              type="email"
            />
            {mode === 'connect' && !smsMode && (
              <>
                <Input placeholder="비밀번호" shape="capsule" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                <Button variant="secondary" size="md" shape="capsule" type="button" onClick={() => { setSmsMode(true); setPassword('') }}>
                  비밀번호 대신 문자 인증
                </Button>
              </>
            )}
            {mode === 'connect' && smsMode && (
              <>
                <Input
                  placeholder="전화번호 (010-0000-0000)"
                  shape="capsule"
                  value={phone}
                  onChange={(e) => {
                    setPhone(formatPhoneInput(e.target.value))
                    setCodeSent(false)
                    setCode('')
                  }}
                  type="tel"
                  inputMode="tel"
                />
                <Button variant="secondary" size="md" shape="capsule" type="button" disabled={!email.trim() || !normalizedPhone || isLoading} onClick={sendLinkCode}>
                  {isLoading && !codeSent ? '보내는 중...' : '인증번호 받기'}
                </Button>
                {codeSent && (
                  <Input placeholder="인증번호 6자리" shape="capsule" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" />
                )}
                <Button variant="outlined" size="md" shape="capsule" type="button" onClick={() => { setSmsMode(false); setPhone(''); setCode(''); setCodeSent(false) }}>
                  비밀번호로 연결
                </Button>
              </>
            )}
            <Button variant="primary" size="lg" shape="capsule" fullWidth type="submit" className={submitButtonStyle} disabled={!canContinue}>
              {isLoading ? '확인 중...' : '계속'}
            </Button>
            {error && (
              <div className={noticeStyle}>
                <Text variant="bodyMd" color="error500">{error}</Text>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
