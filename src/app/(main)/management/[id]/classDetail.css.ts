import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '60px',
})

export const headerRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: 'wrap',
})

export const titleGroupStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: 0,
})

export const headerActionsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  marginLeft: 'auto',
})

const headerButtonBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  height: '40px',
  padding: 0,
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  whiteSpace: 'nowrap',
  flexShrink: 0,
} as const

export const editButtonStyle = style({
  ...headerButtonBase,
  width: '90px',
  gap: '4px',
  backgroundColor: colors.gray50,
  color: colors.primary500,
  selectors: {
    '&:hover': { backgroundColor: colors.gray75 },
  },
})

export const cancelButtonStyle = style({
  ...headerButtonBase,
  width: '90px',
  backgroundColor: colors.gray50,
  color: colors.gray600,
  selectors: {
    '&:hover:not(:disabled)': { backgroundColor: colors.gray75 },
    '&:disabled': { cursor: 'not-allowed', color: colors.gray300 },
  },
})

export const saveButtonStyle = style({
  ...headerButtonBase,
  width: '121px',
  backgroundColor: colors.primary500,
  color: colors.white,
  selectors: {
    '&:hover:not(:disabled)': { backgroundColor: colors.primary600 },
    '&:disabled': { cursor: 'not-allowed', backgroundColor: colors.gray300 },
  },
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
})

export const sectionHeaderStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
})

export const rosterActionsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
})

const textActionBase = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
} as const

export const selectAllButtonStyle = style({
  ...textActionBase,
  color: colors.gray700,
  selectors: {
    '&:disabled': {
      color: colors.gray300,
      cursor: 'not-allowed',
    },
  },
})

export const deleteStudentsButtonStyle = style({
  ...textActionBase,
  color: colors.error500,
  selectors: {
    '&:disabled': {
      color: colors.gray300,
      cursor: 'not-allowed',
    },
  },
})

export const enrollButtonStyle = style({
  ...textActionBase,
  color: colors.primary500,
})
