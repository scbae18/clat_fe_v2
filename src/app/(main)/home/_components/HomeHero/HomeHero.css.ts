import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const banner = style({
  background: `radial-gradient(circle at 100% 50%, ${colors.primary400} 0%, transparent 70%), ${colors.primary100}`,
  borderRadius: '20px',
  padding: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',
  position: 'relative',
  minHeight: '200px',
  gap: '24px',
})

export const bannerContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  zIndex: 1,
  flex: 1,
  minWidth: 0,
})

export const logoWrap = style({
  overflow: 'hidden',
  height: '24px',
  width: '120px',
})

export const logoSvg = style({
  height: '16px',
  width: 'auto',
  marginLeft: '3px',
})

export const greetingSm = style({
  ...fontStyles.titleMd,
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const greetingLg = style({
  fontSize: '32px',
  fontWeight: 800,
  letterSpacing: '-0.05em',
  color: colors.gray900,
  lineHeight: 1.2,
})

export const greetingHighlight = style({
  color: colors.primary500,
})

export const statsRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
})

export const statChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  borderRadius: '100px',
  background: colors.white,
  border: `1px solid ${colors.gray75}`,
  color: colors.gray700,
  cursor: 'pointer',
  transition: 'border-color 0.15s, transform 0.15s',
  selectors: {
    '&:hover': {
      borderColor: colors.primary300,
      transform: 'translateY(-1px)',
    },
    '&:focus-visible': {
      outline: `2px solid ${colors.primary300}`,
      outlineOffset: '2px',
    },
  },
})

export const statChipAccent = style({
  borderColor: colors.warning200,
  background: colors.warning50,
})

export const statChipDanger = style({
  borderColor: colors.error200,
  background: colors.error50,
})

export const statChipPrimary = style({
  borderColor: colors.primary200,
  background: colors.primary50,
})

export const statLabel = style({
  ...fontStyles.labelSm,
  letterSpacing: '-0.03em',
  color: colors.gray600,
})

export const statValue = style({
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const statValueLoading = style({
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.gray300,
})

export const illustWrap = style({
  position: 'absolute',
  right: '-90px',
  bottom: '-90px',
  display: 'flex',
  pointerEvents: 'none',
})
