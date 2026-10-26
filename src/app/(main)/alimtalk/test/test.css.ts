import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(280px, 420px) minmax(0, 1fr)',
  gap: '16px',
  alignItems: 'start',
  '@media': {
    [media.tablet]: {
      gridTemplateColumns: '1fr',
    },
  },
})

export const stack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const card = style({
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '16px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const fieldHead = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '6px',
})

export const fieldLabel = style({
  margin: 0,
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: 600,
  color: colors.gray900,
  letterSpacing: '-0.03em',
})

export const fieldType = style({
  margin: 0,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  color: colors.gray500,
  letterSpacing: '-0.03em',
})

export const noticeRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
})

export const noticeChip = style({
  border: `1px solid ${colors.gray100}`,
  backgroundColor: colors.white,
  color: colors.gray700,
  borderRadius: '999px',
  padding: '8px 12px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  fontFamily: 'inherit',
})

export const noticeChipActive = style({
  borderColor: colors.primary500,
  backgroundColor: colors.primary50,
  color: colors.primary600,
})
