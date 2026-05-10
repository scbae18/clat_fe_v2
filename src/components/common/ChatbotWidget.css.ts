import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

/** 고정 하단 푸터(수업 상세 알림톡 바 등)와 겹치지 않도록 여유 */
export const shell = style({
  position: 'fixed',
  right: '24px',
  bottom: '100px',
  zIndex: 1200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  '@media': {
    'screen and (max-width: 640px)': {
      right: '12px',
      bottom: '88px',
    },
  },
})

export const launcher = style({
  width: '64px',
  height: '64px',
  borderRadius: '999px',
  border: `2px solid ${colors.white}`,
  cursor: 'pointer',
  padding: 0,
  overflow: 'hidden',
  flexShrink: 0,
  boxShadow: '0 10px 20px rgba(59, 81, 204, 0.35)',
  backgroundColor: colors.gray100,
  selectors: {
    '&:hover': {
      opacity: 0.92,
      transform: 'translateY(-1px)',
      boxShadow: '0 12px 24px rgba(59, 81, 204, 0.42)',
    },
    '&:active': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
})

export const launcherImage = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  pointerEvents: 'none',
})

export const panel = style({
  width: '400px',
  maxWidth: 'calc(100vw - 24px)',
  height: '580px',
  maxHeight: 'calc(100vh - 110px)',
  background: colors.white,
  border: `1px solid ${colors.gray75}`,
  borderRadius: '16px',
  boxShadow:
    '0 4px 6px rgba(54, 55, 68, 0.04), 0 12px 40px rgba(54, 55, 68, 0.12)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  marginBottom: '12px',
  '@media': {
    'screen and (max-width: 640px)': {
      width: '100%',
      maxWidth: 'calc(100vw - 12px)',
      height: '72vh',
      borderRadius: '14px',
      marginBottom: '8px',
    },
  },
})

export const header = style({
  flexShrink: 0,
  padding: '14px 16px',
  background: colors.white,
  borderBottom: `1px solid ${colors.gray75}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
})

export const headerTitle = style({
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: fontStyles.titleMd.fontWeight,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  lineHeight: '140%',
})

export const closeButton = style({
  border: 'none',
  background: 'transparent',
  color: colors.gray500,
  cursor: 'pointer',
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  selectors: {
    '&:hover': {
      backgroundColor: colors.gray50,
      color: colors.gray700,
    },
  },
})

export const closeIcon = style({
  fontSize: '22px',
  fontWeight: 300,
  lineHeight: 1,
  marginTop: '-2px',
})

export const messages = style({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  background: colors.background,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
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
  maxWidth: '90%',
  whiteSpace: 'pre-wrap',
  lineHeight: 1.55,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  letterSpacing: '-0.03em',
  padding: '11px 14px',
  borderRadius: '16px',
})

export const bubbleUser = style({
  background: colors.primary100,
  color: colors.primary700,
})

export const bubbleAssistant = style({
  background: colors.white,
  color: colors.gray700,
  border: `1px solid ${colors.gray75}`,
  boxShadow: '0 1px 2px rgba(54, 55, 68, 0.05)',
})

export const form = style({
  flexShrink: 0,
  padding: '12px 14px 16px',
  borderTop: `1px solid ${colors.gray75}`,
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-end',
  background: colors.white,
})

export const textarea = style({
  flex: 1,
  resize: 'none',
  minHeight: '44px',
  maxHeight: '120px',
  borderRadius: '12px',
  border: `1px solid ${colors.gray75}`,
  padding: '11px 14px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  fontFamily: 'inherit',
  lineHeight: 1.45,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  backgroundColor: colors.gray50,
  selectors: {
    '&:focus': {
      borderColor: colors.primary300,
      backgroundColor: colors.white,
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
  borderRadius: '12px',
  minWidth: '56px',
  height: '44px',
  padding: '0 16px',
  background: colors.primary500,
  color: colors.white,
  cursor: 'pointer',
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  flexShrink: 0,
  selectors: {
    '&:disabled': {
      background: colors.gray200,
      color: colors.gray500,
      cursor: 'not-allowed',
    },
    '&:hover:not(:disabled)': {
      background: colors.primary600,
    },
  },
})
