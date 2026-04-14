import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

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
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
})

export const chipActive = style({
  backgroundColor: colors.primary500,
  color: colors.white,
})

export const chipInactive = style({
  backgroundColor: colors.gray50,
  color: colors.gray700,
})

export const tableWrap = style({
  overflowX: 'auto',
  border: `1px solid ${colors.gray100}`,
  borderRadius: '8px',
  backgroundColor: colors.white,
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
  transform: 'rotate(-90deg)',
})

export const chevronOpen = style({
  transform: 'rotate(0deg)',
})

export const badgeSuccess = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: '6px',
  backgroundColor: colors.success50,
  color: colors.success500,
  fontSize: '14px',
  fontWeight: 600,
})

export const badgeFail = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: '6px',
  backgroundColor: colors.error50,
  color: colors.error500,
  fontSize: '14px',
  fontWeight: 600,
})

export const badgeTypeLesson = style({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '6px',
  border: `1px solid ${colors.primary100}`,
  backgroundColor: colors.primary50,
  color: colors.primary500,
  fontSize: '14px',
  fontWeight: 600,
})

export const badgeTypeAtt = style({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '6px',
  border: `1px solid ${colors.primary100}`,
  backgroundColor: colors.gray50,
  color: colors.gray700,
  fontSize: '14px',
  fontWeight: 600,
})

export const templateTag = style({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '6px',
  border: `1px solid ${colors.gray100}`,
  color: colors.gray700,
  fontSize: '14px',
  fontWeight: 600,
})

export const resendBtn = style({
  marginLeft: '10px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  color: colors.gray700,
  backgroundColor: colors.gray50,
  border: 'none',
  borderRadius: '6px',
  padding: '2px 8px',
  cursor: 'not-allowed',
  opacity: 0.85,
})

export const detailRow = style({
  backgroundColor: colors.background,
})

export const detailInner = style({
  padding: '20px 24px',
  borderBottom: `1px solid ${colors.gray100}`,
  minWidth: 0,
  maxWidth: '100%',
  boxSizing: 'border-box',
  overflow: 'hidden',
})

export const detailTitle = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '16px',
  fontWeight: 600,
  color: colors.gray900,
  marginBottom: '16px',
})

export const studentNameRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '16px',
  maxHeight: '220px',
  overflowY: 'auto',
  overflowX: 'hidden',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  paddingRight: '4px',
})

export const studentNameChip = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '10px',
  padding: '10px 14px',
  backgroundColor: colors.white,
  color: colors.gray700,
  cursor: 'pointer',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  textAlign: 'left',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  selectors: {
    '&:hover': {
      borderColor: colors.primary200,
      color: colors.primary600,
    },
  },
})

export const studentNameChipActive = style({
  borderColor: colors.primary500,
  backgroundColor: colors.primary50,
  color: colors.primary500,
})

export const studentCard = style({
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '12px',
  padding: '16px',
})

export const statusPill = style({
  fontSize: '12px',
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: '4px',
  marginLeft: '8px',
})

export const msgBlock = style({
  marginTop: '12px',
  fontSize: '13px',
  color: colors.gray700,
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6,
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
  borderTop: `1px solid ${colors.gray100}`,
})
