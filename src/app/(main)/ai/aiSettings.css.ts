import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const pageRoot = style({
  maxWidth: '1200px',
})

export const pageTitle = style({
  margin: '0 0 40px',
  fontSize: '39px',
  fontWeight: 700,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const cardStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const card = style({
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '20px',
  padding: '28px',
})

export const sectionTitle = style({
  margin: '0 0 12px',
  fontSize: '28px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const fieldTitle = style({
  margin: '0 0 12px',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const fieldRow = style({
  marginBottom: '24px',
})

export const chipRow = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '4px',
})

export const chip = style({
  border: 'none',
  borderRadius: '8px',
  padding: '4px 8px',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  cursor: 'pointer',
})

export const chipActive = style({
  backgroundColor: colors.primary100,
  color: colors.primary400,
})

export const chipInactive = style({
  backgroundColor: colors.gray50,
  color: colors.gray500,
})

export const presetHelper = style({
  margin: '12px 0 0',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const customWrap = style({
  marginTop: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const customLabelRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

export const customLabel = style({
  fontSize: '16px',
  fontWeight: 600,
  color: colors.gray700,
  letterSpacing: '-0.03em',
})

export const customHint = style({
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray500,
  letterSpacing: '-0.03em',
})

export const textarea = style({
  width: '100%',
  minHeight: '80px',
  borderRadius: '12px',
  border: `1px solid ${colors.gray100}`,
  padding: '12px 14px',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray900,
  lineHeight: '140%',
  boxSizing: 'border-box',
  resize: 'vertical',
  selectors: {
    '&:focus': {
      outline: `2px solid ${colors.primary200}`,
      outlineOffset: '1px',
    },
  },
})

export const analyzeRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
})

export const analyzeButton = style({
  border: 'none',
  borderRadius: '10px',
  backgroundColor: colors.primary500,
  color: colors.white,
  height: '46px',
  padding: '0 20px',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      backgroundColor: colors.gray300,
      cursor: 'not-allowed',
    },
  },
})

export const sampleBox = style({
  marginTop: '12px',
  backgroundColor: colors.gray50,
  borderRadius: '12px',
  padding: '16px',
  minHeight: '96px',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
  whiteSpace: 'pre-wrap',
})

export const includeTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
})

export const includeHint = style({
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray500,
  letterSpacing: '-0.03em',
})

export const checkChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
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

export const toggle = style({
  width: '36px',
  height: '18px',
  borderRadius: '99px',
  border: 'none',
  position: 'relative',
  cursor: 'pointer',
  padding: 0,
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
  top: '2px',
  transition: 'left 0.15s ease',
})

export const toggleKnobOn = style({
  left: '20px',
})

export const toggleKnobOff = style({
  left: '2px',
})

export const toggleHelp = style({
  marginTop: '8px',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const saveRow = style({
  marginTop: '24px',
  display: 'flex',
  justifyContent: 'flex-end',
})

export const saveButton = style({
  border: 'none',
  borderRadius: '12px',
  backgroundColor: colors.primary500,
  color: colors.white,
  height: '52px',
  padding: '0 28px',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      backgroundColor: colors.gray300,
      cursor: 'not-allowed',
    },
  },
})

