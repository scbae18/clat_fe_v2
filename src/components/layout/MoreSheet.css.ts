import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { zIndex } from '@/styles/tokens/zIndex'
import { media } from '@/styles/tokens/breakpoints'
import { bottomNavHeightVar } from '@/styles/layoutVars.css'

export const overlayStyle = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: bottomNavHeightVar,
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(4px)',
  zIndex: zIndex.moreSheet,
  '@media': {
    [media.desktop]: {
      display: 'none',
    },
  },
})

export const sheetStyle = style({
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: bottomNavHeightVar,
  backgroundColor: colors.white,
  borderRadius: '24px 24px 0 0',
  padding: '12px 16px 16px',
  zIndex: zIndex.moreSheet,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  '@media': {
    [media.desktop]: {
      display: 'none',
    },
  },
})

export const handleStyle = style({
  width: '36px',
  height: '4px',
  borderRadius: '999px',
  backgroundColor: colors.gray100,
  margin: '0 auto 8px',
})

export const itemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minHeight: '48px',
  padding: '0 12px',
  borderRadius: '12px',
  color: colors.gray700,
  textDecoration: 'none',
  border: 'none',
  background: 'none',
  width: '100%',
  cursor: 'pointer',
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: fontStyles.titleMd.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  fontFamily: 'Pretendard, sans-serif',
  textAlign: 'left',
  selectors: {
    '&:active': {
      backgroundColor: colors.gray50,
    },
  },
})

export const itemActiveStyle = style({
  color: colors.primary500,
  backgroundColor: colors.primary50,
})

export const logoutStyle = style({
  color: colors.gray500,
})
