import type { StyleRule } from '@vanilla-extract/css'
import { colors } from './colors'

export const baseCardStyleRule: StyleRule = {
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '16px',
  padding: '24px',
  cursor: 'pointer',
}

export const interactiveCardStyleRule: StyleRule = {
  ...baseCardStyleRule,
  transition: 'background-color 0.2s',
  selectors: {
    '&:hover': { backgroundColor: colors.primary50 },
  },
}
