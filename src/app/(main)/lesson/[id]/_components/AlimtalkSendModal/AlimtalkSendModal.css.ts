import { style, keyframes } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

const slideIn = keyframes({
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(0)' },
})

const slideOut = keyframes({
  from: { transform: 'translateX(0)' },
  to: { transform: 'translateX(100%)' },
})

const bounceDot = keyframes({
  '0%, 80%, 100%': {
    transform: 'translateY(0) scale(0.85)',
    opacity: 0.45,
  },
  '40%': {
    transform: 'translateY(-6px) scale(1)',
    opacity: 1,
  },
})

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  justifyContent: 'flex-end',
  zIndex: 100,
})

export const drawer = style({
  width: 'min(960px, 100vw)',
  height: '100%',
  position: 'relative',
  backgroundColor: colors.gray50,
  boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  animation: `${slideIn} 0.3s ease-out`,
})

export const drawerClosing = style({
  animation: `${slideOut} 0.3s ease-in forwards`,
})

export const header = style({
  padding: '20px 24px',
  borderBottom: `1px solid ${colors.gray100}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexShrink: 0,
})

export const body = style({
  flex: 1,
  display: 'flex',
  minHeight: 0,
  overflow: 'hidden',
})

export const leftCol = style({
  width: '340px',
  flexShrink: 0,
  borderRight: `1px solid ${colors.gray100}`,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colors.white,
})

export const rightCol = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  padding: '24px',
  overflowY: 'auto',
  gap: '16px',
})

export const closeButton = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: colors.gray500,
  display: 'flex',
  alignItems: 'center',
})

export const selectAllRow = style({
  padding: '12px 16px',
  borderBottom: `1px solid ${colors.gray100}`,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
})

export const studentList = style({
  flex: 1,
  overflowY: 'auto',
})

export const studentRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '12px 16px',
  borderBottom: `1px solid ${colors.gray50}`,
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.gray50,
    },
  },
})

export const studentRowFocused = style({
  backgroundColor: colors.primary50,
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary100,
    },
  },
})

export const checkbox = style({
  width: '18px',
  height: '18px',
  accentColor: colors.primary500,
  flexShrink: 0,
  marginTop: '2px',
})

export const studentMeta = style({
  flex: 1,
  minWidth: 0,
})

export const phoneMuted = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  color: colors.gray500,
  marginTop: '4px',
})

export const previewSectionLabel = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: 600,
  color: colors.gray700,
  marginBottom: '8px',
})

export const previewBox = style({
  backgroundColor: colors.white,
  padding: '16px',
  borderRadius: '12px',
  whiteSpace: 'pre-wrap',
  color: colors.gray700,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '180%',
  border: `1px solid ${colors.gray100}`,
})

export const footer = style({
  padding: '16px 24px',
  borderTop: `1px solid ${colors.gray100}`,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  flexShrink: 0,
  backgroundColor: colors.white,
})

export const sendingOverlay = style({
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.28)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 5,
  padding: '24px',
})

export const sendingModal = style({
  minWidth: '280px',
  maxWidth: '420px',
  backgroundColor: colors.white,
  borderRadius: '14px',
  border: `1px solid ${colors.gray100}`,
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.2)',
  padding: '24px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  textAlign: 'center',
})

export const loadingDots = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  marginTop: '2px',
})

export const loadingDot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: colors.primary500,
  animation: `${bounceDot} 1.2s infinite ease-in-out`,
})

export const loadingDotDelay1 = style({
  animationDelay: '0.15s',
})

export const loadingDotDelay2 = style({
  animationDelay: '0.3s',
})
