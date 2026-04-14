import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const containerStyle = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
  backgroundColor: colors.background,
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