'use client'

import { colors } from '@/styles/tokens/colors'

export function IconBuilding() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4 17V8l6-3.5L16 8v9"
        stroke={colors.gray500}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 17v-5h4v5" stroke={colors.gray500} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

export function IconBook() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4 4.5A2.5 2.5 0 016.5 2H14v16H6.5A2.5 2.5 0 004 15.5v-11z"
        stroke={colors.gray500}
        strokeWidth="1.4"
      />
      <path d="M14 4h1.5A1.5 1.5 0 0117 5.5V17" stroke={colors.gray500} strokeWidth="1.4" />
    </svg>
  )
}

export function IconSchool() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3 8l7-4 7 4-7 4-7-4z"
        stroke={colors.gray500}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M5 9.5V14l5 2.5L15 14V9.5" stroke={colors.gray500} strokeWidth="1.4" />
    </svg>
  )
}

export function IconPhone() {
  return <span aria-hidden>☎︎</span>
}

export function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2l1.2 4.2L15 7l-3.8 1.8L10 13l-1.2-4.2L5 7l3.8-1.8L10 2z"
        fill={colors.primary400}
        opacity={0.95}
      />
    </svg>
  )
}
