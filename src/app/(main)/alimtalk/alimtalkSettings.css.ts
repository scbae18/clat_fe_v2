import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

const kakaoHeaderYellow = '#FEE501'
const previewPanelBg = '#C9DBEA'

export const pageRoot = style({
  maxWidth: '1200px',
})

export const pageTitle = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '28px',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  margin: '0 0 24px',
  '@media': {
    [media.phone]: {
      fontSize: fontStyles.headingLg.fontSize,
      marginBottom: '16px',
    },
  },
})

export const replaySlot = style({
  marginLeft: 'auto',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
})

export const tabRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
  borderBottom: `1px solid ${colors.gray100}`,
  paddingBottom: '12px',
  marginBottom: '32px',
  '@media': {
    [media.phone]: {
      gap: '16px',
      overflowX: 'auto',
      marginBottom: '20px',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      selectors: {
        '&::-webkit-scrollbar': { display: 'none' },
      },
    },
  },
})

export const tabLink = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  textDecoration: 'none',
  borderBottom: '2px solid transparent',
  paddingBottom: '10px',
  marginBottom: '-13px',
  '@media': {
    [media.phone]: {
      fontSize: '16px',
      flexShrink: 0,
      minHeight: '44px',
      display: 'inline-flex',
      alignItems: 'center',
    },
  },
})

export const tabActive = style({
  color: colors.gray900,
  borderBottomColor: colors.primary500,
})

export const tabInactive = style({
  color: colors.gray500,
})

export const deliveryBanner = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  borderRadius: '8px',
  backgroundColor: colors.warning50,
  border: `1px solid ${colors.warning200}`,
  marginBottom: '24px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray700,
  '@media': {
    [media.phone]: {
      display: 'block',
      lineHeight: 1.5,
    },
  },
})

export const settingsColumns = style({
  display: 'flex',
  gap: '24px',
  alignItems: 'flex-start',
  '@media': {
    [media.phone]: {
      flexDirection: 'column',
    },
  },
})

export const settingsFormSide = style({
  flex: '1 1 0',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  '@media': {
    [media.phone]: {
      width: '100%',
    },
  },
})

export const settingsCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '52px',
  backgroundColor: colors.gray50,
  borderRadius: '16px',
  padding: '32px',
  boxSizing: 'border-box',
  '@media': {
    [media.phone]: {
      gap: '32px',
      padding: '20px',
    },
  },
})

export const settingsSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const settingsTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
})

export const settingsTitle = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '24px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const settingsTitleHint = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const autoInsert = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
})

export const autoInsertHelp = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  padding: '0 3px',
})

export const autoInsertTitle = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const autoInsertText = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.5,
  color: colors.gray500,
})

export const insertChipRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
})

export const insertChip = style({
  border: `1px solid ${colors.gray100}`,
  backgroundColor: colors.white,
  borderRadius: '999px',
  padding: '6px 10px 6px 8px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.primary500,
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary50,
    },
  },
})

export const saveButton = style({
  alignSelf: 'flex-start',
  minHeight: '40px',
  padding: '8px 12px',
})

export const templateBox = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
  padding: '14px 16px',
  borderRadius: '12px',
  backgroundColor: colors.primary50,
  textDecoration: 'none',
  boxSizing: 'border-box',
})

export const templateBoxText = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.5,
  color: colors.gray700,
})

export const templateBoxAction = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '13px',
  fontWeight: 700,
  lineHeight: 1.5,
  color: colors.primary500,
})

export const settingsPreview = style({
  flex: '1 1 0',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  backgroundColor: previewPanelBg,
  borderRadius: '16px',
  padding: '32px',
  boxSizing: 'border-box',
  '@media': {
    [media.phone]: {
      width: '100%',
      padding: '20px',
    },
  },
})

export const previewHeading = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const previewHeadingTitle = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '20px',
  fontWeight: 700,
  lineHeight: 1.4,
  color: colors.gray900,
})

export const previewHeadingText = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const previewChat = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  minWidth: 0,
})

export const previewAvatar = style({
  width: '36px',
  height: '36px',
  borderRadius: '14px',
  backgroundColor: colors.white,
  objectFit: 'cover',
  flexShrink: 0,
})

export const previewThread = style({
  flex: '1 1 0',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  paddingTop: '6px',
})

export const previewName = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: colors.gray600,
})

export const previewBubbleRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '8px',
  minWidth: 0,
})

export const previewMessage = style({
  flex: '1 1 360px',
  width: 'min(360px, 100%)',
  maxWidth: '360px',
  backgroundColor: colors.white,
  borderRadius: '20px',
  overflow: 'hidden',
})

export const previewArrive = style({
  backgroundColor: kakaoHeaderYellow,
  padding: '12px 16px',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  color: colors.gray900,
})

export const previewBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  padding: '16px',
})

export const previewPhrase = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.5,
  color: colors.gray900,
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
})

export const previewFilled = style({
  color: colors.primary500,
  fontWeight: 700,
})

export const previewLesson = style({
  margin: 0,
  opacity: 0.54,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.5,
  color: colors.gray700,
  whiteSpace: 'pre-wrap',
})

export const settingsCta = style({
  backgroundColor: colors.gray50,
  borderRadius: '8px',
  padding: '12px',
  textAlign: 'center',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  color: colors.gray600,
})

export const previewClock = style({
  flexShrink: 0,
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: colors.gray600,
  whiteSpace: 'nowrap',
})

export const previewColumn = style({
  flex: '1 1 400px',
  minWidth: '320px',
  backgroundColor: previewPanelBg,
  borderRadius: '16px',
  padding: '32px',
  boxSizing: 'border-box',
  '@media': {
    [media.phone]: {
      flex: '1 1 auto',
      width: '100%',
      minWidth: 0,
      padding: '20px',
    },
  },
})

export const previewTitle = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '20px',
  fontWeight: 600,
  color: colors.gray900,
  margin: '0 0 24px',
})

export const previewPhoneShell = style({
  marginTop: '8px',
})

export const previewAppLabel = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray600,
  marginLeft: '44px',
  marginBottom: '8px',
  '@media': {
    [media.phone]: {
      marginLeft: 0,
    },
  },
})

export const previewHeaderBar = style({
  backgroundColor: kakaoHeaderYellow,
  borderRadius: '20px 20px 0 0',
  padding: '12px',
  marginLeft: '44px',
  maxWidth: '388px',
  '@media': {
    [media.phone]: {
      marginLeft: 0,
      maxWidth: '100%',
    },
  },
})

export const previewHeaderText = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  color: colors.gray900,
  margin: 0,
})

export const previewBubble = style({
  backgroundColor: colors.white,
  borderRadius: '0 0 20px 20px',
  padding: '16px',
  marginLeft: '44px',
  maxWidth: '388px',
  minHeight: '200px',
  boxSizing: 'border-box',
})

export const previewBodyText = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.6,
  color: colors.gray900,
  whiteSpace: 'pre-wrap',
  margin: '12px 0',
})

export const previewDefaultText = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.6,
  color: colors.gray500,
  whiteSpace: 'pre-wrap',
  margin: 0,
})

export const previewDefaultVar = style({
  color: colors.primary400,
  fontWeight: 600,
})

export const previewCta = style({
  marginTop: '16px',
  backgroundColor: colors.gray50,
  borderRadius: '8px',
  padding: '12px',
  textAlign: 'center',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  color: colors.gray600,
})

export const previewTime = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray600,
  textAlign: 'right',
  marginTop: '8px',
  marginRight: '8px',
})

export const previewLogoRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px',
})

export const previewLogoPlaceholder = style({
  width: '36px',
  height: '36px',
  borderRadius: '14px',
  backgroundColor: colors.white,
})
