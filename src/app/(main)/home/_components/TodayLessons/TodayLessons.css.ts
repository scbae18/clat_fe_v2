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

export const lessonsCount = style({
  ...fontStyles.headingMd,
  letterSpacing: '-0.03em',
  color: colors.primary500,
})

export const dateNav = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px',
  borderRadius: '100px',
  background: colors.gray50,
})

export const navButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  border: 'none',
  borderRadius: '100px',
  background: 'transparent',
  color: colors.gray600,
  cursor: 'pointer',
  transition: 'background 0.15s',
  selectors: {
    '&:hover': {
      background: colors.white,
    },
  },
})

export const dateLabel = style({
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.gray700,
  padding: '0 8px',
  minWidth: '80px',
  textAlign: 'center',
})

export const todayPill = style({
  ...fontStyles.labelSm,
  letterSpacing: '-0.03em',
  border: 'none',
  borderRadius: '100px',
  padding: '6px 12px',
  background: colors.primary500,
  color: colors.white,
  cursor: 'pointer',
  marginLeft: '4px',
  transition: 'background 0.15s',
  selectors: {
    '&:hover': {
      background: colors.primary600,
    },
    '&:disabled': {
      background: colors.gray100,
      color: colors.gray500,
      cursor: 'default',
    },
  },
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '12px',
})

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '20px',
  borderRadius: '16px',
  background: colors.white,
  border: `1px solid ${colors.gray75}`,
  cursor: 'pointer',
  transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s',
  selectors: {
    '&:hover': {
      borderColor: colors.primary300,
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(59, 81, 204, 0.08)',
    },
  },
})

export const cardHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  flexWrap: 'wrap',
})

export const academyChip = style({
  ...fontStyles.labelSm,
  letterSpacing: '-0.03em',
  padding: '2px 8px',
  borderRadius: '100px',
  background: colors.gray50,
  color: colors.gray600,
})

export const statusChip = style({
  ...fontStyles.labelSm,
  letterSpacing: '-0.03em',
  padding: '2px 8px',
  borderRadius: '100px',
})

export const statusPending = style({
  background: colors.gray50,
  color: colors.gray600,
})

export const statusDraft = style({
  background: colors.warning50,
  color: colors.warning500,
})

export const statusDone = style({
  background: colors.success50,
  color: colors.success500,
})

export const cardTitle = style({
  ...fontStyles.titleMd,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const cardSub = style({
  ...fontStyles.labelSm,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const progressBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
})

export const progressLabel = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const progressLabelLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
})

export const progressLabelKey = style({
  ...fontStyles.labelSm,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const progressLabelValue = style({
  ...fontStyles.labelSm,
  fontWeight: '600',
  letterSpacing: '-0.03em',
  color: colors.primary500,
})

export const progressLabelRight = style({
  ...fontStyles.labelSm,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const progressTrack = style({
  height: '6px',
  borderRadius: '100px',
  background: colors.gray50,
  overflow: 'hidden',
})

export const progressBar = style({
  height: '100%',
  borderRadius: '100px',
  background: colors.primary500,
  transition: 'width 0.3s',
})

export const cardFooter = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '4px',
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.primary500,
})

export const emptyCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '40px 20px',
  borderRadius: '16px',
  background: colors.gray50,
  border: `1px dashed ${colors.gray100}`,
  textAlign: 'center',
})

export const emptyTitle = style({
  ...fontStyles.titleMd,
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const emptyDesc = style({
  ...fontStyles.bodyMd,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const skeletonCard = style({
  height: '160px',
  borderRadius: '16px',
  background: colors.gray50,
})
