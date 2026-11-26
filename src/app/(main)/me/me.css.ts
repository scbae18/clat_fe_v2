import { style, globalStyle } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

const rowBorder = `1px solid ${colors.gray75}`

export const pageRoot = style({
  width: '100%',
})

export const pageTitle = style({
  margin: '0 0 36px',
  fontSize: fontStyles.display.fontSize,
  fontWeight: 700,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
  '@media': {
    [media.phone]: {
      marginBottom: '24px',
      fontSize: fontStyles.headingLg.fontSize,
    },
  },
})

export const pageBody = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '40px',
  '@media': {
    [media.tablet]: {
      flexDirection: 'column',
      gap: '28px',
    },
  },
})

export const pageContent = style({
  flex: 1,
  minWidth: 0,
  maxWidth: '680px',
  display: 'flex',
  flexDirection: 'column',
  gap: '74px',
  '@media': {
    [media.tablet]: {
      width: '100%',
      maxWidth: 'none',
      gap: '48px',
    },
  },
})

export const identityCard = style({
  flexShrink: 0,
  boxSizing: 'border-box',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray200}`,
  borderRadius: '16px',
  padding: '50px 62px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '22px',
  '@media': {
    [media.phone]: {
      width: '100%',
      padding: '32px 20px',
    },
  },
})

export const identityAvatar = style({
  width: '128px',
  height: '128px',
  borderRadius: '64px',
  backgroundColor: colors.primary100,
  color: colors.primary500,
  fontSize: '52px',
  fontWeight: 700,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media': {
    [media.phone]: {
      width: '96px',
      height: '96px',
      fontSize: '40px',
    },
  },
})

export const identityNameBlock = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
})

export const identityName = style({
  margin: 0,
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
  textAlign: 'center',
})

export const planChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '26px',
  padding: '3px 8px',
  borderRadius: '99px',
  backgroundColor: colors.primary100,
  color: colors.primary500,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const planChipEmpty = style([
  planChip,
  {
    minWidth: '52px',
  },
])

export const identityContact = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 400,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray600,
  textAlign: 'center',
  wordBreak: 'break-all',
})

globalStyle(`${identityContact} p`, {
  margin: 0,
})

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const sectionHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
})

export const sectionTitle = style({
  margin: 0,
  fontSize: fontStyles.headingMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const accountTitle = style([
  sectionTitle,
  {
    fontSize: fontStyles.headingSm.fontSize,
  },
])

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '18px 0',
  borderTop: rowBorder,
  '@media': {
    [media.phone]: {
      flexWrap: 'wrap',
    },
  },
})

export const rowLabel = style({
  flexShrink: 0,
  width: '148px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 400,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray600,
})

export const rowMain = style({
  flex: 1,
  minWidth: 0,
})

export const rowValue = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
  wordBreak: 'break-all',
})

export const rowValueStack = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

export const valueLine = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
})

export const rowHint = style({
  margin: 0,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray600,
})

export const usageHead = style({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '12px',
  minHeight: '20px',
})

export const usageRatio = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const usageTrack = style({
  width: '100%',
  height: '8px',
  borderRadius: '4px',
  backgroundColor: colors.gray75,
  overflow: 'hidden',
})

export const usageFill = style({
  height: '8px',
  borderRadius: '4px',
  backgroundColor: colors.primary500,
})

export const pillRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
})

const pillBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box' as const,
  height: '34px',
  padding: '6px 16px',
  borderRadius: '999px',
  fontSize: fontStyles.bodyMd.fontSize,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  textDecoration: 'none',
  cursor: 'pointer',
  fontFamily: 'Pretendard, sans-serif',
  whiteSpace: 'nowrap' as const,
}

export const primaryPill = style({
  ...pillBase,
  border: 'none',
  backgroundColor: colors.primary500,
  color: colors.white,
  fontWeight: 700,
})

export const quietPill = style({
  ...pillBase,
  border: `1px solid ${colors.gray100}`,
  backgroundColor: colors.gray50,
  color: colors.gray600,
  fontWeight: 500,
})

export const iconPill = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '36px',
  height: '36px',
  borderRadius: '18px',
  border: 'none',
  backgroundColor: 'transparent',
  color: colors.gray600,
  textDecoration: 'none',
  cursor: 'pointer',
  padding: 0,
  flexShrink: 0,
})

export const infoChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 8px',
  borderRadius: '6px',
  backgroundColor: colors.primary100,
  color: colors.primary500,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const mutedChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  padding: '3px 8px',
  borderRadius: '6px',
  backgroundColor: colors.gray50,
  color: colors.gray500,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const failChip = style([
  mutedChip,
  {
    backgroundColor: colors.error50,
    color: colors.error500,
  },
])

export const cardMark = style({
  flexShrink: 0,
  color: colors.gray700,
})

export const invoiceRow = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 190px) 110px max-content minmax(0, 1fr) 16px',
  alignItems: 'center',
  gap: '16px',
  padding: '16px 0',
  borderTop: rowBorder,
  '@media': {
    [media.phone]: {
      gridTemplateColumns: '1fr auto',
    },
  },
})

export const invoiceName = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray600,
})

export const invoiceDate = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 400,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray600,
})

export const invoiceAmount = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
  textAlign: 'right',
})

export const chevronLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.gray500,
  textDecoration: 'none',
})

export const noticeRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '14px 0',
  borderTop: rowBorder,
  color: colors.gray600,
})

export const noticeCopy = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
})

export const noticeTitle = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const noticeSub = style({
  margin: 0,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray600,
  wordBreak: 'break-all',
})

export const dangerRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  minHeight: '81px',
  padding: '18px 0',
  borderTop: rowBorder,
  '@media': {
    [media.phone]: {
      flexWrap: 'wrap',
    },
  },
})

export const dangerCopy = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

export const dangerTitle = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 700,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.error500,
})

export const dangerDesc = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray600,
})

export const dangerPill = style({
  ...pillBase,
  border: 'none',
  backgroundColor: colors.error50,
  color: colors.error500,
  fontWeight: 700,
})

export const iconButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  flexShrink: 0,
})

export const editActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
})

export const input = style({
  width: '100%',
  height: '40px',
  padding: '0 14px',
  borderRadius: '10px',
  border: `1px solid ${colors.gray100}`,
  background: colors.white,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  color: colors.gray900,
  outline: 'none',
  letterSpacing: '-0.03em',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  selectors: {
    '&:focus': {
      borderColor: colors.primary400,
    },
    '&::placeholder': {
      color: colors.gray300,
    },
  },
})

export const sectionDesc = style({
  margin: '6px 0 0',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const fieldLabel = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
  whiteSpace: 'nowrap',
})

export const modalFieldStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginTop: '8px',
})

export const modalField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const errorText = style({
  margin: 0,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.error500,
})

export const modalActions = style({
  display: 'flex',
  gap: '8px',
  marginTop: '24px',
  '@media': {
    [media.phone]: {
      flexDirection: 'column-reverse',
    },
  },
})

globalStyle(`${modalActions} > *`, {
  '@media': {
    [media.phone]: {
      width: '100%',
    },
  },
})

export const emptyState = style({
  padding: '48px 16px',
  textAlign: 'center',
  color: colors.gray500,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
})
