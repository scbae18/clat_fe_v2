import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const pageRoot = style({
  maxWidth: '1280px',
})

export const pageTitle = style({
  margin: '0 0 8px',
  fontSize: '32px',
  fontWeight: 700,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const pageSubtitle = style({
  margin: '0 0 24px',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray500,
  letterSpacing: '-0.02em',
})
