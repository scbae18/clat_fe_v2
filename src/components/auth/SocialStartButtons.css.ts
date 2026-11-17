import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const socialRowStyle = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
  width: '100%',
})

export const socialIconButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  borderRadius: '999px',
  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  ':focus-visible': {
    outline: `2px solid ${colors.primary500}`,
    outlineOffset: '3px',
  },
})

export const socialIconStyle = style({
  display: 'block',
  height: '48px',
  width: 'auto',
})
