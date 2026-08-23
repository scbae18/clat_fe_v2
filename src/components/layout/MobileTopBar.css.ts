import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { media } from '@/styles/tokens/breakpoints'
import { zIndex } from '@/styles/tokens/zIndex'
import { mobileTopBarHeightVar } from '@/styles/layoutVars.css'

export const topBarStyle = style({
  display: 'none',
  '@media': {
    [media.phone]: {
      display: 'flex',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: mobileTopBarHeightVar,
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingLeft: '16px',
      paddingRight: '16px',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderBottom: `1px solid ${colors.gray75}`,
      zIndex: zIndex.bottomNav,
    },
  },
})

export const logoLinkStyle = style({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
})

export const logoStyle = style({
  display: 'block',
  height: '22px',
  width: 'auto',
})
