import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const wrap = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  borderBottom: `1px solid ${colors.gray75}`,
  marginBottom: '32px',
})

export const tab = style({
  position: 'relative',
  padding: '12px 16px',
  fontSize: '15px',
  fontWeight: 600,
  color: colors.gray500,
  cursor: 'pointer',
  textDecoration: 'none',
  letterSpacing: '-0.02em',
  transition: 'color 0.15s',
  selectors: {
    '&:hover': { color: colors.gray700 },
  },
})

export const tabActive = style({
  color: colors.primary500,
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '8px',
      right: '8px',
      bottom: '-1px',
      height: '2px',
      backgroundColor: colors.primary500,
      borderRadius: '2px',
    },
    '&:hover': { color: colors.primary500 },
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
