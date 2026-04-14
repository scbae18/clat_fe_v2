import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { interactiveCardStyleRule } from '@/styles/tokens/card'

export const cardStyle = style({
  ...interactiveCardStyleRule,
  display: 'flex',
  flexDirection: 'column',
})

export const headerStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px',
})

export const chipGroupStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
})

export const dateStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray300,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const infoGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginTop: '12px',
})

export const infoRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray500,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})