import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

const tracking = '-0.03em'

export const pageRoot = style({
  width: '100%',
  maxWidth: '1100px',
})

export const pageTitle = style({
  margin: '0 0 8px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.display.fontSize,
  fontWeight: 700,
  lineHeight: '140%',
  letterSpacing: tracking,
  color: colors.gray900,
  '@media': {
    [media.phone]: {
      fontSize: fontStyles.headingLg.fontSize,
    },
  },
})

export const pageDesc = style({
  margin: '0 0 40px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: tracking,
  color: colors.gray500,
  '@media': {
    [media.phone]: {
      marginBottom: '24px',
    },
  },
})

export const cardStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const invoiceList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxHeight: '420px',
  overflowY: 'auto',
})

export const card = style({
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '20px',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  '@media': {
    [media.phone]: {
      padding: '20px 16px',
      borderRadius: '16px',
      gap: '16px',
    },
  },
})

export const sectionHead = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: 'wrap',
})

export const sectionTitle = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.headingMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: tracking,
  color: colors.gray900,
})

export const sectionDesc = style({
  margin: '6px 0 0',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: tracking,
  color: colors.gray500,
})

export const meter = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const barTrack = style({
  height: '8px',
  borderRadius: '999px',
  backgroundColor: colors.gray50,
  overflow: 'hidden',
})

export const barFill = style({
  height: '100%',
  borderRadius: '999px',
  backgroundColor: colors.primary500,
})

export const compareScroll = style({
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
  margin: '0 -4px',
  padding: '0 4px',
})

export const compareTable = style({
  width: '100%',
  minWidth: '760px',
  borderCollapse: 'separate',
  borderSpacing: 0,
  tableLayout: 'fixed',
})

export const labelCell = style({
  position: 'sticky',
  left: 0,
  zIndex: 1,
  width: '96px',
  padding: '14px 12px',
  textAlign: 'left',
  backgroundColor: colors.white,
  borderBottom: `1px solid ${colors.gray50}`,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  letterSpacing: tracking,
  lineHeight: '140%',
  color: colors.gray500,
})

export const planCell = style({
  padding: '14px 8px',
  textAlign: 'center',
  verticalAlign: 'middle',
  borderBottom: `1px solid ${colors.gray50}`,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  letterSpacing: tracking,
  lineHeight: '140%',
  color: colors.gray900,
  whiteSpace: 'nowrap',
})

export const planHead = style({
  padding: '12px 8px 14px',
  textAlign: 'center',
  verticalAlign: 'bottom',
  borderBottom: `1px solid ${colors.gray50}`,
  fontFamily: 'Pretendard, sans-serif',
})

export const currentCol = style({
  backgroundColor: colors.primary50,
})

export const planName = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: 700,
  letterSpacing: tracking,
  lineHeight: '140%',
  color: colors.gray900,
})

export const planBadge = style({
  minHeight: '18px',
  marginBottom: '4px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 700,
  letterSpacing: tracking,
  lineHeight: '140%',
  color: colors.primary500,
})

export const warn = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '12px',
  borderRadius: '12px',
  backgroundColor: colors.warning50,
  padding: '12px 16px',
})

export const noticeActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '8px',
})

export const payPanel = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '16px',
  marginTop: '8px',
  padding: '20px',
  borderRadius: '16px',
  backgroundColor: colors.gray50,
})

export const detailToggle = style({
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: tracking,
  color: colors.primary500,
})

export const payAmountLabel = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: tracking,
  color: colors.gray500,
})

export const payAmount = style({
  margin: '4px 0 0',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: 700,
  lineHeight: '140%',
  letterSpacing: tracking,
  color: colors.gray900,
})

export const agreeRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: tracking,
  color: colors.gray700,
})
