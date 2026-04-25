import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'

export const badgeRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    borderRadius: '999px',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    whiteSpace: 'nowrap',
  },
  variants: {
    level: {
      HIGH: {
        backgroundColor: colors.error50,
        color: colors.error600,
      },
      MEDIUM: {
        backgroundColor: colors.warning50,
        color: '#A35908',
      },
      LOW: {
        backgroundColor: colors.success50,
        color: '#0E7553',
      },
      NEW: {
        backgroundColor: colors.primary50,
        color: colors.primary500,
      },
    },
    size: {
      sm: { fontSize: '11px', padding: '2px 8px' },
      md: { fontSize: '12px', padding: '4px 10px' },
      lg: { fontSize: '14px', padding: '6px 12px' },
    },
  },
  defaultVariants: { level: 'LOW', size: 'md' },
})

export const dot = recipe({
  base: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  variants: {
    level: {
      HIGH: { backgroundColor: colors.error500 },
      MEDIUM: { backgroundColor: colors.warning500 },
      LOW: { backgroundColor: colors.success500 },
      NEW: { backgroundColor: colors.primary400 },
    },
  },
})
