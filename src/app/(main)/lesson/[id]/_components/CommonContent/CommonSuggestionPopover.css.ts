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
  top: 'calc(100% + 8px)',
  zIndex: 50,
  width: 'min(320px, 42vw)',
  padding: '12px',
  borderRadius: '12px',
  border: `1px solid ${colors.gray100}`,
  backgroundColor: colors.white,
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
})

export const popoverTitleStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '8px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  color: colors.primary600,
  letterSpacing: '-0.03em',
})

export const popoverAiLabelStyle = style({
  marginLeft: 'auto',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  color: colors.primary600,
  backgroundColor: colors.primary50,
  letterSpacing: '-0.03em',
})

export const popoverSourceStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray500,
  marginBottom: '8px',
})

export const popoverPreviewStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray900,
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  marginBottom: '10px',
  padding: '8px 10px',
  borderRadius: '8px',
  backgroundColor: colors.gray50,
  maxHeight: '120px',
  overflowY: 'auto',
})

export const popoverExampleStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  color: colors.gray500,
  lineHeight: 1.45,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  marginBottom: '10px',
})

export const popoverActionsStyle = style({
  display: 'flex',
  justifyContent: 'flex-end',
})

export const applyButtonStyle = style({
  padding: '6px 12px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  color: colors.white,
  backgroundColor: colors.primary500,
  letterSpacing: '-0.03em',
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary600,
    },
  },
})
