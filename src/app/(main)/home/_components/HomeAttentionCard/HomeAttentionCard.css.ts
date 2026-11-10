import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

export const split = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: '16px',
  alignItems: 'start',
  '@media': {
    [media.phone]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
})

export const card = style({
  minWidth: 0,
  background: colors.white,
  border: `1px solid ${colors.gray75}`,
  borderRadius: '20px',
  padding: '8px',
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '12px 12px 8px',
})

export const title = style({
  ...fontStyles.headingSm,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  margin: 0,
})

export const count = style({
  ...fontStyles.titleSm,
  minWidth: '28px',
  height: '28px',
  padding: '0 8px',
  borderRadius: '999px',
  background: colors.primary50,
  color: colors.primary600,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const row = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '10px 12px',
  borderRadius: '14px',
  textDecoration: 'none',
  color: 'inherit',
  ':hover': {
    background: colors.gray50,
  },
  ':focus-visible': {
    outline: `2px solid ${colors.primary500}`,
    outlineOffset: '2px',
  },
})

export const avatar = style({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: colors.primary500,
  color: colors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  ...fontStyles.titleMd,
  letterSpacing: '-0.03em',
})

export const body = style({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  paddingTop: '2px',
})

export const nameRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  minWidth: 0,
})

export const name = style({
  ...fontStyles.titleMd,
  color: colors.gray900,
  letterSpacing: '-0.03em',
})

export const today = style({
  ...fontStyles.labelSm,
  flexShrink: 0,
  padding: '1px 6px',
  borderRadius: '999px',
  background: colors.primary50,
  color: colors.primary600,
  letterSpacing: '-0.02em',
})

export const className = style({
  ...fontStyles.labelSm,
  color: colors.gray600,
  letterSpacing: '-0.02em',
})

export const reason = style({
  ...fontStyles.bodyMd,
  color: colors.gray700,
  letterSpacing: '-0.02em',
  lineHeight: 1.45,
})

export const reasonClass = style({
  ...fontStyles.titleSm,
  color: colors.gray600,
  marginRight: '6px',
})

export const empty = style({
  ...fontStyles.bodyMd,
  color: colors.gray600,
  margin: 0,
  padding: '8px 12px 16px',
})

export const more = style({
  width: '100%',
  marginTop: '4px',
  height: '40px',
  border: 'none',
  borderRadius: '12px',
  background: colors.gray50,
  color: colors.primary600,
  ...fontStyles.titleSm,
  letterSpacing: '-0.02em',
  cursor: 'pointer',
  ':hover': {
    background: colors.primary50,
  },
})
