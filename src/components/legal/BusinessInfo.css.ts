import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'

export const block = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontStyle: 'normal',
    fontSize: '13px',
    lineHeight: 1.65,
    wordBreak: 'keep-all',
  },
  variants: {
    tone: {
      light: { color: colors.gray600 },
      dark: { color: colors.gray300 },
    },
  },
})

export const links = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px 14px',
  marginBottom: '4px',
})

export const link = recipe({
  base: {
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
  },
  variants: {
    tone: {
      light: { color: colors.primary500 },
      dark: { color: colors.white },
    },
  },
})

export const contact = recipe({
  base: { textDecoration: 'underline', textUnderlineOffset: '2px' },
  variants: {
    tone: {
      light: { color: colors.primary500 },
      dark: { color: colors.gray100 },
    },
  },
})
