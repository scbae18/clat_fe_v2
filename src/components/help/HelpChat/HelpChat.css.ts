import { keyframes, style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { zIndex } from '@/styles/tokens/zIndex'
import {
  attendanceBarGapVar,
  bottomNavHeightVar,
  lessonFooterHeightVar,
  mobileTopBarHeightVar,
} from '@/styles/layoutVars.css'

const lift = `calc(${bottomNavHeightVar} + ${lessonFooterHeightVar} + ${attendanceBarGapVar} + 16px)`

const riseIn = keyframes({
  from: { transform: 'translateY(12px) scale(0.98)' },
  to: { transform: 'translateY(0) scale(1)' },
})

const bubbleIn = keyframes({
  from: { transform: 'translateY(8px)' },
  to: { transform: 'translateY(0)' },
})

const caretBlink = keyframes({
  '0%, 45%': { opacity: 1 },
  '50%, 100%': { opacity: 0 },
})

const dotBounce = keyframes({
  '0%, 80%, 100%': { transform: 'translateY(0)', opacity: 0.35 },
  '40%': { transform: 'translateY(-4px)', opacity: 1 },
})

const reduced = {
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
} as const

export const dockStyle = style({
  position: 'fixed',
  right: '16px',
  bottom: lift,
  zIndex: zIndex.chatbot,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '10px',
  pointerEvents: 'none',
})

export const panelStyle = style({
  pointerEvents: 'auto',
  width: 'min(440px, calc(100vw - 24px))',
  height: `min(720px, calc(100dvh - ${lift} - ${mobileTopBarHeightVar} - 72px))`,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray75}`,
  borderRadius: '24px',
  boxShadow: '0 18px 48px rgba(54, 55, 68, 0.16)',
  overflow: 'hidden',
  transformOrigin: 'bottom right',
  animation: `${riseIn} 0.22s ease`,
  ...reduced,
})

export const headerStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '16px',
  backgroundColor: colors.white,
  borderBottom: `1px solid ${colors.gray75}`,
})

export const titleBlockStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
  flex: 1,
})

export const titleStyle = style({
  position: 'relative',
  margin: 0,
  display: 'flex',
  alignItems: 'center',
})

export const brandLogoStyle = style({
  display: 'block',
  height: '32px',
  width: 'auto',
})

export const srOnlyStyle = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
})

export const headerActionsStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  flexShrink: 0,
})

export const resetStyle = style({
  border: 'none',
  backgroundColor: colors.white,
  color: colors.gray700,
  cursor: 'pointer',
  height: '32px',
  padding: '0 8px',
  borderRadius: '10px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  selectors: {
    '&:hover:not(:disabled)': { backgroundColor: colors.primary50, color: colors.primary700 },
    '&:disabled': { cursor: 'not-allowed', color: colors.gray300 },
  },
})

export const closeStyle = style({
  width: '32px',
  height: '32px',
  border: 'none',
  borderRadius: '10px',
  backgroundColor: colors.white,
  color: colors.gray600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  selectors: {
    '&:hover': { backgroundColor: colors.primary50, color: colors.primary600 },
  },
})

export const logStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '18px 16px',
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  backgroundColor: colors.white,
})

export const emptyStyle = style({
  animation: `${bubbleIn} 0.24s ease`,
  ...reduced,
})

export const metaStyle = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  color: colors.gray600,
})

export const chipRowStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '8px',
  width: '100%',
})

export const chipStyle = style({
  width: '100%',
  border: `1px solid ${colors.gray200}`,
  backgroundColor: colors.white,
  color: colors.gray900,
  borderRadius: '999px',
  padding: '10px 14px',
  cursor: 'pointer',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  textAlign: 'left',
  selectors: {
    '&:hover:not(:disabled)': {
      borderColor: colors.primary300,
      color: colors.primary700,
    },
    '&:disabled': { cursor: 'not-allowed', opacity: 0.6 },
  },
})

export const rowStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  animation: `${bubbleIn} 0.2s ease`,
  ...reduced,
})

export const userRowStyle = style({
  justifyContent: 'flex-end',
})

export const miniAvatarStyle = style({
  width: '32px',
  height: '32px',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  backgroundColor: colors.primary500,
  color: colors.white,
})

export const bubbleStyle = style({
  maxWidth: 'calc(100% - 40px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  alignItems: 'stretch',
  backgroundColor: colors.gray50,
  borderRadius: '18px',
  padding: '14px',
})

export const userBubbleStyle = style({
  maxWidth: '86%',
  margin: 0,
  backgroundColor: colors.primary500,
  color: colors.white,
  borderRadius: '16px 16px 4px 16px',
  padding: '10px 12px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '150%',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
})

export const emphasisStyle = style({
  fontWeight: '700',
})

export const assistantTextStyle = style({
  margin: 0,
  color: colors.gray900,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: '400',
  lineHeight: '165%',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
})

export const caretStyle = style({
  display: 'inline-block',
  width: '2px',
  height: '1em',
  marginLeft: '2px',
  verticalAlign: '-2px',
  backgroundColor: colors.primary500,
  animation: `${caretBlink} 0.9s steps(1) infinite`,
  ...reduced,
})

export const linkCaptionStyle = style({
  margin: '0 0 6px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  color: colors.gray600,
})

export const linkRowStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '8px',
  animation: `${bubbleIn} 0.2s ease`,
  ...reduced,
})

export const linkStyle = style({
  display: 'flex',
  alignItems: 'center',
  minHeight: '40px',
  padding: '0 14px',
  borderRadius: '999px',
  border: `1px solid ${colors.gray200}`,
  backgroundColor: colors.white,
  color: colors.primary700,
  textDecoration: 'none',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  selectors: {
    '&:hover': { borderColor: colors.primary300, backgroundColor: colors.primary50 },
  },
})

export const thinkingStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: colors.gray50,
  borderRadius: '18px',
  padding: '12px 14px',
})

export const thinkingLabelStyle = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  color: colors.gray600,
})

export const dotsStyle = style({
  display: 'inline-flex',
  gap: '4px',
})

export const dotStyle = style({
  width: '6px',
  height: '6px',
  borderRadius: '999px',
  backgroundColor: colors.primary400,
  animation: `${dotBounce} 1s ease-in-out infinite`,
  selectors: {
    '&:nth-child(2)': { animationDelay: '0.15s' },
    '&:nth-child(3)': { animationDelay: '0.3s' },
  },
  ...reduced,
})

export const formStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 14px 14px',
  backgroundColor: colors.white,
})

export const inputStyle = style({
  flex: 1,
  minWidth: 0,
  resize: 'none',
  border: `1px solid ${colors.gray200}`,
  borderRadius: '22px',
  padding: '12px 14px',
  minHeight: '44px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  lineHeight: '150%',
  color: colors.gray900,
  backgroundColor: colors.white,
  selectors: {
    '&:focus': {
      outline: 'none',
      borderColor: colors.primary300,
      backgroundColor: colors.white,
      boxShadow: `0 0 0 3px ${colors.primary100}`,
    },
    '&::placeholder': { color: colors.gray500 },
  },
})

export const sendStyle = style({
  border: 'none',
  cursor: 'pointer',
  width: '40px',
  height: '40px',
  padding: 0,
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.primary500,
  color: colors.white,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  flexShrink: 0,
  selectors: {
    '&:hover:not(:disabled)': { backgroundColor: colors.primary600 },
    '&:disabled': {
      cursor: 'not-allowed',
      backgroundColor: colors.primary200,
      color: colors.white,
    },
  },
})

export const launcherStyle = style({
  pointerEvents: 'auto',
  border: 'none',
  cursor: 'pointer',
  height: '46px',
  padding: '0 16px 0 12px',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: colors.primary500,
  color: colors.white,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  boxShadow: '0 8px 20px rgba(59, 81, 204, 0.28)',
  transition: 'transform 0.18s ease, background-color 0.18s ease',
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary600,
      transform: 'translateY(-2px)',
    },
  },
  ...reduced,
})

export const launcherOpenStyle = style({
  backgroundColor: colors.primary700,
})

export const launcherIconStyle = style({
  width: '26px',
  height: '26px',
  borderRadius: '999px',
  backgroundColor: 'rgba(255, 255, 255, 0.18)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
})
