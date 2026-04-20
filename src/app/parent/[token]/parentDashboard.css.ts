import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const page = style({
  minHeight: '100vh',
  backgroundColor: '#FAFAFA',
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
  padding: '4px 8px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const title = style({
  margin: '8px 0 20px',
  textAlign: 'center',
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: 600,
  color: colors.gray900,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const stack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const card = style({
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '16px',
  padding: '20px',
})

export const cardHead = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginBottom: '12px',
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
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: 600,
  backgroundImage: 'linear-gradient(90deg, #5774DA 0%, #3946BC 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const summaryRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: fontStyles.labelSm.fontSize,
  color: colors.gray700,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  marginBottom: '10px',
})

export const summaryRowLast = style({
  marginBottom: 0,
})

export const summaryVal = style({
  color: colors.primary500,
  fontWeight: 600,
})

export const feedbackText = style({
  margin: 0,
  fontSize: fontStyles.labelSm.fontSize,
  color: colors.gray900,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  fontWeight: 500,
})

export const todoList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

export const todoItem = style({
  backgroundColor: colors.gray50,
  borderRadius: '8px',
  padding: '8px 8px 8px 12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '8px',
  minHeight: '34px',
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
  flexShrink: 0,
})

export const todoClassBlue = style({
  display: 'inline-flex',
  alignItems: 'center',
  maxWidth: '100%',
  backgroundColor: colors.primary100,
  color: colors.primary500,
  fontSize: '10px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  padding: '4px 8px',
  borderRadius: '6px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const todoTemplateGreen = style({
  display: 'inline-flex',
  alignItems: 'center',
  maxWidth: '100%',
  backgroundColor: colors.success50,
  color: colors.success500,
  fontSize: '10px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  padding: '4px 8px',
  borderRadius: '6px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const todoTags = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
  gap: '4px',
  flexShrink: 1,
  minWidth: 0,
})

export const tagLate = style({
  backgroundColor: '#FEE5E5',
  color: colors.error500,
  borderRadius: '6px',
  padding: '4px 8px',
  fontSize: '10px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const timeline = style({
  position: 'relative',
  paddingLeft: '27px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  minHeight: '102px',
})

export const timelineRail = style({
  position: 'absolute',
  left: '9px',
  top: '8px',
  bottom: '10px',
  borderLeft: `2px dotted ${colors.primary300}`,
})

export const recentDate = style({
  fontSize: '10px',
  color: colors.primary400,
  fontWeight: 500,
  marginBottom: '4px',
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const recentRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: fontStyles.labelSm.fontSize,
})

export const recentClass = style({
  color: colors.gray700,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const recentBadge = style({
  borderRadius: '4px',
  padding: '2px 4px',
  fontSize: '10px',
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  fontWeight: 500,
})

export const recentAttend = style({
  backgroundColor: colors.success50,
  color: colors.success500,
})

export const recentScore = style({
  backgroundColor: colors.gray50,
  color: colors.gray600,
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

