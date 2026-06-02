import { keyframes, style } from '@vanilla-extract/css'
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
  transition: 'transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease',
  selectors: {
    '&:hover': {
      opacity: 0.92,
      transform: 'translateY(-2px)',
      boxShadow: '0 14px 28px rgba(59, 81, 204, 0.45)',
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
  borderRadius: '20px',
  boxShadow:
    '0 4px 6px rgba(54, 55, 68, 0.04), 0 16px 48px rgba(54, 55, 68, 0.14)',
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
  flexShrink: 0,
  padding: '14px 16px',
  background: colors.white,
  borderBottom: `1px solid ${colors.gray75}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
})

export const headerLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
})

export const headerAvatar = style({
  width: '34px',
  height: '34px',
  borderRadius: '10px',
  overflow: 'hidden',
  flexShrink: 0,
  border: `1px solid ${colors.gray75}`,
})

export const headerAvatarImage = style({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

export const headerTitle = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  lineHeight: '130%',
})

export const headerSubtitle = style({
  fontSize: '11px',
  fontWeight: 400,
  color: colors.gray300,
  letterSpacing: '-0.02em',
  lineHeight: '130%',
  marginTop: '1px',
})

export const headerActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
})

export const iconButton = style({
  border: 'none',
  background: 'transparent',
  color: colors.gray300,
  cursor: 'pointer',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'background 0.12s ease, color 0.12s ease',
  selectors: {
    '&:hover': {
      backgroundColor: colors.gray50,
      color: colors.gray700,
    },
  },
})

export const messages = style({
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  background: colors.background,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
})

export const rowUser = style({
  display: 'flex',
  justifyContent: 'flex-end',
})

export const rowAssistant = style({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  gap: '6px',
})

export const avatarDot = style({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${colors.primary300}, ${colors.primary500})`,
  flexShrink: 0,
  marginBottom: '2px',
})

export const bubbleBase = style({
  maxWidth: '82%',
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  letterSpacing: '-0.02em',
  padding: '10px 14px',
  borderRadius: '16px',
})

export const bubbleUser = style({
  background: colors.primary500,
  color: colors.white,
  borderBottomRightRadius: '4px',
})

export const bubbleAssistant = style({
  background: colors.white,
  color: colors.gray700,
  border: `1px solid ${colors.gray75}`,
  boxShadow: '0 1px 3px rgba(54, 55, 68, 0.06)',
  borderBottomLeftRadius: '4px',
})

/** 퀵 리플라이 버튼 묶음 */
export const quickReplies = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  paddingLeft: '30px',
})

export const quickReplyButton = style({
  border: `1px solid ${colors.primary200}`,
  borderRadius: '999px',
  padding: '6px 14px',
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '-0.02em',
  color: colors.primary600,
  background: colors.primary50,
  cursor: 'pointer',
  transition: 'background 0.12s ease, border-color 0.12s ease, transform 0.1s ease',
  selectors: {
    '&:hover': {
      background: colors.primary100,
      borderColor: colors.primary300,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
})

/** 타이핑 인디케이터 */
const bounce = keyframes({
  '0%, 80%, 100%': { transform: 'translateY(0)', opacity: 0.4 },
  '40%': { transform: 'translateY(-5px)', opacity: 1 },
})

export const typingBubble = style({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  padding: '12px 16px',
  minWidth: '52px',
})

export const dot = style({
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  background: colors.gray300,
  animation: `${bounce} 1.2s ease infinite`,
  selectors: {
    '&:nth-child(2)': {
      animationDelay: '0.2s',
    },
    '&:nth-child(3)': {
      animationDelay: '0.4s',
    },
  },
})

export const form = style({
  flexShrink: 0,
  padding: '12px 14px 16px',
  borderTop: `1px solid ${colors.gray75}`,
  display: 'flex',
  gap: '8px',
  alignItems: 'flex-end',
  background: colors.white,
})

export const textarea = style({
  flex: 1,
  resize: 'none',
  minHeight: '44px',
  maxHeight: '120px',
  borderRadius: '12px',
  border: `1px solid ${colors.gray100}`,
  padding: '11px 14px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  fontFamily: 'inherit',
  lineHeight: 1.45,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  backgroundColor: colors.gray50,
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
  selectors: {
    '&:focus': {
      borderColor: colors.primary300,
      backgroundColor: colors.white,
      boxShadow: `0 0 0 3px ${colors.primary100}`,
      outline: 'none',
    },
    '&::placeholder': {
      color: colors.gray300,
      fontSize: '12px',
    },
  },
})

export const sendButton = style({
  border: 'none',
  borderRadius: '12px',
  width: '44px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: colors.primary500,
  color: colors.white,
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background 0.12s ease, transform 0.1s ease',
  selectors: {
    '&:disabled': {
      background: colors.gray100,
      color: colors.gray300,
      cursor: 'not-allowed',
      transform: 'none',
    },
    '&:hover:not(:disabled)': {
      background: colors.primary600,
      transform: 'translateY(-1px)',
    },
    '&:active:not(:disabled)': {
      transform: 'translateY(0)',
    },
  },
})

/** 기존 코드 호환용 — 더 이상 사용 안 함 */
export const closeButton = iconButton
export const closeIcon = style({ display: 'none' })
export const headerTitle_legacy = headerTitle
