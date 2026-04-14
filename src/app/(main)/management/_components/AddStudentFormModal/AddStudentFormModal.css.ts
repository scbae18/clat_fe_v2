import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const fieldGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '36px',
  marginBottom: '40px',
})

export const fieldStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const labelStyle = style({
  fontSize: fontStyles.headingSm.fontSize,
  fontWeight: fontStyles.headingSm.fontWeight,
  color: colors.gray900,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const classChipGroupStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
})

export const classChipRecipe = recipe({
  base: {
    padding: '8px 16px',
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
        backgroundColor: colors.primary50,
        border: `1px solid ${colors.primary500}`,
        color: colors.primary500,
        selector: {
          '&hover': {
            backgroundColor: colors.primary100,
          },
        },
      },
      false: {
        backgroundColor: colors.white,
        border: `1px solid ${colors.gray100}`,
        color: colors.gray700,
        selectors: {
          '&:hover': {
            backgroundColor: colors.gray50,
            borderColor: colors.gray200,
          },
        },
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
