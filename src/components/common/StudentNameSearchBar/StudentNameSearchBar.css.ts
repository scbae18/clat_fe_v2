import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

export const toolbarStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '16px',
  '@media': {
    [media.phone]: {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '12px',
    },
  },
})

export const leadingClusterStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: '1 1 auto',
  minWidth: 0,
  '@media': {
    [media.phone]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
})

export const searchBarStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  flex: '1 1 auto',
  maxWidth: '360px',
  height: '40px',
  padding: '0 16px',
  '@media': {
    [media.phone]: {
      maxWidth: 'none',
      width: '100%',
      height: '44px',
    },
  },
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '8px',
  overflow: 'hidden',
  selectors: {
    '&:focus-within': {
      borderColor: colors.primary500,
    },
  },
})

export const searchIconSlotStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '16px',
  height: '16px',
  flexShrink: 0,
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
  fontWeight: 400,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
  selectors: {
    '&::placeholder': {
      color: colors.gray500,
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

export const countClusterStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  '@media': {
    [media.phone]: {
      justifyContent: 'flex-start',
      width: '100%',
    },
  },
})

export const countActionButtonStyle = style({
  border: 'none',
  background: 'none',
  padding: 0,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  selectors: {
    '&:hover': {
      color: colors.gray700,
    },
  },
})

const selectionActionBase = {
  border: 'none',
  background: 'none',
  padding: 0,
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
} as const

export const manageLinkStyle = style({
  ...selectionActionBase,
  color: colors.primary500,
  selectors: {
    '&:hover': {
      color: colors.primary600,
    },
  },
})

export const selectionActionsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
})

export const selectionQuietStyle = style({
  ...selectionActionBase,
  color: colors.gray700,
  selectors: {
    '&:hover:not(:disabled)': {
      color: colors.gray900,
    },
    '&:disabled': {
      color: colors.gray300,
      cursor: 'not-allowed',
    },
  },
})

export const selectionDangerStyle = style({
  ...selectionActionBase,
  color: colors.error500,
  selectors: {
    '&:hover:not(:disabled)': {
      color: colors.error600,
    },
    '&:disabled': {
      cursor: 'not-allowed',
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
