import type { StyleRule } from '@vanilla-extract/css'
import { media } from './breakpoints'

export const cardGridBase: StyleRule = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
}

export const cardGridResponsive: StyleRule = {
  ...cardGridBase,
  '@media': {
    [media.tablet]: { gridTemplateColumns: 'repeat(2, 1fr)' },
    [media.phone]: { gridTemplateColumns: 'repeat(1, 1fr)' },
  },
}
