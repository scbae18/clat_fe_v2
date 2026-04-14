import { style, styleVariants } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const sectionHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const itemListStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
})

const itemBase = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: colors.white,
  borderRadius: '8px',
  padding: '8px 12px',
} as const

export const itemVariants = styleVariants({
  active: [itemBase, { border: `1px solid ${colors.primary500}` }],
  inactive: [itemBase, { border: `1px solid ${colors.gray300}` }],
})

const labelBase = {
  flex: 1,
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
} as const

export const itemLabelVariants = styleVariants({
  active: [labelBase, { color: colors.primary500 }],
  inactive: [labelBase, { color: colors.gray300 }],
})

export const itemInputVariants = styleVariants({
  active: [labelBase, { color: colors.primary500, background: 'none', border: 'none', outline: 'none', padding: 0, width: '100%' }],
  inactive: [labelBase, { color: colors.gray300, background: 'none', border: 'none', outline: 'none', padding: 0, width: '100%' }],
})

export const deleteButtonStyle = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  color: colors.gray300,
})

export const addButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  backgroundColor: colors.primary100,
  border: 'none',
  borderRadius: '8px',
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  color: colors.primary500,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  selectors: {
    '&:hover': { backgroundColor: colors.primary200 },
    '&:active': { backgroundColor: colors.primary300 },
  },
})

const checkButtonBase = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.2s',
} as const

export const checkButtonVariants = styleVariants({
  active: [checkButtonBase, { color: colors.primary500 }],
  inactive: [checkButtonBase, { color: colors.gray300 }],
})
