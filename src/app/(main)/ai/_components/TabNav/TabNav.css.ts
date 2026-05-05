import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const wrap = style({
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  borderBottom: `1px solid ${colors.gray100}`,
  paddingBottom: '12px',
  marginBottom: '32px',
})

export const tab = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
  textDecoration: 'none',
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  paddingBottom: '10px',
  marginBottom: '-13px',
  transition: 'color 0.15s',
  selectors: {
    '&:hover': { color: colors.gray700 },
  },
})

export const tabActive = style({
  color: colors.gray900,
  borderBottomColor: colors.primary500,
  selectors: {
    '&:hover': { color: colors.gray900 },
  },
})

export const newDot = style({
  display: 'inline-block',
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: colors.error500,
  marginLeft: '6px',
  verticalAlign: 'top',
})
