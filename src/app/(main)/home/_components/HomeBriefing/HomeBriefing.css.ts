import { style } from '@vanilla-extract/css'
import { baseCardStyleRule } from '@/styles/tokens/card'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const card = style({
  ...baseCardStyleRule,
  cursor: 'default',
  backgroundColor: colors.primary50,
  backgroundImage: `radial-gradient(ellipse at 0% 0%, ${colors.primary200} 0%, ${colors.primary50} 46%, ${colors.white} 78%)`,
  borderColor: colors.primary100,
  boxShadow: `0 8px 28px color-mix(in srgb, ${colors.primary500} 14%, transparent)`,
})

export const greetingRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
})

export const spark = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: colors.primary500,
})

export const greetingText = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
})

export const headingReset = style({
  margin: 0,
})

export const summary = style({
  margin: '8px 0 0',
  wordBreak: 'break-word',
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  margin: '16px 0 0',
  padding: '16px 0 0',
  listStyle: 'none',
  borderTop: `1px solid ${colors.gray100}`,
})

export const row = style({
  cursor: 'pointer',
})

export const mark = style({
  display: 'inline-flex',
  flexShrink: 0,
  color: colors.gray300,
})

export const title = style({
  flex: 1,
  minWidth: 0,
  wordBreak: 'break-word',
})

export const meta = style({
  flexShrink: 0,
  marginLeft: 'auto',
})

export const note = style({
  margin: '12px 0 0',
})

export const action = style({
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  padding: 0,
  cursor: 'pointer',
  color: colors.primary600,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  ':hover': {
    color: colors.primary700,
  },
  ':focus-visible': {
    outline: `2px solid ${colors.primary500}`,
    outlineOffset: '2px',
  },
})
