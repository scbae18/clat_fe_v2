import { style, styleVariants } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

const sidebarBase = style({
  height: '100vh',
  backgroundColor: colors.gray900,
  display: 'flex',
  flexDirection: 'column',
  padding: '2px 0',
  position: 'fixed',
  top: 0,
  left: 0,
  overflow: 'hidden',
  transition: 'width 0.2s ease',
  zIndex: 100,
  '@media': {
    [media.phone]: {
      display: 'none',
    },
  },
})

export const sidebarStyle = styleVariants({
  expanded: [sidebarBase, { width: '240px' }],
  collapsed: [sidebarBase, { width: '64px' }],
})

export const sidebarTopStyle = styleVariants({
  expanded: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '56px 24px 56px 36px',
    gap: '8px',
  },
  collapsed: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 8px 24px',
    gap: '12px',
  },
})

export const toggleButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: 'none',
  background: 'rgba(255,255,255,0.06)',
  color: colors.gray500,
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background 0.2s, color 0.2s',
  selectors: {
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
      color: colors.white,
    },
  },
})

export const navStyle = styleVariants({
  expanded: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '8px',
    padding: '0 24px',
  },
  collapsed: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '8px',
    padding: '0 8px',
  },
})

const navItemBase = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  height: '48px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: fontStyles.titleMd.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  color: colors.gray600,
  textDecoration: 'none',
  transition: 'color 0.2s, background 0.2s',
  flexShrink: 0,
  selectors: {
    '&:hover': {
      color: colors.gray300,
    },
  },
} as const

export const navItemStyle = styleVariants({
  expanded: [
    navItemBase,
    {
      gap: '16px',
      padding: '0 16px',
    },
  ],
  collapsed: [
    navItemBase,
    {
      justifyContent: 'center',
      padding: 0,
      width: '100%',
    },
  ],
})

export const navItemActiveStyle = style({
  color: colors.white,
  fontWeight: fontStyles.titleMd.fontWeight,
  background: 'rgba(255,255,255,0.08)',
})

export const navLabelStyle = styleVariants({
  expanded: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: 1,
    transition: 'opacity 0.15s ease',
  },
  collapsed: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'hidden',
    opacity: 0,
    pointerEvents: 'none',
  },
})

export const logoutButtonStyle = styleVariants({
  expanded: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '0 16px',
    height: '48px',
    color: colors.gray600,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    fontSize: fontStyles.titleMd.fontSize,
    fontWeight: fontStyles.titleMd.fontWeight,
    letterSpacing: '-0.03em',
    lineHeight: '140%',
    transition: 'all 0.2s',
    selectors: {
      '&:hover': {
        color: colors.gray300,
      },
    },
  },
  collapsed: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '48px',
    padding: 0,
    color: colors.gray600,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    transition: 'all 0.2s',
    selectors: {
      '&:hover': {
        color: colors.gray300,
      },
    },
  },
})

export const userCardStyle = styleVariants({
  expanded: {
    marginTop: 'auto',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: colors.gray300,
    transition: 'background 0.2s, color 0.2s',
    selectors: {
      '&:hover': {
        background: 'rgba(255,255,255,0.06)',
        color: colors.white,
      },
    },
  },
  collapsed: {
    marginTop: 'auto',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 0',
    borderRadius: '12px',
    textDecoration: 'none',
    color: colors.gray300,
    transition: 'background 0.2s, color 0.2s',
    selectors: {
      '&:hover': {
        background: 'rgba(255,255,255,0.06)',
        color: colors.white,
      },
    },
  },
})

export const userCardActiveStyle = style({
  background: 'rgba(255,255,255,0.08)',
  color: colors.white,
})

export const userAvatarStyle = style({
  flexShrink: 0,
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${colors.primary300} 0%, ${colors.primary500} 100%)`,
  color: colors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '-0.03em',
})

export const userTextWrapStyle = styleVariants({
  expanded: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  collapsed: {
    display: 'none',
  },
})

export const userNameStyle = style({
  fontSize: '13px',
  fontWeight: 600,
  lineHeight: 1.3,
  letterSpacing: '-0.03em',
  color: 'inherit',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const userEmailStyle = style({
  fontSize: '11px',
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '-0.03em',
  color: colors.gray500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})
