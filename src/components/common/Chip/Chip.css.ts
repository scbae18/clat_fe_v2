import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const chipRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: fontStyles.labelSm.fontSize,
    fontWeight: fontStyles.labelSm.fontWeight,
    lineHeight: '140%',
    letterSpacing: '-0.03em',
  },
  variants: {
    variant: {
      default: {
        backgroundColor: colors.gray50,
        color: colors.gray500,
      },
      active: {
        backgroundColor: colors.primary50,
        color: colors.primary500,
      },
      ended: {
        backgroundColor: colors.error50,
        color: colors.error500,
      },
      done: {
        backgroundColor: colors.success50,
        color: colors.success500,
      },
      inProgress: {
        backgroundColor: colors.warning50,
        color: colors.warning500,
      }
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})