import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

export const chipRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '24px',
})

export const chip = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  border: 'none',
  borderRadius: '999px',
  padding: '4px 12px',
  cursor: 'pointer',
  '@media': {
    [media.phone]: {
      minHeight: '36px',
    },
  },
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
})

export const chipActive = style({
  backgroundColor: colors.primary500,
  color: colors.white,
  border: '1px solid transparent',
})

export const chipInactive = style({
  backgroundColor: colors.background,
  color: colors.gray700,
  border: `1px solid ${colors.gray50}`,
  fontWeight: 500,
})

export const tableWrap = style({
  overflowX: 'auto',
  border: `1px solid ${colors.gray100}`,
  borderRadius: '10px',
  backgroundColor: colors.white,
  WebkitOverflowScrolling: 'touch',
  overscrollBehaviorX: 'contain',
})

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '960px',
})

export const th = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  color: colors.gray700,
  textAlign: 'left',
  padding: '10px 16px',
  backgroundColor: colors.gray50,
  borderBottom: `1px solid ${colors.gray100}`,
  borderRight: `1px solid ${colors.gray100}`,
  whiteSpace: 'nowrap',
  selectors: {
    '&:last-child': { borderRight: 'none' },
  },
})

export const td = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray900,
  padding: '10px 16px',
  borderBottom: `1px solid ${colors.gray100}`,
  borderRight: `1px solid ${colors.gray100}`,
  verticalAlign: 'middle',
  selectors: {
    '&:last-child': { borderRight: 'none' },
  },
})

export const trClickable = style({
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: colors.gray50 },
  },
})

export const trExpanded = style({
  backgroundColor: colors.primary50,
})

export const stickyFirstCell = style({
  '@media': {
    [media.phone]: {
      position: 'sticky',
      left: 0,
      zIndex: 2,
      minWidth: '128px',
      backgroundColor: colors.white,
      boxShadow: `4px 0 8px -6px ${colors.gray200}`,
      selectors: {
        'th&': {
          zIndex: 3,
          backgroundColor: colors.gray50,
        },
        [`${trClickable}:hover &`]: {
          backgroundColor: colors.gray50,
        },
        [`${trExpanded} &`]: {
          backgroundColor: colors.primary50,
        },
      },
    },
  },
})

export const dateCell = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
})

export const chevron = style({
  flexShrink: 0,
  color: colors.gray500,
  transition: 'transform 0.2s',
  display: 'inline-flex',
  transform: 'rotate(0deg)',
})

export const chevronOpen = style({
  transform: 'rotate(90deg)',
})

export const badgeSuccess = style({
  color: colors.success500,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
})

export const badgeFail = style({
  color: colors.error500,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
})

export const badgePending = style({
  color: colors.gray500,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
})

export const badgeManual = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: '6px',
  backgroundColor: colors.warning50,
  color: colors.warning500,
  fontSize: '14px',
  fontWeight: 600,
})

export const badgeTypeLesson = style({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '6px',
  backgroundColor: colors.primary50,
  color: colors.primary500,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
})

export const badgeTypeAtt = style({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '6px',
  backgroundColor: colors.gray50,
  color: colors.gray700,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
})

export const badgeTypeBroadcast = style({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '6px',
  backgroundColor: colors.gray50,
  color: colors.gray700,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
})

export const templateTag = style({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '6px',
  backgroundColor: colors.primary100,
  color: colors.primary500,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
})

export const detailCell = style({
  padding: 0,
})

export const detailRow = style({
  backgroundColor: colors.white,
})

export const detailInner = style({
  padding: '16px',
  borderBottom: `1px solid ${colors.gray100}`,
  minWidth: 0,
  maxWidth: '100%',
  boxSizing: 'border-box',
  '@media': {
    [media.phone]: {
      padding: '12px',
    },
  },
})

export const detailHead = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '12px',
  marginBottom: '12px',
  '@media': {
    [media.phone]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
})

export const detailTitle = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const detailHint = style({
  marginTop: '2px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '13px',
  fontWeight: 400,
  lineHeight: 1.4,
  color: colors.gray500,
})

export const innerChipRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '12px',
})

export const innerChip = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  borderRadius: '999px',
  border: `1px solid ${colors.gray100}`,
  backgroundColor: colors.white,
  color: colors.gray700,
  padding: '4px 14px',
  height: '32px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  '@media': {
    [media.phone]: {
      minHeight: '36px',
      height: 'auto',
    },
  },
})

export const innerChipActive = style({
  backgroundColor: colors.gray900,
  borderColor: colors.gray900,
  color: colors.white,
  fontWeight: 600,
})

export const innerTableWrap = style({
  overflowX: 'auto',
  border: `1px solid ${colors.gray100}`,
  borderRadius: '10px',
  WebkitOverflowScrolling: 'touch',
})

export const innerTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '720px',
})

export const phoneStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
})

export const phoneLine = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minHeight: '22px',
})

export const phoneFail = style({
  color: colors.error500,
})

export const guideText = style({
  color: colors.gray700,
  fontWeight: 400,
  lineHeight: 1.4,
  whiteSpace: 'normal',
})

export const resendBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.white,
  backgroundColor: colors.primary500,
  border: 'none',
  borderRadius: '6px',
  padding: '6px 12px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  alignSelf: 'flex-start',
  '@media': {
    [media.phone]: {
      minHeight: '36px',
    },
  },
  selectors: {
    '&:disabled': {
      color: colors.gray500,
      backgroundColor: colors.gray50,
      cursor: 'default',
    },
  },
})

export const previewCell = style({
  backgroundColor: colors.white,
  padding: '8px 16px 16px',
})

export const previewBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '8px',
})

export const previewMeta = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const previewMetaMuted = style({
  color: colors.gray500,
  fontWeight: 400,
})

export const previewBubble = style({
  backgroundColor: colors.gray50,
  borderRadius: '12px',
  padding: '16px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 400,
  lineHeight: 1.5,
  letterSpacing: '-0.03em',
  color: colors.gray700,
  whiteSpace: 'pre-wrap',
})

export const moreRow = style({
  display: 'flex',
  justifyContent: 'center',
  padding: '12px 0 4px',
})

export const moreBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  border: 'none',
  background: 'none',
  color: colors.primary500,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
  padding: '8px',
  '@media': {
    [media.phone]: {
      minHeight: '36px',
    },
  },
})

export const innerTh = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  color: colors.gray700,
  textAlign: 'left',
  padding: '10px 16px',
  backgroundColor: colors.gray50,
  borderBottom: `1px solid ${colors.gray100}`,
  whiteSpace: 'nowrap',
})

export const innerTd = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray900,
  letterSpacing: '-0.03em',
  padding: '10px 16px',
  borderBottom: `1px solid ${colors.gray100}`,
  verticalAlign: 'middle',
  backgroundColor: colors.white,
})

export const nameBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  whiteSpace: 'nowrap',
})

export const nameCell = style({
  whiteSpace: 'nowrap',
  width: '140px',
})

export const phoneCell = style({
  whiteSpace: 'nowrap',
})

export const emptyState = style({
  padding: '48px 24px',
  textAlign: 'center',
  color: colors.gray500,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
})

export const loadMoreRow = style({
  padding: '16px',
  textAlign: 'center',
})

export const loadMoreBtn = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray700,
  backgroundColor: colors.background,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '8px',
  padding: '10px 20px',
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      cursor: 'wait',
    },
  },
})
