import { style } from '@vanilla-extract/css'

import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: '24px',
  alignItems: 'start',
  '@media': {
    [media.tablet]: {
      gridTemplateColumns: '1fr',
    },
  },
})

export const leftColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  minWidth: 0,
})

export const previewSticky = style({
  position: 'sticky',
  top: '24px',
  alignSelf: 'start',
  minWidth: 0,
  '@media': {
    [media.tablet]: {
      position: 'static',
    },
  },
})

export const panel = style({
  backgroundColor: colors.gray50,
  borderRadius: '16px',
  padding: '32px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  '@media': {
    [media.phone]: {
      padding: '16px',
    },
  },
})

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
})

export const sectionBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const typeGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
  '@media': {
    [media.phone]: {
      gridTemplateColumns: '1fr',
    },
  },
})

export const typeCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4px',
  padding: '14px 16px',
  borderRadius: '8px',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray100}`,
  cursor: 'pointer',
  textAlign: 'left',
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary50,
    },
  },
})

export const typeCardActive = style({
  backgroundColor: colors.primary50,
  borderColor: colors.primary200,
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary50,
    },
  },
})

export const typeCardTitle = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const typeCardTitleActive = style({
  color: colors.primary500,
})

export const typeCardHint = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
  wordBreak: 'keep-all',
})

export const filterRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
})

export const filterChip = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  border: 'none',
  borderRadius: '999px',
  padding: '6px 12px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
})

export const filterChipActive = style({
  backgroundColor: colors.primary500,
  color: colors.white,
})

export const filterChipInactive = style({
  backgroundColor: colors.white,
  color: colors.gray700,
  outline: `1px solid ${colors.gray100}`,
})

export const filterChipCount = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  opacity: 0.85,
})

export const toolbar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  flexWrap: 'wrap',
})

export const toolbarActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
})

export const textAction = style({
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.primary500,
  selectors: {
    '&:disabled': {
      color: colors.gray300,
      cursor: 'not-allowed',
    },
  },
})

export const textActionMuted = style({
  border: 'none',
  backgroundColor: 'transparent',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const studentList = style({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colors.white,
  borderRadius: '12px',
  maxHeight: '240px',
  overflowX: 'hidden',
  overflowY: 'auto',
})

export const studentRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  flexShrink: 0,
  height: '48px',
  padding: '0 16px',
  border: 'none',
  borderBottom: `1px solid ${colors.gray100}`,
  backgroundColor: colors.white,
  textAlign: 'left',
  cursor: 'pointer',
  boxSizing: 'border-box',
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: colors.gray50,
    },
  },
})

export const studentRowSelected = style({
  backgroundColor: colors.primary50,
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary50,
    },
  },
})

export const studentRowDisabled = style({
  cursor: 'not-allowed',
  selectors: {
    '&:hover': {
      backgroundColor: colors.white,
    },
  },
})

export const studentName = style({
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '13px',
  fontWeight: fontStyles.titleSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const checkBox = style({
  width: '16px',
  height: '16px',
  flexShrink: 0,
  borderRadius: '4px',
  boxSizing: 'border-box',
  border: `1.5px solid ${colors.gray200}`,
  backgroundColor: colors.white,
})

export const checkBoxOn = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '16px',
  height: '16px',
  flexShrink: 0,
  color: colors.primary500,
})

export const studentMetaGroup = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '8px',
  flexShrink: 0,
  maxWidth: '52%',
  minWidth: 0,
})

export const studentMeta = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
  textAlign: 'right',
})

export const emptyList = style({
  margin: 'auto',
  padding: '32px 16px',
  textAlign: 'center',
})

export const channelRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
})

export const channelCheck = style({
  flex: '1 1 0',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 0,
  padding: '12px 16px',
  borderRadius: '8px',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray100}`,
  cursor: 'pointer',
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary50,
    },
  },
})

export const channelCheckActive = style({
  borderColor: colors.primary200,
  backgroundColor: colors.primary50,
  color: colors.primary500,
})

export const bodyField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const bodyBox = style({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '8px',
  overflow: 'hidden',
  selectors: {
    '&:focus-within': {
      borderColor: colors.primary500,
    },
  },
})

export const bodyTextarea = style({
  minHeight: '88px',
  resize: 'none',
  selectors: {
    '&&': {
      border: 'none',
      borderRadius: 0,
      backgroundColor: 'transparent',
    },
    '&&:focus': {
      borderColor: 'transparent',
    },
  },
})

export const bodyCount = style({
  margin: 0,
  padding: '0 16px 12px',
  textAlign: 'right',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const bodyCountOver = style([
  bodyCount,
  {
    color: colors.error500,
  },
])

export const studentMetaOver = style({
  flexShrink: 0,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.error500,
  whiteSpace: 'nowrap',
})

export const lengthBody = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginTop: '44px',
  marginBottom: '36px',
  gap: '4px',
})

export const lengthTitle = style({
  marginBottom: '8px',
})

export const summaryBar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: 'wrap',
  marginTop: '8px',
})

export const suggestionWrap = style({
  position: 'relative',
})

export const summaryActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginLeft: 'auto',
})

export const schedulePick = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '8px',
  flexWrap: 'wrap',
})

export const scheduleInput = style({
  height: '40px',
  padding: '0 12px',
  borderRadius: '8px',
  border: `1px solid ${colors.gray200}`,
  backgroundColor: colors.white,
  color: colors.gray900,
  fontSize: fontStyles.bodyMd.fontSize,
})

export const scheduleList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const scheduleItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '8px 12px',
  borderRadius: '8px',
  backgroundColor: colors.gray50,
  color: colors.gray700,
  fontSize: fontStyles.bodyMd.fontSize,
})

export const countBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: '999px',
  backgroundColor: colors.primary100,
  color: colors.primary500,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  whiteSpace: 'nowrap',
})
