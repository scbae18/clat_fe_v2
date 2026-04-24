import { style } from '@vanilla-extract/css'
import { styleVariants } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const sidebarStyle = style({
  width: '240px',
  height: '100vh',
  backgroundColor: colors.gray900,
  display: 'flex',
  flexDirection: 'column',
  padding: '2px 0',
  position: 'fixed',
  top: 0,
  left: 0,
})

export const sidebarTopStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '56px 36px',
})

export const navStyle = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '8px',
  padding: '0 24px',
})

export const navItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  height: '48px',
  padding: '0 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: fontStyles.titleMd.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  color: colors.gray600,
  textDecoration: 'none',
  transition: 'color 0.2s',
  ':hover': {
    color: colors.gray300,
  },
})

export const navItemActiveStyle = style({
  color: colors.white,
  fontWeight: fontStyles.titleMd.fontWeight,
})

export const logoutButtonStyle = style({
  marginBottom: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '0 16px',
  color: colors.gray600,
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: fontStyles.titleMd.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  transition: 'all 0.2s',
  ':hover': {
    color: colors.gray300,
  },
})

export const userCardStyle = style({
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
  ':hover': {
    background: 'rgba(255,255,255,0.06)',
    color: colors.white,
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

export const userTextWrapStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
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
