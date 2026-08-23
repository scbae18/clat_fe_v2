import { style } from '@vanilla-extract/css'
import { cardGridResponsive } from '@/styles/tokens/grid'
import { media } from '@/styles/tokens/breakpoints'

export const gridStyle = style({
  ...cardGridResponsive,
  marginTop: '60px',
  '@media': {
    [media.tablet]: { gridTemplateColumns: 'repeat(2, 1fr)' },
    [media.phone]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
      marginTop: '16px',
    },
  },
})
