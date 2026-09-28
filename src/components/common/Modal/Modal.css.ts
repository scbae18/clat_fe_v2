import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { zIndex } from '@/styles/tokens/zIndex'
import { media } from '@/styles/tokens/breakpoints'

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
  zIndex: zIndex.modal,
  '@media': {
    [media.phone]: {
      alignItems: 'flex-end',
    },
  },
})

export const modalRecipe = recipe({
  base: {
    backgroundColor: colors.white,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
    overflow: 'hidden',
    '@media': {
      [media.phone]: {
        maxHeight: '92dvh',
      },
    },
  },
  variants: {
    size: {
      sm: {
        width: '420px',
        maxWidth: 'calc(100vw - 32px)',
        borderRadius: '16px',
        padding: '24px',
        '@media': {
          [media.phone]: {
            width: '100%',
            maxWidth: '100%',
            borderRadius: '20px 20px 0 0',
            padding: '20px 16px calc(16px + env(safe-area-inset-bottom, 0px))',
          },
        },
      },
      md: {
        width: '640px',
        maxWidth: 'calc(100vw - 32px)',
        borderRadius: '24px',
        padding: '48px',
        '@media': {
          [media.phone]: {
            width: '100%',
            maxWidth: '100%',
            padding: '20px 16px calc(16px + env(safe-area-inset-bottom, 0px))',
            borderRadius: '20px 20px 0 0',
          },
        },
      },
      lg: {
        width: '960px',
        maxWidth: 'calc(100vw - 32px)',
        borderRadius: '24px',
        padding: '32px',
        '@media': {
          [media.phone]: {
            width: '100%',
            maxWidth: '100%',
            padding: '20px 16px calc(16px + env(safe-area-inset-bottom, 0px))',
            borderRadius: '20px 20px 0 0',
          },
        },
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