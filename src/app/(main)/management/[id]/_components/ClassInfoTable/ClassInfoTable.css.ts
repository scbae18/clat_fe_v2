import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { truncateRules } from '@/styles/tokens/textOverflow'
import { media } from '@/styles/tokens/breakpoints'

export const infoGridStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  '@media': {
    [media.phone]: {
      gridTemplateColumns: '1fr',
    },
  },
})

export const tableWrapStyle = style({
  overflow: 'hidden',
  border: `1px solid ${colors.gray100}`,
  borderRadius: '8px',
  backgroundColor: colors.white,
})

export const tableStyle = style({
  width: '100%',
  borderCollapse: 'collapse',
  border: 'none',
})

export const thStyle = style({
  width: '116px',
  height: '40px',
  padding: '0 16px',
  backgroundColor: colors.gray50,
  color: colors.gray900,
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  textAlign: 'left',
  borderRight: `1px solid ${colors.gray100}`,
  borderBottom: `1px solid ${colors.gray100}`,
  selectors: {
    'tr:last-child &': {
      borderBottom: 'none',
    },
  },
})

export const tdStyle = style([
  {
    height: '40px',
    padding: '0 16px',
    backgroundColor: colors.white,
    color: colors.gray700,
    fontSize: fontStyles.bodyMd.fontSize,
    fontWeight: fontStyles.bodyMd.fontWeight,
    letterSpacing: '-0.03em',
    lineHeight: '140%',
    borderRight: `1px solid ${colors.gray100}`,
    borderBottom: `1px solid ${colors.gray100}`,
    maxWidth: 0,
    selectors: {
      'tr:last-child &': {
        borderBottom: 'none',
      },
      '&:last-child': {
        borderRight: 'none',
      },
    },
  },
  truncateRules,
])

export const tdValueStyle = style({
  height: '40px',
  padding: '0 16px',
  backgroundColor: colors.white,
  color: colors.gray700,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  borderRight: `1px solid ${colors.gray100}`,
  borderBottom: `1px solid ${colors.gray100}`,
  selectors: {
    'tr:last-child &': {
      borderBottom: 'none',
    },
    '&:last-child': {
      borderRight: 'none',
    },
  },
})

export const tdEditStyle = style({
  height: 'auto',
  padding: '8px 12px',
  backgroundColor: colors.white,
  borderRight: `1px solid ${colors.gray100}`,
  borderBottom: `1px solid ${colors.gray100}`,
  selectors: {
    'tr:last-child &': {
      borderBottom: 'none',
    },
    '&:last-child': {
      borderRight: 'none',
    },
  },
})

export const valueLineStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  minWidth: 0,
})

export const valueTextStyle = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const pencilButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  padding: 0,
  border: 'none',
  background: 'none',
  color: colors.gray500,
  cursor: 'pointer',
  flexShrink: 0,
})

export const cellInputStyle = style({
  width: '100%',
  height: '32px',
  padding: '0 8px',
  border: `1px solid ${colors.primary500}`,
  borderRadius: '6px',
  backgroundColor: colors.white,
  color: colors.gray700,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  outline: 'none',
  boxSizing: 'border-box',
  selectors: {
    '&::placeholder': {
      color: colors.gray300,
    },
  },
})

export const dayGroupStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
})

export const dayButtonRecipe = recipe({
  base: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: fontStyles.bodyMd.fontSize,
    fontWeight: fontStyles.bodyMd.fontWeight,
    letterSpacing: '-0.03em',
    lineHeight: '140%',
  },
  variants: {
    selected: {
      true: {
        backgroundColor: colors.primary100,
        border: `1px solid ${colors.primary500}`,
        color: colors.primary500,
      },
      false: {
        backgroundColor: colors.white,
        border: `1px solid ${colors.gray100}`,
        color: colors.gray700,
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
})