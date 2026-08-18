import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const frameText = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: 1.6,
  color: colors.gray500,
  whiteSpace: 'pre-wrap',
  margin: 0,
})

export const frameVar = style({
  color: colors.primary400,
  fontWeight: 600,
})

export const bodyText = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: 1.6,
  color: colors.gray900,
  whiteSpace: 'pre-wrap',
  margin: '12px 0',
})

export const cta = style({
  marginTop: '16px',
  backgroundColor: colors.gray50,
  borderRadius: '8px',
  padding: '12px',
  textAlign: 'center',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  color: colors.gray600,
})
