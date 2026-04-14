import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const tableStyle = style({
  width: '100%',
  borderCollapse: 'collapse',
  border: `1px solid ${colors.gray100}`,
  overflow: 'hidden',
})

export const trStyle = style({
  selectors: {
    '&:hover': {
      backgroundColor: colors.gray50,
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
  selectors: {
    '&:last-child': {
      borderRight: 'none',
    },
  },
})

export const tdStyle = style({
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
  selectors: {
    'tr:last-child &': {
      borderBottom: 'none',
    },
    '&:last-child': {
      borderRight: 'none',
    },
  },
})

export const completionCellStyle = style({
  height: '100%',
  paddingLeft: '20px',
  paddingRight: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

export const progressTrackStyle = style({
  width: '160px',
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
})

export const remainingTextStyle = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  flexShrink: 0,
})

export const deleteButtonStyle = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  color: colors.gray100,
  marginLeft: 'auto',
  selectors: {
    '&:hover': {
      color: colors.gray300,
    },
  },
})
