import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const fieldGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '40px',
})

export const stepStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '24px',
  backgroundColor: colors.background,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '16px',
})

export const stepHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const stepNumberStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: colors.primary500,
  color: colors.white,
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: fontStyles.titleMd.fontWeight,
  flexShrink: 0,
})

export const stepTitleStyle = style({
  fontSize: fontStyles.headingSm.fontSize,
  fontWeight: fontStyles.headingSm.fontWeight,
  color: colors.gray900,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const stepDescStyle = style({
  marginLeft: 32,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray500,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const dropzoneStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '24px',
  marginLeft: '32px',
  marginRight: '32px',
  marginBottom: '16px',
  border: 'none',
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23C5C6D3' stroke-width='1' stroke-dasharray='6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
  borderRadius: '12px',
  backgroundColor: colors.white,
  cursor: 'pointer',
  transition: 'border-color 0.2s, background-color 0.2s',
  selectors: {
    '&:hover': {
      borderColor: colors.primary500,
      backgroundColor: colors.primary50,
    },
  },
})

export const dropzoneActiveStyle = style({
  borderColor: colors.primary500,
  backgroundColor: colors.primary50,
})

export const dropzoneTextStyle = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  color: colors.gray300,
  letterSpacing: '-0.03em',
  selectors: {
    [`${dropzoneStyle}:hover &`]: {
      color: colors.primary500,
    },
  },
})

export const dropzoneIconStyle = style({
  color: colors.gray300,
  transition: 'color 0.2s',
  selectors: {
    [`${dropzoneStyle}:hover &`]: {
      color: colors.primary500,
    },
  },
})

export const fileNameStyle = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  color: colors.gray700,
  letterSpacing: '-0.03em',
})

export const fileRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '12px 16px',
  backgroundColor: colors.white,
  borderRadius: '8px',
})

export const fileIconBadgeStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  backgroundColor: '#1D6F42',
  borderRadius: '6px',
  fontSize: '10px',
  fontWeight: '700',
  color: colors.white,
  flexShrink: 0,
})

export const fileDeleteButtonStyle = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  color: colors.gray300,
  marginLeft: 'auto',
  selectors: {
    '&:hover': {
      color: colors.gray500,
    },
  },
})

export const actionsStyle = style({
  display: 'flex',
  gap: '8px',
})
