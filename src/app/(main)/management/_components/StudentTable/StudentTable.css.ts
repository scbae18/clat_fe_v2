import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { phoneTextRules, truncateRules } from '@/styles/tokens/textOverflow'

export const tableWrapStyle = style({
  overflowX: 'auto',
  border: `1px solid ${colors.gray100}`,
  borderRadius: '8px',
  backgroundColor: colors.white,
})

export const tableStyle = style({
  width: '100%',
  borderCollapse: 'collapse',
  border: 'none',
})

export const tableAllStudentsStyle = style({
  minWidth: '1100px',
})

export const tableClassDetailStyle = style({
  minWidth: '900px',
})

export const trStyle = style({
  selectors: {
    '&:hover': {
      backgroundColor: colors.gray50,
    },
  },
})

export const trSelectedStyle = style({
  backgroundColor: colors.primary50,
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary100,
    },
  },
})

export const thStyle = style({
  height: '40px',
  paddingLeft: '16px',
  paddingRight: 'var(--cell-padding-right, 48px)',
  backgroundColor: colors.gray50,
  color: colors.gray900,
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  textAlign: 'left',
  borderBottom: `1px solid ${colors.gray100}`,
  borderRight: `1px solid ${colors.gray100}`,
  whiteSpace: 'nowrap',
  selectors: {
    '&:last-child': {
      borderRight: 'none',
    },
  },
})

const tdBase = {
  height: '40px',
  paddingLeft: '16px',
  paddingRight: 'var(--cell-padding-right, 48px)',
  color: colors.gray700,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  borderBottom: `1px solid ${colors.gray100}`,
  borderRight: `1px solid ${colors.gray100}`,
  maxWidth: 0,
  selectors: {
    'tr:last-child &': {
      borderBottom: 'none',
    },
    '&:last-child': {
      borderRight: 'none',
    },
  },
} as const

export const tdStyle = style([tdBase, truncateRules])

export const tdPhoneStyle = style([tdBase, phoneTextRules])

export const completionCellStyle = style({
  height: '100%',
  paddingLeft: '20px',
  paddingRight: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: '280px',
})

export const progressTrackStyle = style({
  width: '120px',
  height: '12px',
  backgroundColor: colors.gray50,
  borderRadius: '999px',
  overflow: 'hidden',
  flexShrink: 0,
})

export const progressBarStyle = style({
  height: '100%',
  borderRadius: '999px',
  transition: 'width 0.3s',
})

export const percentTextStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray700,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  flexShrink: 0,
  whiteSpace: 'nowrap',
})

export const remainingTextStyle = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  flexShrink: 0,
  whiteSpace: 'nowrap',
})

export const deleteButtonStyle = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  color: colors.gray300,
  marginLeft: 'auto',
  flexShrink: 0,
  selectors: {
    '&:hover': {
      color: colors.gray500,
    },
  },
})
