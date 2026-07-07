import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { baseCardStyleRule } from '@/styles/tokens/card'
import { truncateRules } from '@/styles/tokens/textOverflow'

export const cardStyle = style({
  ...baseCardStyleRule,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const deleteButtonStyle = style({
  position: 'absolute',
  top: '16px',
  right: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  padding: 0,
  border: 'none',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  color: colors.gray500,
  cursor: 'pointer',
  zIndex: 1,
  selectors: {
    '&:hover': {
      backgroundColor: colors.gray50,
      color: colors.gray700,
    },
  },
})

export const chipGroupStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  minWidth: 0,
})

export const cardTitleStyle = style([
  {
    fontSize: fontStyles.headingLg.fontSize,
    fontWeight: fontStyles.headingLg.fontWeight,
    letterSpacing: '-0.03em',
    lineHeight: '140%',
    color: colors.gray900,
    minWidth: 0,
  },
  truncateRules,
])

export const progressWrapperStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '4px',
})

export const progressLabelStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const progressTrackStyle = style({
  width: '100%',
  height: '16px',
  backgroundColor: colors.primary50,
  borderRadius: '999px',
  overflow: 'hidden',
})

export const progressBarStyle = style({
  height: '100%',
  backgroundColor: colors.primary500,
  borderRadius: '999px',
  transition: 'width 0.3s',
})
