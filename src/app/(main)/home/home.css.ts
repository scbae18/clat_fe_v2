import { style } from '@vanilla-extract/css'

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
})

export const row = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
  gap: '20px',
  '@media': {
    'screen and (max-width: 1100px)': {
      gridTemplateColumns: '1fr',
    },
  },
})
