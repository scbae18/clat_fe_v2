import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

const kakaoHeaderYellow = '#FEE501'
const previewPanelBg = '#C9DBEA'

export const pageRoot = style({
  maxWidth: '1200px',
})

export const pageTitle = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '28px',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  margin: '0 0 24px',
})

export const tabRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  borderBottom: `1px solid ${colors.gray100}`,
  paddingBottom: '12px',
  marginBottom: '32px',
})

export const tabLink = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  textDecoration: 'none',
  borderBottom: '2px solid transparent',
  paddingBottom: '10px',
  marginBottom: '-13px',
})

export const tabActive = style({
  color: colors.gray900,
  borderBottomColor: colors.primary500,
})

export const tabInactive = style({
  color: colors.gray500,
})

export const deliveryBanner = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  borderRadius: '8px',
  backgroundColor: colors.warning50,
  border: `1px solid ${colors.warning200}`,
  marginBottom: '24px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray700,
})

export const columns = style({
  display: 'flex',
  gap: '24px',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
})

export const formColumn = style({
  flex: '0 0 448px',
  minWidth: '320px',
  backgroundColor: colors.gray50,
  borderRadius: '16px',
  padding: '32px',
  boxSizing: 'border-box',
})

export const previewColumn = style({
  flex: '1 1 400px',
  minWidth: '320px',
  backgroundColor: previewPanelBg,
  borderRadius: '16px',
  padding: '32px',
  boxSizing: 'border-box',
})

export const hintRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '24px',
})

export const hintText = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: colors.primary500,
})

export const sectionLabel = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  margin: '0 0 12px',
})

export const sectionBlock = style({
  marginBottom: '24px',
})

export const textareaBox = style({
  width: '100%',
  minHeight: '72px',
  padding: '14px 16px',
  borderRadius: '8px',
  border: `1px solid ${colors.gray50}`,
  backgroundColor: colors.white,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: colors.gray900,
  resize: 'vertical',
  boxSizing: 'border-box',
  selectors: {
    '&:focus': {
      outline: `2px solid ${colors.primary200}`,
      outlineOffset: '1px',
    },
  },
})

export const varSectionLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginTop: '8px',
  marginBottom: '8px',
})

export const varLabelText = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  color: colors.gray700,
})

export const varChipsRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
})

export const varChip = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: colors.primary500,
  backgroundColor: colors.primary100,
  border: 'none',
  borderRadius: '6px',
  padding: '4px 8px',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary200,
    },
  },
})

export const varIconBox = style({
  width: '16px',
  height: '16px',
  borderRadius: '4px',
  backgroundColor: colors.primary100,
  flexShrink: 0,
})

export const saveRow = style({
  marginTop: '24px',
})

export const previewTitle = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '20px',
  fontWeight: 600,
  color: colors.gray900,
  margin: '0 0 24px',
})

export const previewPhoneShell = style({
  marginTop: '8px',
})

export const previewAppLabel = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray600,
  marginLeft: '44px',
  marginBottom: '8px',
})

export const previewHeaderBar = style({
  backgroundColor: kakaoHeaderYellow,
  borderRadius: '20px 20px 0 0',
  padding: '12px',
  marginLeft: '44px',
  maxWidth: '388px',
})

export const previewHeaderText = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  color: colors.gray900,
  margin: 0,
})

export const previewBubble = style({
  backgroundColor: colors.white,
  borderRadius: '0 0 20px 20px',
  padding: '16px',
  marginLeft: '44px',
  maxWidth: '388px',
  minHeight: '200px',
  boxSizing: 'border-box',
})

export const previewBodyText = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.6,
  color: colors.gray900,
  whiteSpace: 'pre-wrap',
  margin: 0,
})

export const previewCta = style({
  marginTop: '16px',
  backgroundColor: colors.gray50,
  borderRadius: '8px',
  padding: '12px',
  textAlign: 'center',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  color: colors.gray600,
})

export const previewTime = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray600,
  textAlign: 'right',
  marginTop: '8px',
  marginRight: '8px',
})

export const previewLogoRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px',
})

export const previewLogoPlaceholder = style({
  width: '36px',
  height: '36px',
  borderRadius: '14px',
  backgroundColor: colors.white,
})
