import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '16px',
})

export const betaCard = style({
  background: colors.primary100,
  borderRadius: '20px',
  padding: '28px 32px',
  overflow: 'hidden',
  minHeight: '200px',
  position: 'relative',
})

export const inviteCard = style({
  background: colors.primary500,
  borderRadius: '20px',
  padding: '28px 32px',
  overflow: 'hidden',
  minHeight: '200px',
  position: 'relative',
})

export const cardContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  zIndex: 1,
  position: 'relative',
})

export const tag = style({
  display: 'inline-flex',
  background: colors.primary200,
  borderRadius: '100px',
  padding: '4px 12px',
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.primary500,
  width: 'fit-content',
})

export const tagInvert = style({
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

export const title = style({
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: '700',
  letterSpacing: '-0.05em',
  color: colors.gray900,
  lineHeight: 1.3,
})

export const titleInvert = style({
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: '700',
  letterSpacing: '-0.05em',
  color: colors.white,
  lineHeight: 1.3,
})

export const desc = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: '600',
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const inviteButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '20px',
  background: colors.white,
  border: 'none',
  borderRadius: '100px',
  padding: '8px 16px',
  fontSize: fontStyles.bodyLg.fontSize,
  fontWeight: '700',
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

export const imageWrap = style({
  position: 'absolute',
  right: -100,
  bottom: -120,
  pointerEvents: 'none',
})
