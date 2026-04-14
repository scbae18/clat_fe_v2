import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const tableStyle = style({
  width: '100%',
  borderCollapse: 'collapse',
  border: `1px solid ${colors.gray100}`,
  overflow: 'hidden',
})

export const thStyle = style({
  width: '160px',
  height: '48px',
  paddingLeft: '16px',
  backgroundColor: colors.gray50,
  color: colors.gray900,
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  textAlign: 'left',
  borderBottom: `1px solid ${colors.gray100}`,
  borderRight: `1px solid ${colors.gray100}`,
  selectors: {
    'tr:last-child &': {
      borderBottom: 'none',
    },
  },
})

export const tdStyle = style({
  height: '48px',
  borderBottom: `1px solid ${colors.gray100}`,
  selectors: {
    'tr:last-child &': {
      borderBottom: 'none',
    },
  },
})

export const inputStyle = style({
  width: '100%',
  height: '100%',
  padding: '0 16px',
  border: 'none',
  outline: 'none',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray700,
  letterSpacing: '-0.03em',
  backgroundColor: 'transparent',
  selectors: {
    '&::placeholder': {
      color: colors.gray300,
    },
    '&:focus': {
      backgroundColor: colors.primary50,
    },
  },
})