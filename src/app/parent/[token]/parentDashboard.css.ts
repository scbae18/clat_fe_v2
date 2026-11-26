import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const page = style({
  minHeight: '100vh',
  backgroundColor: colors.background,
  display: 'flex',
  justifyContent: 'center',
  padding: '0 0 30px',
  boxSizing: 'border-box',
})

export const frame = style({
  width: '390px',
  maxWidth: '100%',
  padding: '88px 24px 40px',
  boxSizing: 'border-box',
  position: 'relative',
  isolation: 'isolate',
})

export const topHalo = style({
  position: 'absolute',
  top: '66px',
  left: '50%',
  width: '300px',
  height: '300px',
  transform: 'translateX(-50%)',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(224,231,249,0.52) 0%, rgba(250,250,250,0) 68%)',
  pointerEvents: 'none',
  zIndex: -1,
})

export const greet = style({
  margin: '20px 0 8px',
  textAlign: 'center',
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: 600,
  color: colors.gray700,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const classBadge = style({
  margin: '0 auto',
  width: 'fit-content',
  backgroundColor: colors.primary400,
  color: colors.white,
  borderRadius: '4px',
  padding: '1px 6px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const title = style({
  margin: '4px 0 16px',
  textAlign: 'center',
  fontSize: fontStyles.headingSm.fontSize,
  fontWeight: 700,
  color: colors.gray900,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const stack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '16px',
  padding: '20px',
})

export const cardHead = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
})

export const cardHeadIcon = style({
  width: '20px',
  height: '20px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
})

export const cardHeadText = style({
  fontSize: fontStyles.bodyLg.fontSize,
  fontWeight: fontStyles.bodyLg.fontWeight,
  color: colors.primary500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const summaryRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '8px',
  fontSize: fontStyles.bodyLg.fontSize,
  color: colors.gray700,
  fontWeight: fontStyles.bodyLg.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const summaryRowLast = style({
  marginBottom: 0,
})

export const summaryVal = style({
  color: colors.primary500,
  fontWeight: fontStyles.bodyLg.fontWeight,
})

export const feedbackText = style({
  margin: 0,
  fontSize: fontStyles.bodyLg.fontSize,
  color: colors.gray900,
  lineHeight: '160%',
  letterSpacing: '-0.03em',
  fontWeight: fontStyles.bodyLg.fontWeight,
  whiteSpace: 'pre-wrap',
})

export const feedbackField = style({
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '8px',
  margin: 0,
  padding: '10px 12px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: colors.gray50,
  textAlign: 'left',
  cursor: 'text',
  fontFamily: 'inherit',
})

export const feedbackEditMark = style({
  alignSelf: 'flex-end',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 600,
  color: colors.primary500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const feedbackTextarea = style([
  feedbackText,
  {
    display: 'block',
    width: '100%',
    minHeight: '200px',
    padding: 0,
    border: 'none',
    background: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    outline: 'none',
  },
])

export const feedbackCard = style({
  position: 'relative',
})

export const feedbackActions = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '10px',
  flexWrap: 'wrap',
  flexShrink: 0,
})

export const textAction = style({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  padding: 0,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 600,
  color: colors.primary500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  fontFamily: 'inherit',
})

export const textActionMuted = style([
  textAction,
  {
    color: colors.gray500,
    fontWeight: 500,
  },
])

export const memoPopover = style({
  position: 'absolute',
  left: '20px',
  right: '20px',
  bottom: 'calc(100% + 8px)',
  zIndex: 2,
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '16px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
})

export const memoField = style({
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '96px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: colors.gray50,
  padding: '12px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
  fontFamily: 'inherit',
  resize: 'vertical',
  outline: 'none',
})

export const memoActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
})

export const aiHint = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const todoList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

export const moreButton = style({
  width: '100%',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  padding: '4px 0 0',
  fontSize: fontStyles.headingSm.fontSize,
  fontWeight: fontStyles.bodyLg.fontWeight,
  color: colors.primary500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const todoItem = style({
  backgroundColor: colors.gray50,
  borderRadius: '8px',
  padding: '6px 8px 6px 10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
  minHeight: '28px',
})

export const todoName = style({
  fontSize: fontStyles.labelSm.fontSize,
  color: colors.gray700,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const todoHomework = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  color: colors.gray900,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const todoMain = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
  flex: '1 1 auto',
})

export const todoNote = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  color: colors.gray500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
})

export const todoClassBlue = style({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 1,
  minWidth: 0,
  maxWidth: '9rem',
  backgroundColor: colors.primary100,
  color: colors.primary500,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  padding: '1px 6px',
  borderRadius: '4px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const todoTemplateGreen = style({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  backgroundColor: colors.success50,
  color: colors.success500,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  padding: '1px 6px',
  borderRadius: '4px',
  whiteSpace: 'nowrap',
})

export const todoTags = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexWrap: 'nowrap',
  gap: '4px',
  flexShrink: 0,
})

export const tagLate = style({
  backgroundColor: colors.error50,
  color: colors.error500,
  borderRadius: '6px',
  padding: '4px 8px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const timeline = style({
  position: 'relative',
  paddingLeft: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '30px',
  minHeight: '102px',
})

export const timelineRail = style({
  position: 'absolute',
  left: '3px',
  top: '8px',
  bottom: '10px',
  borderLeft: `2px dotted ${colors.primary300}`,
})

export const recentDate = style({
  fontSize: fontStyles.bodyMd.fontSize,
  color: colors.primary400,
  fontWeight: fontStyles.bodyMd.fontWeight,
  marginBottom: '6px',
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const recentRow = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '6px',
})

export const recentClass = style({
  color: colors.gray900,
  fontSize: fontStyles.bodyLg.fontSize,
  fontWeight: fontStyles.bodyLg.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const recentAttend = style({
  color: colors.success500,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const recentScore = style({
  backgroundColor: colors.gray50,
  color: colors.gray700,
  borderRadius: '6px',
  padding: '2px 8px',
  fontSize: fontStyles.bodyLg.fontSize,
  fontWeight: fontStyles.bodyLg.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const recentCard = style({
  minHeight: '170px',
  overflow: 'hidden',
})

export const stateBox = style({
  marginTop: '140px',
  textAlign: 'center',
  color: colors.gray600,
  fontSize: fontStyles.bodyMd.fontSize,
})

export const frameEmbed = style({
  width: '390px',
  maxWidth: '100%',
  padding: '8px 24px 32px',
  boxSizing: 'border-box',
  position: 'relative',
  isolation: 'isolate',
  margin: '0 auto',
  backgroundColor: colors.background,
  borderRadius: '16px',
})

export const topHaloEmbed = style({
  position: 'absolute',
  top: '0',
  left: '50%',
  width: '300px',
  height: '300px',
  transform: 'translateX(-50%)',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(224,231,249,0.52) 0%, rgba(250,250,250,0) 68%)',
  pointerEvents: 'none',
  zIndex: -1,
})

export const cardHeadInline = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
})

export const feedbackHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
})

export const chrome = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '16px',
})

export const tabRow = style({
  display: 'flex',
  gap: '8px',
})

export const tabButton = style({
  flex: 1,
  border: `1px solid ${colors.gray75}`,
  borderRadius: '999px',
  background: colors.white,
  color: colors.gray700,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  padding: '10px 0',
  cursor: 'pointer',
  fontFamily: 'inherit',
})

export const tabButtonOn = style({
  borderColor: colors.primary300,
  background: colors.primary50,
  color: colors.primary500,
  fontWeight: 700,
})

export const searchField = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '4px',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '8px',
  padding: '8px 16px',
})

export const searchInput = style({
  flex: 1,
  minWidth: 0,
  border: 'none',
  background: 'none',
  outline: 'none',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 400,
  color: colors.gray900,
  fontFamily: 'inherit',
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  '::placeholder': {
    color: colors.gray500,
  },
})

export const calendarButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '16px',
  height: '16px',
  padding: 0,
  border: 'none',
  background: 'none',
  color: colors.gray500,
  cursor: 'pointer',
  flexShrink: 0,
})

export const lessonCount = style({
  margin: '12px 0 8px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const lessonCard = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  textAlign: 'left',
  border: `1px solid ${colors.gray75}`,
  borderRadius: '12px',
  background: colors.white,
  padding: '10px 14px',
  cursor: 'pointer',
  color: colors.gray900,
  marginBottom: '8px',
  fontFamily: 'inherit',
})

export const lessonCardText = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
})

export const icon16 = style({
  width: '16px',
  height: '16px',
  display: 'block',
})

export const chevron = style([
  icon16,
  {
    color: colors.gray300,
    flexShrink: 0,
  },
])

export const backButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  margin: '0 0 8px',
  padding: 0,
  border: 'none',
  background: 'none',
  color: colors.gray700,
  cursor: 'pointer',
})

export const noticeCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '16px',
  padding: '18px 20px',
  marginBottom: '10px',
})

export const noticeHead = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '6px',
})

export const noticeType = style({
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: colors.primary50,
  color: colors.primary500,
  borderRadius: '4px',
  padding: '2px 6px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const noticeNew = style({
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: colors.error50,
  color: colors.error500,
  borderRadius: '4px',
  padding: '2px 6px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const emptyLine = style({
  margin: '24px 0',
  textAlign: 'center',
  color: colors.gray600,
  fontSize: fontStyles.bodyMd.fontSize,
})

export const listTitle = style({
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: 700,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const listMeta = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const noticeBody = style({
  margin: 0,
  fontSize: fontStyles.bodyLg.fontSize,
  fontWeight: fontStyles.bodyLg.fontWeight,
  lineHeight: '160%',
  letterSpacing: '-0.03em',
  whiteSpace: 'pre-wrap',
  color: colors.gray900,
})

export const noticeDate = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

