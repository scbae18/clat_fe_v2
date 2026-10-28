import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

export const spotlight = style({
  position: 'fixed',
  borderRadius: '12px',
  boxShadow: '0 0 0 9999px rgba(54, 55, 68, 0.45)',
  pointerEvents: 'none',
  zIndex: 1350,
})

export const tooltip = style({
  position: 'fixed',
  zIndex: 1351,
  width: 'min(320px, calc(100vw - 32px))',
  background: colors.white,
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0 12px 32px rgba(54, 55, 68, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const tooltipTitle = style({
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: fontStyles.titleMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
  margin: 0,
})

export const tooltipBody = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
  margin: 0,
  whiteSpace: 'pre-line',
})

export const tooltipNote = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray600,
  margin: 0,
})

export const tooltipActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: '4px',
})

export const textButton = style({
  border: 'none',
  background: 'transparent',
  color: colors.gray600,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  cursor: 'pointer',
  padding: '8px',
})

export const primaryButton = style({
  border: 'none',
  background: colors.primary500,
  color: colors.gray50,
  borderRadius: '8px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  cursor: 'pointer',
  padding: '8px 12px',
  ':disabled': {
    background: colors.gray200,
    color: colors.gray500,
    cursor: 'default',
  },
})

export const fallback = style({
  position: 'fixed',
  left: '16px',
  right: '16px',
  bottom: '96px',
  zIndex: 1351,
  margin: '0 auto',
  maxWidth: '360px',
  background: colors.white,
  borderRadius: '12px',
  padding: '16px',
  boxShadow: '0 12px 32px rgba(54, 55, 68, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const replay = style({
  border: `1px solid ${colors.gray200}`,
  background: colors.white,
  color: colors.gray600,
  borderRadius: '999px',
  padding: '4px 10px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 600,
  lineHeight: '16px',
  letterSpacing: '-0.02em',
  cursor: 'pointer',
  flexShrink: 0,
  ':hover': {
    background: colors.gray50,
  },
})

export const chip = style({
  position: 'fixed',
  right: '24px',
  bottom: '96px',
  zIndex: 1351,
  border: 'none',
  background: colors.primary500,
  color: colors.gray50,
  borderRadius: '999px',
  padding: '12px 16px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(59, 81, 204, 0.28)',
  '@media': {
    [media.phone]: {
      bottom: '88px',
    },
  },
})

export const homeCard = style({
  background: colors.white,
  border: `1px solid ${colors.gray75}`,
  borderRadius: '12px',
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  '@media': {
    [media.phone]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
})

export const homeTitle = style({
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: fontStyles.titleMd.fontWeight,
  color: colors.gray900,
  margin: 0,
})

export const homeBody = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  color: colors.gray700,
  margin: '4px 0 0',
})

export const homeActions = style({
  display: 'flex',
  gap: '8px',
  flexShrink: 0,
})

export const hint = style({
  background: colors.primary50,
  borderRadius: '12px',
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  margin: '12px 0',
})

export const dialogBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  paddingBottom: '8px',
})

export const dialogActions = style({
  display: 'flex',
  gap: '8px',
})
