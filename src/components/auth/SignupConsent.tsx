'use client'

import Link from 'next/link'
import { consentLinkStyle, consentListStyle, consentRowStyle } from '@/app/(auth)/login/login.css'

type SignupConsentProps = {
  terms: boolean
  privacy: boolean
  entrust: boolean
  onTerms: (value: boolean) => void
  onPrivacy: (value: boolean) => void
  onEntrust: (value: boolean) => void
}

export function signupConsentReady(value: Pick<SignupConsentProps, 'terms' | 'privacy' | 'entrust'>) {
  return value.terms && value.privacy && value.entrust
}

export default function SignupConsent({
  terms,
  privacy,
  entrust,
  onTerms,
  onPrivacy,
  onEntrust,
}: SignupConsentProps) {
  return (
    <div className={consentListStyle}>
      <label className={consentRowStyle}>
        <input type="checkbox" checked={terms} onChange={(event) => onTerms(event.target.checked)} />
        <span>
          이용약관에 동의합니다. (필수){' '}
          <Link href="/terms" target="_blank" className={consentLinkStyle}>자세히 보기</Link>
        </span>
      </label>
      <label className={consentRowStyle}>
        <input type="checkbox" checked={privacy} onChange={(event) => onPrivacy(event.target.checked)} />
        <span>
          개인정보 처리방침을 확인했습니다. (필수){' '}
          <Link href="/privacy" target="_blank" className={consentLinkStyle}>자세히 보기</Link>
        </span>
      </label>
      <label className={consentRowStyle}>
        <input type="checkbox" checked={entrust} onChange={(event) => onEntrust(event.target.checked)} />
        <span>
          학생·학부모 정보의 처리 위탁과 재위탁에 동의합니다. (필수){' '}
          <Link href="/privacy#entrust" target="_blank" className={consentLinkStyle}>자세히 보기</Link>
        </span>
      </label>
    </div>
  )
}
