import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '36px',
})

export const bannerStyle = style({
  background: `radial-gradient(circle at right center, ${colors.primary400} 0%, transparent 75%), ${colors.primary100}`,
  borderRadius: '20px',
  padding: '32px 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',
  position: 'relative',
  minHeight: '160px',
})

export const bannerContentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  zIndex: 1,
})

export const bannerSubtitleStyle = style({
  fontSize: '24px',
  fontWeight: 700,
  letterSpacing: '-0.05em',
  color: colors.gray700,
})

export const bannerTitleStyle = style({
  fontSize: '52px',
  fontWeight: 800,
  letterSpacing: '-0.05em',
  color: colors.primary500,
})

export const bannerIllustWrapStyle = style({
  position: 'absolute',
  right: '-140px',
  bottom: '-110px',
  display: 'flex',
})

export const sectionHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
})

export const sectionTitleStyle = style({
  ...fontStyles.headingMd,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const tabListStyle = style({
  display: 'flex',
  gap: '8px',
  marginBottom: '16px',
})

export const tabButtonStyle = style({
  padding: '8px 16px',
  borderRadius: '100px',
  border: 'none',
  background: colors.gray50,
  color: colors.gray500,
  ...fontStyles.labelSm,
  fontWeight: 600,
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  transition: 'all 0.15s',
})

export const tabButtonActiveStyle = style({
  padding: '7px 16px',
  borderRadius: '100px',
  border: 'none',
  background: colors.primary500,
  color: colors.white,
  ...fontStyles.labelSm,
  fontWeight: 600,
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  transition: 'all 0.15s',
})

export const stepCardStyle = style({
  background: colors.gray50,
  borderRadius: '20px',
  padding: '24px 28px',
})

export const stepCardHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '16px',
})

export const stepCardTitleStyle = style({
  ...fontStyles.headingSm,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const stepItemListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
})

export const stepItemStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
})

export const stepNumberStyle = style({
  flexShrink: 0,
  padding: '0 12px',
  height: '20px',
  borderRadius: '100px',
  background: colors.gray75,
  color: colors.gray500,
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '-0.03em',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '2px',
  whiteSpace: 'nowrap',
})

export const stepItemTextStyle = style({
  ...fontStyles.bodyMd,
  color: colors.gray700,
  letterSpacing: '-0.03em',
  lineHeight: '1.65',
})

export const cardGridStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
})

export const betaCardStyle = style({
  background: colors.primary100,
  borderRadius: '20px',
  padding: '28px 32px',
  overflow: 'hidden',
  minHeight: '200px',
  position: 'relative',
})

export const inviteCardStyle = style({
  background: colors.primary500,
  borderRadius: '20px',
  padding: '28px 32px',
  overflow: 'hidden',
  minHeight: '200px',
  position: 'relative',
})

export const cardContentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  zIndex: 1,
  position: 'relative',
})

export const cardTagStyle = style({
  display: 'inline-flex',
  background: colors.primary200,
  borderRadius: '100px',
  padding: '4px 12px',
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.primary400,
  width: 'fit-content',
})

export const cardTagInvertStyle = style({
  display: 'inline-flex',
  background: 'transparent',
  border: `1px solid ${colors.primary100}`,
  borderRadius: '100px',
  padding: '4px 12px',
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.primary100,
  width: 'fit-content',
})

export const cardTitleStyle = style({
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: 700,
  letterSpacing: '-0.05em',
  color: colors.gray900,
  lineHeight: '1.3',
})

export const cardTitleInvertStyle = style({
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: 700,
  letterSpacing: '-0.05em',
  color: colors.white,
  lineHeight: '1.3',
})

export const cardDescStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const inviteButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '20px',
  background: colors.white,
  border: 'none',
  borderRadius: '100px',
  padding: '8px 16px',
  fontSize: fontStyles.bodyLg.fontSize,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  color: colors.primary500,
  cursor: 'pointer',
  width: 'fit-content',
  textDecoration: 'none',
  transition: 'background 0.15s, opacity 0.15s',
  selectors: {
    '&:hover': {
      background: colors.primary50,
    },
    '&:active': {
      opacity: 0.8,
    },
  },
})

export const cardImageWrapStyle = style({
  position: 'absolute',
  right: -100,
  bottom: -120,
})
