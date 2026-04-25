import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const cardStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const card = style({
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray75}`,
  borderRadius: '20px',
  padding: '28px',
})

export const sectionHeadRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '12px',
  marginBottom: '12px',
})

export const sectionTitle = style({
  margin: 0,
  fontSize: '20px',
  fontWeight: 700,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const sectionDesc = style({
  margin: '4px 0 0',
  fontSize: '13px',
  fontWeight: 500,
  color: colors.gray500,
  letterSpacing: '-0.02em',
})

export const fieldTitle = style({
  margin: '0 0 12px',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.02em',
  color: colors.gray700,
})

export const fieldRow = style({
  marginBottom: '20px',
  selectors: {
    '&:last-child': { marginBottom: 0 },
  },
})

export const chipRow = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '6px',
})

export const chip = style({
  border: 'none',
  borderRadius: '999px',
  padding: '8px 14px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  letterSpacing: '-0.02em',
  transition: 'background-color 0.15s, color 0.15s',
})

export const chipActive = style({
  backgroundColor: colors.primary100,
  color: colors.primary500,
})

export const chipInactive = style({
  backgroundColor: colors.gray50,
  color: colors.gray500,
  selectors: {
    '&:hover': { backgroundColor: colors.gray75 },
  },
})

export const presetHelper = style({
  margin: '12px 0 0',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: '150%',
  letterSpacing: '-0.02em',
  color: colors.gray500,
})

export const customWrap = style({
  marginTop: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const customLabelRow = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
  flexWrap: 'wrap',
})

export const customLabel = style({
  fontSize: '14px',
  fontWeight: 600,
  color: colors.gray700,
  letterSpacing: '-0.02em',
})

export const customHint = style({
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray500,
  letterSpacing: '-0.02em',
})

export const textInput = style({
  width: '100%',
  height: '44px',
  borderRadius: '10px',
  border: `1px solid ${colors.gray75}`,
  padding: '0 14px',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: 'inherit',
  color: colors.gray900,
  outline: 'none',
  boxSizing: 'border-box',
  selectors: {
    '&:focus': { borderColor: colors.primary300 },
  },
})

export const textarea = style({
  width: '100%',
  minHeight: '80px',
  borderRadius: '12px',
  border: `1px solid ${colors.gray75}`,
  padding: '12px 14px',
  fontSize: '14px',
  fontWeight: 500,
  fontFamily: 'inherit',
  color: colors.gray900,
  lineHeight: '150%',
  outline: 'none',
  boxSizing: 'border-box',
  resize: 'vertical',
  selectors: {
    '&:focus': { borderColor: colors.primary300 },
  },
})

export const analyzeRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
})

export const sampleBox = style({
  marginTop: '12px',
  backgroundColor: colors.gray50,
  borderRadius: '12px',
  padding: '16px',
  minHeight: '96px',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '160%',
  letterSpacing: '-0.02em',
  color: colors.gray700,
  whiteSpace: 'pre-wrap',
})

export const includeTitleRow = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
  marginBottom: '8px',
  flexWrap: 'wrap',
})

export const includeHint = style({
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray500,
  letterSpacing: '-0.02em',
})

export const checkChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
})

export const checkIcon = style({
  width: '16px',
  height: '16px',
  borderRadius: '99px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '10px',
  fontWeight: 700,
})

export const checkIconActive = style({
  color: colors.primary400,
  backgroundColor: colors.primary200,
})

export const checkIconInactive = style({
  color: colors.gray300,
  backgroundColor: colors.gray100,
})

export const toggleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

export const toggleLabelGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  flex: 1,
})

export const toggleLabel = style({
  fontSize: '14px',
  fontWeight: 600,
  color: colors.gray700,
  letterSpacing: '-0.02em',
})

export const toggleHint = style({
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray500,
  letterSpacing: '-0.02em',
})

export const toggle = style({
  width: '36px',
  height: '20px',
  borderRadius: '999px',
  border: 'none',
  position: 'relative',
  cursor: 'pointer',
  padding: 0,
  flexShrink: 0,
})

export const toggleOn = style({
  backgroundColor: colors.primary500,
})

export const toggleOff = style({
  backgroundColor: colors.gray200,
})

export const toggleKnob = style({
  width: '14px',
  height: '14px',
  borderRadius: '50%',
  backgroundColor: colors.white,
  position: 'absolute',
  top: '3px',
  transition: 'left 0.15s ease',
})

export const toggleKnobOn = style({
  left: '19px',
})

export const toggleKnobOff = style({
  left: '3px',
})

export const slider = style({
  width: '100%',
  accentColor: colors.primary500,
})

export const sliderRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

export const sliderValue = style({
  minWidth: '40px',
  fontSize: '14px',
  fontWeight: 700,
  color: colors.primary500,
  textAlign: 'right',
  letterSpacing: '-0.02em',
})

export const weightRow = style({
  display: 'grid',
  gridTemplateColumns: '120px 1fr 60px',
  gap: '12px',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: `1px solid ${colors.gray50}`,
})

export const weightLabel = style({
  fontSize: '13px',
  fontWeight: 600,
  color: colors.gray700,
  letterSpacing: '-0.02em',
})

export const dismissedTable = style({
  width: '100%',
  borderCollapse: 'collapse',
})

export const dismissedTh = style({
  padding: '10px 12px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: 600,
  color: colors.gray500,
  borderBottom: `1px solid ${colors.gray75}`,
  letterSpacing: '-0.02em',
})

export const dismissedTd = style({
  padding: '12px',
  fontSize: '13px',
  fontWeight: 500,
  color: colors.gray700,
  borderBottom: `1px solid ${colors.gray50}`,
  letterSpacing: '-0.02em',
})

export const linkButton = style({
  border: 'none',
  background: 'transparent',
  fontSize: '13px',
  fontWeight: 600,
  color: colors.primary500,
  cursor: 'pointer',
  padding: 0,
  letterSpacing: '-0.02em',
})

export const channelRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const radioRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
})

export const radio = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '13px',
  fontWeight: 500,
  color: colors.gray700,
  cursor: 'pointer',
})

export const saveRow = style({
  marginTop: '24px',
  display: 'flex',
  justifyContent: 'flex-end',
})
