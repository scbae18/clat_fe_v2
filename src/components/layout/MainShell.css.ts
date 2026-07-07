import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const mainStyle = style({
  flex: 1,
  minHeight: '100vh',
  padding: '48px 48px',
  backgroundColor: colors.background,
  transition: 'margin-left 0.2s ease',
})
