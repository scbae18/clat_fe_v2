import { style } from '@vanilla-extract/css'
import { zIndex } from '@/styles/tokens/zIndex'
import { media } from '@/styles/tokens/breakpoints'
import {
  sidebarWidthVar,
  bottomNavHeightVar,
  lessonFooterHeightVar,
} from '@/styles/layoutVars.css'

export const slotStyle = style({
  position: 'fixed',
  left: `calc(${sidebarWidthVar} + 48px)`,
  right: '48px',
  bottom: `calc(${bottomNavHeightVar} + ${lessonFooterHeightVar} + 32px)`,
  zIndex: zIndex.floatingBar,
  pointerEvents: 'none',
  '@media': {
    [media.phone]: {
      left: '16px',
      right: '16px',
      bottom: `calc(${bottomNavHeightVar} + ${lessonFooterHeightVar} + 12px)`,
    },
  },
})

export const slotInnerStyle = style({
  pointerEvents: 'auto',
})
