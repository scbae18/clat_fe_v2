import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'

export const overlayStyle = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
})

export const modalRecipe = recipe({
  base: {
    backgroundColor: colors.white,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
    overflow: 'hidden',
  },
  variants: {
    size: {
      sm: {
        width: '420px',
        maxWidth: 'calc(100vw - 32px)',
        borderRadius: '16px',
        padding: '24px',
      },
      md: {
        width: '640px',
        maxWidth: 'calc(100vw - 32px)',
        borderRadius: '24px',
        padding: '48px',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

/** Modal body: scrolls when content exceeds viewport; keeps footer/actions reachable */
export const modalBodyStyle = style({
  flex: '1 1 auto',
  minHeight: 0,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
})