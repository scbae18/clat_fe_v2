'use client'

import { socialIconButtonStyle, socialIconStyle, socialRowStyle } from './SocialStartButtons.css'

const GOOGLE_ICON = '/images/google_login_light.png'

type Props = {
  disabled?: boolean
  kakaoLabel?: string
  googleLabel?: string
  onKakao: () => void
  onGoogle: () => void
}

export default function SocialStartButtons({
  disabled = false,
  kakaoLabel = '카카오로 시작',
  googleLabel = '구글로 시작',
  onKakao,
  onGoogle,
}: Props) {
  return (
    <div className={socialRowStyle}>
      <button
        type="button"
        className={socialIconButtonStyle}
        aria-label={kakaoLabel}
        disabled={disabled}
        onClick={onKakao}
      >
        <img src="/images/kakao_login_light.png" alt="" className={socialIconStyle} />
      </button>
      <button
        type="button"
        className={socialIconButtonStyle}
        aria-label={googleLabel}
        disabled={disabled}
        onClick={onGoogle}
      >
        <img src={GOOGLE_ICON} alt="" className={socialIconStyle} />
      </button>
    </div>
  )
}
