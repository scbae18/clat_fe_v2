import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const listItemRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.15s',
  selectors: {
    '&:hover': {
      backgroundColor: colors.gray50,
    },
  },
})

export const listItemRowSelectedStyle = style({
  backgroundColor: colors.primary50,
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary100,
    },
  },
})
