'use client'

import { colors } from '@/styles/tokens/colors'

export function SuccessCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="40" cy="40" r="40" fill={colors.primary500} />
      <path
        d="M23 41.5 L34.5 53 L57 28"
        stroke={colors.white}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ClosedWarningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="40" cy="40" r="40" fill={colors.gray75} />
      <path
        d="M40 24v28M40 56v2"
        stroke={colors.gray700}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}
