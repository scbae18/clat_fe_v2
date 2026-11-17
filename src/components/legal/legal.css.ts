import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const pageStyle = style({
  minHeight: '100dvh',
  width: '100%',
  backgroundColor: colors.background,
  color: colors.gray900,
})

export const innerStyle = style({
  maxWidth: '760px',
  margin: '0 auto',
  padding: '32px 20px 64px',
})

export const backStyle = style({
  color: colors.primary500,
  textDecoration: 'none',
  fontSize: '14px',
})

export const titleStyle = style({
  margin: '16px 0',
  fontSize: '28px',
  color: colors.gray900,
})

export const bodyStyle = style({
  whiteSpace: 'pre-wrap',
  fontFamily: 'inherit',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: 0,
})
