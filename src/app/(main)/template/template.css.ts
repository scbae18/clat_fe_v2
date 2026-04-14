import { style } from '@vanilla-extract/css'
import { cardGridResponsive } from '@/styles/tokens/grid'

export const gridStyle = style({
  ...cardGridResponsive,
  marginTop: '60px',
})