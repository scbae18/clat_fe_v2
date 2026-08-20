import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  width: '100%',
  padding: '16px 20px',
  border: 'none',
  borderRadius: '16px',
  backgroundColor: colors.gray50,
  fontFamily: 'Pretendard, sans-serif',
  color: colors.gray900,
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.15s',
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary50,
    },
    '&:focus-visible': {
      outline: `2px solid ${colors.primary500}`,
      outlineOffset: '2px',
    },
  },
})

export const dateChip = style({
  flexShrink: 0,
})

export const rowBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
  flex: 1,
})

export const rowTitle = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const rowSubtitle = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const chevron = style({
  flexShrink: 0,
  display: 'flex',
  color: colors.gray300,
})

export const empty = style({
  borderRadius: '20px',
  backgroundColor: colors.gray50,
  padding: '28px 24px',
})

export const loading = style({
  ...fontStyles.bodyMd,
  color: colors.gray500,
  letterSpacing: '-0.03em',
})
