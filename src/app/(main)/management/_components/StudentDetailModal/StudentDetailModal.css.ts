import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const headerStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '36px',
})

export const closeButtonStyle = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: colors.gray500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  selectors: {
    '&:hover': { color: colors.gray600 },
  },
})

export const sectionStyle = style({
  marginBottom: '36px',
})

export const sectionTitleStyle = style({
  marginBottom: '12px',
})

export const infoLabelStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray500,
  width: '140px',
  flexShrink: 0,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const infoValueStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray900,
  flex: 1,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const editButtonStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  backgroundColor: colors.primary50,
  border: 'none',
  borderRadius: '6px',
  height: '24px',
  padding: '0 12px',
  cursor: 'pointer',
  color: colors.primary500,
  flexShrink: 0,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  selectors: {
    '&:hover': { backgroundColor: colors.primary100 },
  },
})

export const statsGridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '8px',
})

export const statCardStyle = style({
  backgroundColor: colors.gray50,
  borderRadius: '12px',
  height: '104px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const statLabelStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray500,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const statValueStyle = style({
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: fontStyles.headingLg.fontWeight,
  color: colors.gray700,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const trackingListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const trackingItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 16px',
  backgroundColor: colors.gray50,
  borderRadius: '8px',
})

export const trackingLabelStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray900,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const scrollBodyStyle = style({
  overflowY: 'auto',
  flex: 1,
  selectors: {
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent',
      borderRadius: '3px',
    },
    '&:hover::-webkit-scrollbar-thumb': {
      backgroundColor: colors.gray200,
    },
  },
})

export const completeButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  color: colors.gray500,
  backgroundColor: colors.white,
  border: 'none',
  borderRadius: '4px',
  padding: '4px 8px',
  cursor: 'pointer',
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  selectors: {
    '&:hover': {
      backgroundColor: colors.success50,
      color: colors.success500,
    },
    '&:active': {
      backgroundColor: colors.success200,
    },
  },
})

export const completeCheckIconStyle = style({
  color: colors.gray100,
  selectors: {
    [`${completeButtonStyle}:hover &`]: {
      color: colors.success500,
    },
  },
})
