import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const toolbarStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '16px',
})

export const searchBarStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: '1 1 auto',
  maxWidth: '360px',
  height: '40px',
  padding: '0 12px',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '8px',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  selectors: {
    '&:focus-within': {
      borderColor: colors.primary500,
      boxShadow: `0 0 0 3px ${colors.primary50}`,
    },
  },
})

export const searchLeadingIconStyle = style({
  flexShrink: 0,
  color: colors.gray500,
})

export const searchInputStyle = style({
  flex: 1,
  minWidth: 0,
  height: '100%',
  margin: 0,
  padding: 0,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
  selectors: {
    '&::placeholder': {
      color: colors.gray300,
    },
    '&::-webkit-search-cancel-button': {
      display: 'none',
    },
  },
})

export const searchClearButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '24px',
  height: '24px',
  padding: 0,
  border: 'none',
  borderRadius: '6px',
  background: 'none',
  color: colors.gray300,
  cursor: 'pointer',
  transition: 'color 0.15s, background-color 0.15s',
  selectors: {
    '&:hover': {
      color: colors.gray500,
      backgroundColor: colors.gray50,
    },
  },
})

export const emptyStateStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '40px 16px',
  textAlign: 'center',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray500,
  letterSpacing: '-0.03em',
  backgroundColor: colors.background,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '8px',
})

export const emptyStateIconStyle = style({
  color: colors.gray300,
})
