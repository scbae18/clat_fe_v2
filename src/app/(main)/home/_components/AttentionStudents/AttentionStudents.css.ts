import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
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

export const titleSub = style({
  ...fontStyles.bodyMd,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const linkButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px',
  padding: '6px 10px',
  border: 'none',
  borderRadius: '100px',
  background: 'transparent',
  color: colors.primary500,
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  transition: 'background 0.15s',
  selectors: {
    '&:hover': {
      background: colors.primary50,
    },
  },
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '12px',
})

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '16px',
  borderRadius: '14px',
  background: colors.white,
  border: `1px solid ${colors.gray75}`,
  cursor: 'pointer',
  transition: 'border-color 0.15s, transform 0.15s',
  selectors: {
    '&:hover': {
      borderColor: colors.error200,
      transform: 'translateY(-1px)',
    },
  },
})

export const cardTop = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
})

export const avatar = style({
  flexShrink: 0,
  width: '36px',
  height: '36px',
  borderRadius: '100px',
  background: colors.primary100,
  color: colors.primary500,
  ...fontStyles.titleMd,
  letterSpacing: '-0.03em',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const nameWrap = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
})

export const name = style({
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const className = style({
  ...fontStyles.labelSm,
  letterSpacing: '-0.03em',
  color: colors.gray500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const incompleteRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 12px',
  borderRadius: '10px',
  background: colors.error50,
})

export const incompleteIcon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})

export const incompleteText = style({
  ...fontStyles.labelSm,
  letterSpacing: '-0.03em',
  color: colors.error600,
})

export const incompleteCount = style({
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.error600,
})

export const completionRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const completionLabel = style({
  ...fontStyles.labelSm,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const completionValue = style({
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const emptyCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '40px 20px',
  borderRadius: '16px',
  background: colors.success50,
  border: `1px dashed ${colors.success200}`,
  textAlign: 'center',
})

export const emptyTitle = style({
  ...fontStyles.titleMd,
  letterSpacing: '-0.03em',
  color: colors.success500,
})

export const emptyDesc = style({
  ...fontStyles.bodyMd,
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const skeletonCard = style({
  height: '140px',
  borderRadius: '14px',
  background: colors.gray50,
})
