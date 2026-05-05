import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const shell = style({
  position: 'fixed',
  right: '24px',
  bottom: '24px',
  zIndex: 1200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  '@media': {
    'screen and (max-width: 640px)': {
      right: '12px',
      bottom: '12px',
    },
  },
})

export const launcher = style({
  minWidth: '64px',
  height: '64px',
  borderRadius: '999px',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 10px 20px rgba(59, 81, 204, 0.35)',
  background: colors.primary500,
  color: colors.white,
  fontSize: '22px',
  fontWeight: 700,
  padding: '0 18px',
  selectors: {
    '&:hover': {
      background: colors.primary600,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      background: colors.primary700,
      transform: 'translateY(0)',
    },
  },
})

export const panel = style({
  width: '420px',
  maxWidth: 'calc(100vw - 24px)',
  height: '620px',
  maxHeight: 'calc(100vh - 110px)',
  background: colors.white,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '20px',
  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  marginBottom: '12px',
  '@media': {
    'screen and (max-width: 640px)': {
      width: '100%',
      maxWidth: 'calc(100vw - 12px)',
      height: '72vh',
      borderRadius: '16px',
      marginBottom: '8px',
    },
  },
})

export const header = style({
  padding: '14px 16px 10px',
  background: colors.primary500,
  color: colors.white,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const headerTitleWrap = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const headerTitle = style({
  fontSize: '16px',
  lineHeight: 1.25,
})

export const headerSub = style({
  fontSize: '12px',
  color: colors.primary100,
  fontWeight: 500,
})

export const closeButton = style({
  border: 'none',
  background: 'transparent',
  color: colors.white,
  cursor: 'pointer',
  fontSize: '20px',
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  selectors: {
    '&:hover': {
      background: 'rgba(255,255,255,0.16)',
    },
  },
})

export const messages = style({
  flex: 1,
  overflowY: 'auto',
  padding: '12px 14px',
  background: colors.gray50,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const rowUser = style({
  display: 'flex',
  justifyContent: 'flex-end',
})

export const rowAssistant = style({
  display: 'flex',
  justifyContent: 'flex-start',
})

export const bubbleBase = style({
  maxWidth: '88%',
  whiteSpace: 'pre-wrap',
  lineHeight: 1.5,
  fontSize: '14px',
  padding: '10px 12px',
  borderRadius: '14px',
})

export const bubbleUser = style({
  background: colors.primary400,
  color: colors.white,
  borderBottomRightRadius: '6px',
})

export const bubbleAssistant = style({
  background: colors.white,
  color: colors.gray700,
  border: `1px solid ${colors.gray100}`,
  borderBottomLeftRadius: '6px',
})

export const form = style({
  padding: '12px',
  borderTop: `1px solid ${colors.gray100}`,
  display: 'flex',
  gap: '8px',
  background: colors.white,
})

export const textarea = style({
  flex: 1,
  resize: 'none',
  borderRadius: '10px',
  border: `1px solid ${colors.gray200}`,
  padding: '10px 12px',
  fontSize: '14px',
  fontFamily: 'inherit',
  lineHeight: 1.45,
  selectors: {
    '&:focus': {
      borderColor: colors.primary400,
      boxShadow: `0 0 0 3px ${colors.primary100}`,
      outline: 'none',
    },
    '&::placeholder': {
      color: colors.gray500,
    },
  },
})

export const sendButton = style({
  border: 'none',
  borderRadius: '10px',
  minWidth: '62px',
  padding: '0 14px',
  background: colors.primary500,
  color: colors.white,
  cursor: 'pointer',
  fontWeight: 600,
  selectors: {
    '&:disabled': {
      background: colors.gray300,
      cursor: 'not-allowed',
    },
    '&:hover:not(:disabled)': {
      background: colors.primary600,
    },
  },
})
