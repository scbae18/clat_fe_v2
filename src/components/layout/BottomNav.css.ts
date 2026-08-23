import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'
import { zIndex } from '@/styles/tokens/zIndex'
import { bottomNavHeightVar } from '@/styles/layoutVars.css'

export const navStyle = style({
  display: 'none',
  '@media': {
    [media.phone]: {
      display: 'flex',
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      height: bottomNavHeightVar,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      backgroundColor: colors.white,
      borderTop: `1px solid ${colors.gray75}`,
      zIndex: zIndex.bottomNav,
      paddingTop: '4px',
    },
  },
})

export const itemStyle = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  minHeight: '48px',
  border: 'none',
  background: 'none',
  color: colors.gray500,
  cursor: 'pointer',
  textDecoration: 'none',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  selectors: {
    '&:active': {
      color: colors.primary500,
    },
  },
})

export const itemActiveStyle = style({
  color: colors.primary500,
  fontWeight: 600,
})
