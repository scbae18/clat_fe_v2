'use client'

import { useRef, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { auth } from '@/services/auth'
import { useUserStore } from '@/stores/userStore'
import { ACCOUNT_PENDING_MESSAGE } from '@/components/auth/PendingApprovalModal'
import {
  containerStyle,
  loginBoxStyle,
  logoSectionStyle,
  formStyle,
  submitButtonStyle,
  footerLinkStyle,
  footerLinkAnchorStyle,
  socialRowWrapStyle,
  dividerStyle,
  noticeStyle,
  logoMarkStyle,
} from './login.css'
import SocialStartButtons from '@/components/auth/SocialStartButtons'
import Input from '@/components/common/Input/Input'
import Button from '@/components/common/Button/Button'
import Text from '@/components/common/Text/Text'
import Logo from '@/assets/logo/logo-full.svg'
import { apiErrorMessage } from '@/lib/api/http'
import type { OauthProvider } from '@/services/auth'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const passwordRef = useRef<HTMLInputElement>(null)
  const joined = searchParams.get('joined') === '1'
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<OauthProvider | null>(null)
  const [error, setError] = useState<string | null>(null)
  const setUser = useUserStore((s) => s.setUser)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const user = await auth.login({ email, password })
      setUser(user)

      // redirect 파라미터가 상대경로인 경우에만 사용. 랜딩(/)이면 앱 홈으로
      const redirect = searchParams.get('redirect')
      const safeRedirect =
        redirect &&
        redirect.startsWith('/') &&
        !redirect.startsWith('//') &&
        redirect !== '/'
          ? redirect
          : '/home'
      router.push(safeRedirect)
    } catch (err: any) {
      const code = err.response?.data?.error?.code
      const message =
        code === 'ACCOUNT_PENDING'
          ? ACCOUNT_PENDING_MESSAGE
          : (err.response?.data?.error?.message ??
            err.response?.data?.message ??
            '이메일 또는 비밀번호를 확인해주세요.')
      setError(message)
      passwordRef.current?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const startSocial = async (provider: OauthProvider) => {
    setError(null)
    setSocialLoading(provider)
    try {
      const url = await auth.oauthUrl(provider)
      window.location.assign(url)
    } catch (err: unknown) {
      setError(apiErrorMessage(err, '소셜 로그인을 열지 못했어요.'))
      setSocialLoading(null)
    }
  }

  return (
    <div className={containerStyle}>
      <div className={loginBoxStyle}>
        {/* 로고 섹션 */}
        <div className={logoSectionStyle}>
          <Logo className={logoMarkStyle} />
          <Text variant="headingMd" color="gray500">
            학원 강사 행정 자동화 AI 수업 운영 플랫폼
          </Text>
        </div>

        <form className={formStyle} onSubmit={handleLogin}>
          <Input
            placeholder="이메일"
            shape="capsule"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
          />
          <Input
            placeholder="비밀번호"
            shape="capsule"
            ref={passwordRef}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
          />
          <Button
            variant="primary"
            size="lg"
            shape="capsule"
            fullWidth
            type="submit"
            className={submitButtonStyle}
            disabled={!email || !password || isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>

          {joined && !error && (
            <Text variant="bodyMd" color="gray500">
              가입되었습니다. 로그인해 주세요.
            </Text>
          )}
        </form>

        <div className={footerLinkStyle}>
          <Link href="/signup" className={footerLinkAnchorStyle}>
            <Text variant="bodyLg" color="gray300">
              회원가입
            </Text>
          </Link>
          <div className={dividerStyle} />
          <Link href="/find-password" className={footerLinkAnchorStyle}>
            <Text variant="bodyLg" color="gray300">
              비밀번호 찾기
            </Text>
          </Link>
        </div>

        <div className={socialRowWrapStyle}>
          <SocialStartButtons
            disabled={socialLoading != null}
            onKakao={() => startSocial('kakao')}
            onGoogle={() => startSocial('google')}
          />
        </div>

        {error && (
          <div className={noticeStyle}>
            <Text variant="bodyMd" color="error500">
              {error}
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
