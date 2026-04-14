import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const dateCardRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    aspectRatio: '1 / 1',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.15s, border-color 0.15s',
    border: `1px solid ${colors.gray100}`,
    backgroundColor: colors.white,
    selectors: {
      '&:hover': {
        backgroundColor: colors.gray50,
      },
    },
  },
  variants: {
    selected: {
      true: {
        backgroundColor: colors.primary50,
        border: `1px solid ${colors.primary500}`,
        '&:hover': {
          backgroundColor: colors.primary50,
        },
      },
      false: {},
    },
  },
})

export const dayStyle = style({
  fontSize: fontStyles.headingMd.fontSize,
  fontWeight: '500',
  color: colors.gray300,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const dateStyle = style({
  fontSize: fontStyles.display.fontSize,
  fontWeight: '500',
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const dateDefaultStyle = style({
  color: colors.gray300,
})

export const dateSelectedStyle = style({
  color: colors.primary500,
  fontWeight: '600',
})

export const statusStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  letterSpacing: '-0.03em',
})
