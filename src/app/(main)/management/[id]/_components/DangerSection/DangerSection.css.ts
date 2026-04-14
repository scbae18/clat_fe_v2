import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'

export const sectionRecipe = recipe({
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '16px',
    padding: '24px',
  },
  variants: {
    variant: {
      end: {
        backgroundColor: colors.primary50,
        border: `1px solid ${colors.primary200}`,
      },
      delete: {
        backgroundColor: colors.error50,
        border: `1px solid ${colors.error200}`,
      },
    },
  },
})

export const contentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const sectionWrapperStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})