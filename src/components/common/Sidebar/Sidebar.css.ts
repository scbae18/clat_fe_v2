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
  marginTop: 'auto',
  marginBottom: '40px',
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
