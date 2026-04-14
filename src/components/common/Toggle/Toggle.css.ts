import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const trackStyle = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  width: '36px',
  height: '20px',
  borderRadius: '10px',
  backgroundColor: colors.gray300,
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  transition: 'background-color 0.2s',
  flexShrink: 0,
  selectors: {
    '&[data-checked="true"]': {
      backgroundColor: colors.primary500,
    },
    '&[data-checked="true"][data-disabled="true"]': {
      backgroundColor: colors.primary300,
    },
    '&[data-disabled="true"]': {
      backgroundColor: colors.gray200,
      cursor: 'not-allowed',
    },
  },
})

export const thumbStyle = style({
  position: 'absolute',
  left: '2px',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: colors.white,
  transition: 'transform 0.2s',
  selectors: {
    '[data-checked="true"] > &': {
      transform: 'translateX(16px)',
    },
  },
})
