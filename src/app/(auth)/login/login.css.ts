import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { media } from '@/styles/tokens/breakpoints'

export const containerStyle = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  minHeight: '100dvh',
  padding: '24px 0',
  paddingTop: 'calc(24px + env(safe-area-inset-top, 0px))',
  paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
  backgroundColor: colors.background,
  '@media': {
    [media.phone]: {
      alignItems: 'flex-start',
    },
  },
})

export const loginBoxStyle = style({
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0 20px',
})

export const logoSectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '40px',
  marginBottom: '60px',
})

export const formStyle = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const submitButtonStyle = style({
  marginTop: '24px',
})

export const footerLinkStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginTop: '24px',
})

export const footerLinkAnchorStyle = style({
  textDecoration: 'none',
  cursor: 'pointer',
  color: 'inherit',
})