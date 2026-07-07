import type { StyleRule } from '@vanilla-extract/css'

export const truncateRules: StyleRule = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
}

export const phoneTextRules: StyleRule = {
  ...truncateRules,
  fontVariantNumeric: 'tabular-nums',
}
