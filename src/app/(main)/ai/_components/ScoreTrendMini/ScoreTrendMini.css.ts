import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const wrap = style({
  width: '100%',
})

export const svg = style({
  display: 'block',
  width: '100%',
  height: 'auto',
})

export const grid = style({
  stroke: colors.gray75,
  strokeWidth: 1,
})

export const linePath = style({
  fill: 'none',
  stroke: colors.primary500,
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
})

export const areaPath = style({
  fill: colors.primary50,
  opacity: 0.7,
})

export const dot = style({
  fill: colors.white,
  stroke: colors.primary500,
  strokeWidth: 2,
})

export const dotHigh = style({
  fill: colors.error500,
  stroke: colors.error500,
})

export const dotMedium = style({
  fill: colors.warning500,
  stroke: colors.warning500,
})

export const dotLow = style({
  fill: colors.success500,
  stroke: colors.success500,
})

export const axisLabel = style({
  fill: colors.gray500,
  fontSize: '11px',
  fontWeight: 500,
})

export const thresholdHigh = style({
  stroke: colors.error200,
  strokeWidth: 1,
  strokeDasharray: '4 4',
})

export const thresholdMedium = style({
  stroke: colors.warning200,
  strokeWidth: 1,
  strokeDasharray: '4 4',
})
