import type { StyleRule } from '@vanilla-extract/css'

export const cardGridBase: StyleRule = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
}

export const cardGridResponsive: StyleRule = {
  ...cardGridBase,
  '@media': {
    'screen and (max-width: 1279px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
    'screen and (max-width: 767px)': { gridTemplateColumns: 'repeat(1, 1fr)' },
  },
}
