import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const pageRoot = style({
  maxWidth: '1280px',
})

export const pageTitle = style({
  fontFamily: 'Pretendard, sans-serif',
  margin: '0 0 8px',
  fontSize: '28px',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const pageSubtitle = style({
  fontFamily: 'Pretendard, sans-serif',
  margin: '0 0 24px',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.02em',
  color: colors.gray500,
})
