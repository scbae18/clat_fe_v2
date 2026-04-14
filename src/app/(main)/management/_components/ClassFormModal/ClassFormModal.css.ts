import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const fieldGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '36px',
  marginBottom: '48px',
})

export const fieldStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const dayGroupStyle = style({
  display: 'flex',
  gap: '8px',
})

export const dayButtonRecipe = recipe({
  base: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: fontStyles.bodyMd.fontSize,
    fontWeight: fontStyles.bodyMd.fontWeight,
    letterSpacing: '-0.03em',
    lineHeight: '140%',
    transition: 'background-color 0.15s, border-color 0.15s, color 0.15s',
  },
  variants: {
    selected: {
      true: {
        backgroundColor: colors.primary100,
        border: `1px solid ${colors.primary500}`,
        color: colors.primary500,
      },
      false: {
        backgroundColor: colors.white,
        border: `1px solid ${colors.gray50}`,
        color: colors.gray700,
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
})

export const actionsStyle = style({
  display: 'flex',
  gap: '8px',
})