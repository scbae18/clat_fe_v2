import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const stackStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const phoneBlockStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
})

export const phoneHelpStyle = style({
  marginLeft: '16px',
})

export const phoneChangeButtonStyle = style({
  alignSelf: 'flex-start',
  marginLeft: '16px',
  padding: 0,
  border: 'none',
  background: 'none',
  color: colors.gray500,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  textDecoration: 'underline',
  cursor: 'pointer',
})
