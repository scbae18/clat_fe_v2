import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { media } from '@/styles/tokens/breakpoints'
import {
  sidebarWidthVar,
  bottomNavHeightVar,
  lessonFooterHeightVar,
  mobileTopBarHeightVar,
  attendanceBarGapVar,
} from '@/styles/layoutVars.css'

export const shellStyle = style({
  display: 'flex',
  minHeight: '100dvh',
  backgroundColor: colors.background,
  vars: {
    [sidebarWidthVar]: '240px',
    [bottomNavHeightVar]: '0px',
    [lessonFooterHeightVar]: '0px',
    [mobileTopBarHeightVar]: '0px',
    [attendanceBarGapVar]: '0px',
  },
  '@media': {
    [media.desktop]: {
      selectors: {
        '&[data-sidebar-collapsed="true"]': {
          vars: {
            [sidebarWidthVar]: '64px',
          },
        },
      },
    },
    [media.phone]: {
      vars: {
        [sidebarWidthVar]: '0px',
        [bottomNavHeightVar]: 'calc(56px + env(safe-area-inset-bottom, 0px))',
        [mobileTopBarHeightVar]: 'calc(56px + env(safe-area-inset-top, 0px))',
      },
    },
  },
  selectors: {
    '&[data-lesson-footer="true"]': {
      vars: {
        [lessonFooterHeightVar]: '72px',
      },
      '@media': {
        [media.phone]: {
          vars: {
            [lessonFooterHeightVar]: '104px',
          },
        },
      },
    },
    '&[data-attendance-bar="true"]': {
      vars: {
        [attendanceBarGapVar]: '96px',
      },
    },
  },
})

export const mainStyle = style({
  flex: 1,
  minWidth: 0,
  minHeight: '100dvh',
  marginLeft: sidebarWidthVar,
  padding: '48px',
  paddingBottom: `calc(48px + ${lessonFooterHeightVar} + ${attendanceBarGapVar})`,
  backgroundColor: colors.background,
  transition: 'margin-left 0.2s ease',
  '@media': {
    [media.phone]: {
      paddingTop: `calc(${mobileTopBarHeightVar} + 16px)`,
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingBottom: `calc(16px + ${bottomNavHeightVar} + ${lessonFooterHeightVar} + ${attendanceBarGapVar})`,
    },
  },
})
