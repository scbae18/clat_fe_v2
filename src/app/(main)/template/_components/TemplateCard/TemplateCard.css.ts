import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { interactiveCardStyleRule } from '@/styles/tokens/card'

export const cardStyle = style({
  ...interactiveCardStyleRule,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const cardHeaderStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  marginBottom: '8px',
})

export const iconButtonStyle = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  color: colors.gray100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.2s',
  selectors: {
    '&:hover': {
      color: colors.gray300,
    },
  },
})

export const classCountStyle = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  color: colors.gray500,
})

export const countHighlightStyle = style({
  color: colors.primary500,
  fontWeight: fontStyles.titleSm.fontWeight,
})

export const chipGroupStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
})