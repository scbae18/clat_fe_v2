import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100%',
})

export const iconWrapStyle = style({
  width: '60px',
  height: '60px',
  marginBottom: '20px',
})

export const titleStyle = style({
  margin: 0,
  marginBottom: '32px',
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const summaryRowStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '8px',
  marginBottom: '40px',
})

export const summaryCardStyle = style({
  backgroundColor: colors.gray50,
  borderRadius: '12px',
  padding: '16px 8px 24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const summaryInnerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
})

export const summaryLabelPrimaryStyle = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  color: colors.primary500,
})

export const summaryLabelMutedStyle = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  color: colors.gray700,
})

export const summaryValuePrimaryStyle = style({
  margin: 0,
  fontSize: '40px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.primary500,
})

export const summaryValueMutedStyle = style({
  margin: 0,
  fontSize: '40px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const ctaBtnStyle = style({
  width: '100%',
  border: 'none',
  borderRadius: '12px',
  padding: '16px 12px',
  backgroundColor: colors.primary500,
  color: colors.white,
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  cursor: 'pointer',
})
