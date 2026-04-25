import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  padding: '24px',
  borderRadius: '20px',
  background: `linear-gradient(135deg, ${colors.primary50} 0%, ${colors.white} 100%)`,
  border: `1px solid ${colors.primary100}`,
  height: '100%',
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
})

export const titleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const titleText = style({
  ...fontStyles.headingSm,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const newBadge = style({
  ...fontStyles.labelSm,
  fontWeight: '700',
  letterSpacing: '-0.03em',
  padding: '2px 8px',
  borderRadius: '100px',
  background: colors.primary500,
  color: colors.white,
})

export const subText = style({
  ...fontStyles.bodyMd,
  letterSpacing: '-0.03em',
  color: colors.gray600,
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const item = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '12px',
  borderRadius: '12px',
  background: colors.white,
  border: `1px solid ${colors.primary100}`,
  cursor: 'pointer',
  transition: 'border-color 0.15s, transform 0.15s',
  selectors: {
    '&:hover': {
      borderColor: colors.primary300,
      transform: 'translateX(2px)',
    },
  },
})

export const levelBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  height: '20px',
  padding: '0 8px',
  borderRadius: '100px',
  ...fontStyles.labelSm,
  fontWeight: '700',
  letterSpacing: '-0.03em',
})

export const levelHigh = style({
  background: colors.error500,
  color: colors.white,
})

export const levelMedium = style({
  background: colors.warning500,
  color: colors.white,
})

export const levelLow = style({
  background: colors.success500,
  color: colors.white,
})

export const itemBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: 1,
  minWidth: 0,
})

export const itemHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
})

export const studentName = style({
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const className = style({
  ...fontStyles.labelSm,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const oneLiner = style({
  ...fontStyles.bodyMd,
  letterSpacing: '-0.03em',
  color: colors.gray700,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

export const ctaWrap = style({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '4px',
})

export const cta = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '8px 14px',
  borderRadius: '100px',
  border: 'none',
  background: colors.primary500,
  color: colors.white,
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  transition: 'background 0.15s',
  selectors: {
    '&:hover': {
      background: colors.primary600,
    },
  },
})
