import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
})

export const titleGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const titleText = style({
  ...fontStyles.headingMd,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '12px',
})

export const card = style({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  padding: '20px',
  borderRadius: '16px',
  background: colors.white,
  border: `1px solid ${colors.gray75}`,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s',
  selectors: {
    '&:hover': {
      borderColor: colors.primary300,
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 14px rgba(59, 81, 204, 0.08)',
    },
  },
})

export const iconWrap = style({
  flexShrink: 0,
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: colors.primary50,
  color: colors.primary500,
})

export const iconWrapSecondary = style({
  background: colors.success50,
  color: colors.success500,
})

export const iconWrapAccent = style({
  background: colors.warning50,
  color: colors.warning500,
})

export const iconWrapDanger = style({
  background: colors.error50,
  color: colors.error500,
})

export const textWrap = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: 1,
  minWidth: 0,
})

export const cardTitle = style({
  ...fontStyles.titleMd,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const cardDesc = style({
  ...fontStyles.labelSm,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})
