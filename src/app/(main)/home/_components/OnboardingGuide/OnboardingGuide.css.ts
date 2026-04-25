import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const wrapper = style({
  borderRadius: '20px',
  background: colors.gray50,
  overflow: 'hidden',
})

export const summary = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '20px 24px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
  transition: 'background 0.15s',
  selectors: {
    '&:hover': {
      background: colors.gray75,
    },
  },
})

export const summaryLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
})

export const summaryTitle = style({
  ...fontStyles.titleMd,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const summarySub = style({
  ...fontStyles.bodyMd,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const chevronWrap = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.gray500,
  transition: 'transform 0.2s',
})

export const chevronOpen = style({
  transform: 'rotate(180deg)',
})

export const content = style({
  padding: '0 24px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const tabList = style({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
})

export const tabButton = style({
  padding: '8px 16px',
  borderRadius: '100px',
  border: 'none',
  background: colors.white,
  color: colors.gray600,
  ...fontStyles.labelSm,
  fontWeight: '600',
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  transition: 'all 0.15s',
})

export const tabButtonActive = style({
  background: colors.primary500,
  color: colors.white,
})

export const stepCard = style({
  background: colors.white,
  borderRadius: '16px',
  padding: '24px 28px',
  border: `1px solid ${colors.gray75}`,
})

export const stepCardTitle = style({
  ...fontStyles.headingSm,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  marginBottom: '14px',
})

export const stepItemList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
})

export const stepItem = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
})

export const stepNumber = style({
  flexShrink: 0,
  padding: '0 12px',
  height: '20px',
  borderRadius: '100px',
  background: colors.gray75,
  color: colors.gray500,
  ...fontStyles.labelSm,
  fontWeight: '600',
  letterSpacing: '-0.03em',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '2px',
  whiteSpace: 'nowrap',
})

export const stepItemText = style({
  ...fontStyles.bodyMd,
  letterSpacing: '-0.03em',
  color: colors.gray700,
  lineHeight: 1.65,
})
