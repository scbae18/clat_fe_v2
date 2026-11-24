import { style, keyframes } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'
import { zIndex } from '@/styles/tokens/zIndex'
import { truncateRules } from '@/styles/tokens/textOverflow'

const kakaoChat = '#C9DBEA'
const kakaoHeaderYellow = '#FEE501'

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
  zIndex: zIndex.modal,
  overscrollBehavior: 'none',
})

export const drawerShell = style({
  height: '100%',
  maxWidth: '100vw',
  display: 'flex',
  alignItems: 'flex-end',
  animation: `${slideIn} 0.3s ease-out`,
  '@media': {
    [media.phone]: {
      width: '100%',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
})

export const drawer = style({
  width: 'min(960px, 100%)',
  maxWidth: '960px',
  height: '100%',
  position: 'relative',
  zIndex: 1,
  backgroundColor: colors.gray50,
  boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  '@media': {
    [media.phone]: {
      width: '100%',
      maxWidth: '100%',
      height: 'auto',
      flex: 1,
      minHeight: 0,
    },
  },
})

export const drawerClosing = style({
  animation: `${slideOut} 0.3s ease-in forwards`,
})

export const header = style({
  padding: '20px 24px',
  paddingTop: 'calc(20px + env(safe-area-inset-top, 0px))',
  borderBottom: `1px solid ${colors.gray100}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexShrink: 0,
  gap: '16px',
  '@media': {
    [media.phone]: {
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingBottom: '16px',
    },
  },
})

export const headerActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
})

export const body = style({
  flex: 1,
  display: 'flex',
  minHeight: 0,
  overflow: 'hidden',
})

export const leftCol = style({
  width: '296px',
  flexShrink: 0,
  minWidth: 0,
  borderRight: `1px solid ${colors.gray100}`,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colors.white,
  minHeight: 0,
  '@media': {
    [media.phone]: {
      width: '156px',
    },
  },
})

export const audienceBlock = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '25px 27px 0',
  '@media': {
    [media.phone]: {
      padding: '16px 10px 0',
    },
  },
})

export const audienceTitle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const rightCol = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  minHeight: 0,
  padding: '24px',
  overflowY: 'auto',
  overscrollBehavior: 'contain',
  gap: '16px',
  '@media': {
    [media.phone]: {
      padding: '16px 12px',
    },
  },
})

export const closeButton = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: colors.gray500,
  display: 'flex',
  alignItems: 'center',
})

export const channelRow = style({
  display: 'flex',
  gap: '4px',
  height: '40px',
  marginTop: '15px',
})

export const channelCheck = style({
  flex: 1,
  minWidth: 0,
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px 6px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: colors.gray50,
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
})

export const channelCheckActive = style({
  backgroundColor: colors.primary50,
  border: `1px solid ${colors.primary400}`,
})

export const studentSection = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  marginTop: '42px',
})

export const listHead = style({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '0 27px',
  marginBottom: '15px',
  '@media': {
    [media.phone]: {
      padding: '0 10px',
    },
  },
})

export const selectAll = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  cursor: 'pointer',
  flexShrink: 0,
})

export const listMessage = style({
  padding: '15px 27px',
  '@media': {
    [media.phone]: {
      padding: '12px 10px',
    },
  },
})

export const studentRowDisabled = style({
  opacity: 0.45,
  cursor: 'default',
  selectors: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
})

export const studentList = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overscrollBehavior: 'contain',
})

export const studentRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '10px 27px',
  borderTop: `1px solid ${colors.gray100}`,
  cursor: 'pointer',
  selectors: {
    '&:last-child': {
      borderBottom: `1px solid ${colors.gray100}`,
    },
    '&:hover': {
      backgroundColor: colors.gray50,
    },
  },
  '@media': {
    [media.phone]: {
      gap: '8px',
      padding: '12px 10px',
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

export const checkSlot = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  height: '25px',
  flexShrink: 0,
})

export const checkInput = style({
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

export const checkBox = style({
  width: '14px',
  height: '14px',
  boxSizing: 'border-box',
  borderRadius: '4px',
  border: `1px solid ${colors.gray300}`,
  backgroundColor: colors.white,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  selectors: {
    [`${checkInput}:checked + &`]: {
      backgroundColor: colors.primary500,
      borderColor: colors.primary500,
    },
    [`${checkInput}:focus-visible + &`]: {
      outline: `2px solid ${colors.primary400}`,
      outlineOffset: '2px',
    },
    [`${checkInput}:disabled + &`]: {
      opacity: 0.45,
    },
  },
})

export const checkMark = style({
  display: 'none',
  width: '8px',
  height: '4px',
  marginTop: '-1px',
  borderLeft: '1.5px solid white',
  borderBottom: '1.5px solid white',
  transform: 'rotate(-45deg)',
  selectors: {
    [`${checkInput}:checked + ${checkBox} > &`]: {
      display: 'block',
    },
  },
})

export const studentMeta = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
})

export const studentName = style([
  {
    flex: 1,
    minWidth: 0,
  },
  truncateRules,
])

export const phoneBlock = style({
  display: 'flex',
  flexDirection: 'column',
})

export const phoneLine = style({
  display: 'grid',
  gridTemplateColumns: '36px minmax(0, 1fr)',
  columnGap: '9px',
  alignItems: 'center',
})

export const lengthLine = style({
  marginTop: '8px',
})

export const overLimit = style({
  display: 'block',
  margin: '2px 0 0',
})

export const lengthBody = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginTop: '44px',
  marginBottom: '36px',
  gap: '4px',
})

export const lengthTitle = style({
  marginBottom: '8px',
})

export const phoneValue = style({
  fontVariantNumeric: 'tabular-nums',
  minWidth: 0,
  whiteSpace: 'normal',
  overflowWrap: 'break-word',
})

export const studentNameRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 0,
})

export const previewStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minWidth: 0,
})

export const kakaoCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  minWidth: 0,
})

export const kakaoShell = style({
  backgroundColor: kakaoChat,
  borderRadius: '16px',
  padding: '16px 16px 16px 24px',
  minWidth: 0,
  '@media': {
    [media.phone]: {
      padding: '12px',
    },
  },
})

export const kakaoLogoRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const kakaoLogo = style({
  width: '36px',
  height: '36px',
  borderRadius: '14px',
  backgroundColor: colors.white,
  objectFit: 'cover',
  flexShrink: 0,
})

export const kakaoAppLabel = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray600,
})

export const kakaoBubbleRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '8px',
  marginTop: '1px',
  marginLeft: '44px',
  minWidth: 0,
  '@media': {
    [media.phone]: {
      marginLeft: '0',
    },
  },
})

export const kakaoBubble = style({
  flex: 1,
  minWidth: 0,
  maxWidth: '376px',
  backgroundColor: colors.white,
  borderRadius: '20px',
  overflow: 'hidden',
})

export const kakaoArrive = style({
  backgroundColor: kakaoHeaderYellow,
  padding: '12px 16px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 400,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const kakaoBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
})

export const kakaoMessage = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
})

export const kakaoCta = style({
  backgroundColor: colors.gray50,
  borderRadius: '8px',
  padding: '12px',
  textAlign: 'center',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 400,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray600,
})

export const kakaoTime = style({
  flexShrink: 0,
  margin: 0,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray600,
  whiteSpace: 'nowrap',
})

export const footer = style({
  padding: '10px 24px',
  paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
  borderTop: `1px solid ${colors.gray100}`,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  flexShrink: 0,
  backgroundColor: colors.white,
  '@media': {
    [media.phone]: {
      paddingLeft: '16px',
      paddingRight: '16px',
      flexWrap: 'wrap',
    },
  },
})

export const schedulePick = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '8px',
  padding: '12px 24px',
  borderTop: `1px solid ${colors.gray100}`,
  backgroundColor: colors.white,
  flexWrap: 'wrap',
  '@media': {
    [media.phone]: {
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
})

export const scheduleDateWrap = style({
  position: 'relative',
})

export const scheduleDateButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  height: '40px',
  padding: '0 12px',
  borderRadius: '8px',
  border: `1px solid ${colors.gray200}`,
  backgroundColor: colors.white,
  color: colors.gray900,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${colors.primary500}`,
      outlineOffset: '2px',
    },
  },
})

export const scheduleDayDisabled = style({
  color: colors.gray300,
  cursor: 'not-allowed',
  selectors: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
})

export const scheduleCalendar = style({
  position: 'fixed',
  left: 'var(--schedule-calendar-x, -9999px)',
  top: 'var(--schedule-calendar-y, 0px)',
  zIndex: zIndex.tour,
  width: '312px',
  maxWidth: 'calc(100vw - 16px)',
  padding: '8px 8px 12px',
  border: `1px solid ${colors.gray75}`,
  borderRadius: '16px',
  backgroundColor: colors.white,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
})

export const scheduleTimePanel = style({
  position: 'fixed',
  left: 'var(--schedule-time-x, -9999px)',
  top: 'var(--schedule-time-y, 0px)',
  zIndex: zIndex.tour,
  width: '280px',
  maxWidth: 'calc(100vw - 16px)',
  padding: '8px 8px 12px',
  border: `1px solid ${colors.gray75}`,
  borderRadius: '16px',
  backgroundColor: colors.white,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
})

export const schedulePeriodRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '4px',
  padding: '8px 8px 4px',
})

export const scheduleTimeColumns = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
  padding: '4px 8px 0',
})

export const scheduleTimeColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
})

export const scheduleTimeScroll = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  maxHeight: '200px',
  overflowY: 'auto',
  paddingRight: '2px',
})

export const scheduleButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  height: '46px',
  padding: '12px 28px',
  border: 'none',
  borderRadius: '12px',
  backgroundColor: colors.primary100,
  color: colors.primary400,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: colors.primary200,
    },
    '&:disabled': {
      backgroundColor: colors.gray50,
      color: colors.gray200,
      cursor: 'not-allowed',
    },
    '&:focus-visible': {
      outline: `2px solid ${colors.primary500}`,
      outlineOffset: '2px',
    },
  },
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

export const tabRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  borderBottom: `1px solid ${colors.gray100}`,
  paddingBottom: '12px',
})

export const tabButton = style({
  background: 'none',
  border: 'none',
  padding: '0 0 10px',
  marginBottom: '-13px',
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  color: colors.gray500,
  whiteSpace: 'nowrap',
  selectors: {
    '&:hover': {
      color: colors.gray700,
    },
  },
})

export const tabButtonActive = style({
  color: colors.gray900,
  borderBottomColor: colors.primary500,
})

export const dashboardFrame = style({
  width: '100%',
  maxWidth: '390px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const dashboardHeader = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  textAlign: 'center',
})

export const dashboardCard = style({
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '16px',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const dashboardCardHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
})

export const checkDock = style({
  position: 'relative',
  width: '242px',
  maxHeight: '70vh',
  marginBottom: '24px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '14px 37px 14px 16px',
  marginRight: '-28px',
  backgroundColor: colors.primary100,
  borderRadius: '16px',
  overflow: 'hidden',
  '@media': {
    [media.phone]: {
      width: 'calc(100% - 16px)',
      maxWidth: 'calc(100% - 16px)',
      maxHeight: '28vh',
      margin: '8px 8px 0',
    },
  },
})

export const checkDockCollapsed = style({
  width: 'auto',
  maxWidth: 'calc(100% - 16px)',
  height: '54px',
  maxHeight: 'none',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '5px',
  padding: '0 37px 0 11px',
  '@media': {
    [media.phone]: {
      width: 'auto',
      maxHeight: 'none',
      margin: '8px 8px 0',
    },
  },
})

export const checkGlow = style({
  position: 'absolute',
  left: '-82px',
  top: '-321px',
  pointerEvents: 'none',
})

export const checkToggle = style({
  position: 'relative',
  zIndex: 1,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px',
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: colors.primary500,
  cursor: 'pointer',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.headingSm.fontSize,
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  whiteSpace: 'nowrap',
  ':focus-visible': {
    outline: `2px solid ${colors.primary500}`,
    outlineOffset: '2px',
  },
})

export const checkChevronCollapsed = style({
  transform: 'rotate(180deg)',
})

export const checkList = style({
  position: 'relative',
  zIndex: 1,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  overflowY: 'auto',
  minHeight: 0,
  width: '100%',
})

export const checkItem = style({
  width: '100%',
  minHeight: '33px',
  border: 'none',
  backgroundColor: colors.primary50,
  borderRadius: '4px',
  textAlign: 'left',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  padding: '6px 9px',
  cursor: 'pointer',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.primary800,
  ':hover': {
    backgroundColor: colors.white,
  },
  ':focus-visible': {
    outline: `2px solid ${colors.primary500}`,
    outlineOffset: '2px',
  },
})

export const summaryRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: '12px',
})

export const feedbackBody = style({
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
})

export const staleBanner = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '12px 16px',
  borderRadius: '8px',
  backgroundColor: colors.warning50,
  border: `1px solid ${colors.warning200}`,
})

