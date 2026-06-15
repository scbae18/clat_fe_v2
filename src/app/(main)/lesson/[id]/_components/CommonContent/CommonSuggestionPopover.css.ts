import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const inputCellWrapStyle = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'flex-start',
  minHeight: '48px',
})

export const popoverStyle = style({
  position: 'absolute',
  left: 0,
  top: 'calc(100% + 10px)',
  zIndex: 50,
  width: 'min(360px, calc(100vw - 48px))',
  padding: '14px',
  borderRadius: '14px',
  border: `1px solid ${colors.gray100}`,
  backgroundColor: colors.white,
  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.14)',
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-6px',
      left: '20px',
      width: '12px',
      height: '12px',
      backgroundColor: colors.white,
      borderLeft: `1px solid ${colors.gray100}`,
      borderTop: `1px solid ${colors.gray100}`,
      transform: 'rotate(45deg)',
    },
  },
})

export const popoverHeaderStyle = style({
  marginBottom: '12px',
})

export const popoverHeaderTitleStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  color: colors.primary600,
  letterSpacing: '-0.03em',
})

export const popoverHeaderHintStyle = style({
  marginTop: '4px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray500,
  letterSpacing: '-0.02em',
})

export const optionListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const optionCardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: `1px solid ${colors.gray100}`,
  backgroundColor: colors.white,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
  selectors: {
    '&:hover': {
      borderColor: colors.primary200,
      backgroundColor: colors.primary50,
      boxShadow: '0 2px 8px rgba(59, 81, 204, 0.08)',
    },
    '&:focus-visible': {
      outline: `2px solid ${colors.primary400}`,
      outlineOffset: '2px',
    },
  },
})

export const optionCardTopStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '8px',
  marginBottom: '6px',
})

export const optionBadgeGroupStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '4px',
})

export const optionBadgeStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: '999px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
})

export const optionBadgeLastClassStyle = style([
  optionBadgeStyle,
  {
    color: colors.gray700,
    backgroundColor: colors.gray50,
  },
])

export const optionBadgeAiStyle = style([
  optionBadgeStyle,
  {
    color: colors.primary600,
    backgroundColor: colors.primary50,
  },
])

export const optionAiAssistantBadgeStyle = style([
  optionBadgeStyle,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    color: colors.primary700,
    backgroundColor: colors.primary100,
  },
])

export const optionMetaStyle = style({
  flexShrink: 0,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray500,
  letterSpacing: '-0.02em',
})

export const optionPreviewStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray900,
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

export const optionSubPreviewStyle = style({
  marginTop: '6px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray500,
  lineHeight: 1.45,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

export const optionFooterStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '4px',
  marginTop: '8px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  color: colors.primary500,
  letterSpacing: '-0.03em',
})
