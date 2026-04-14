import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

/** iPhone 13/14 artboard width from Figma */
export const phoneMaxWidth = '390px'

export const page = style({
  minHeight: '100vh',
  backgroundColor: colors.background,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: phoneMaxWidth,
  margin: '0 auto',
  paddingTop: 'max(12px, env(safe-area-inset-top))',
  paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
  paddingLeft: 'max(20px, env(safe-area-inset-left))',
  paddingRight: 'max(20px, env(safe-area-inset-right))',
  boxSizing: 'border-box',
  position: 'relative',
})

export const contentColumn = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  flex: 1,
})

export const chip = style({
  backgroundColor: colors.primary100,
  color: colors.primary400,
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  padding: '4px 8px',
  borderRadius: '4px',
  marginBottom: '20px',
})

export const title = style({
  margin: '0 0 0',
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  textAlign: 'center',
})

export const subStack = style({
  marginTop: '14px',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
  textAlign: 'center',
})

export const studentName = style({
  marginTop: '12px',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.primary500,
  textAlign: 'center',
})

/** Timer +4 digit boxes: Figma 276px wide, gap 28 between timer and row */
export const timerDigitsBlock = style({
  width: '100%',
  maxWidth: '276px',
  marginTop: '36px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '28px',
  cursor: 'pointer',
})

export const timerLine = style({
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  textAlign: 'center',
  width: '100%',
})

export const timerLabel = style({
  color: colors.gray500,
})

export const timerValue = style({
  color: colors.primary500,
})

export const digitsRow = style({
  display: 'flex',
  gap: '8px',
  justifyContent: 'center',
  width: '100%',
})

export const digitBox = style({
  width: '63px',
  height: '81px',
  borderRadius: '12px',
  border: `1px solid ${colors.gray100}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  boxSizing: 'border-box',
})

export const digitBoxFilled = style({
  border: `1.5px solid ${colors.primary500}`,
})

export const hiddenNumericInput = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  whiteSpace: 'nowrap',
  border: 0,
  opacity: 0,
})

export const confirmBtn = style({
  width: '100%',
  maxWidth: '342px',
  marginTop: 'auto',
  padding: '16px 12px',
  borderRadius: '16px',
  border: 'none',
  backgroundColor: colors.primary500,
  color: colors.white,
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      opacity: 0.45,
      cursor: 'not-allowed',
    },
  },
})

export const errorText = style({
  color: colors.error500,
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  textAlign: 'center',
  marginTop: '16px',
  width: '100%',
  maxWidth: '276px',
})

export const loadErrText = style({
  color: colors.error500,
  fontSize: '14px',
  fontWeight: 500,
  textAlign: 'center',
  marginTop: '12px',
  maxWidth: '276px',
})

/* —— Success (717:2643) —— */
export const successStack = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '186px',
  marginTop: '48px',
  gap: '30px',
})

export const successIconWrap = style({
  width: '80px',
  height: '80px',
  flexShrink: 0,
})

export const successTitle = style({
  margin: 0,
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  textAlign: 'center',
})

export const successSub = style({
  margin: 0,
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
  textAlign: 'center',
})

export const summaryCard = style({
  width: '100%',
  maxWidth: '280px',
  minHeight: '123px',
  marginTop: '48px',
  backgroundColor: colors.gray50,
  borderRadius: '24px',
  padding: '24px',
  boxSizing: 'border-box',
  position: 'relative',
})

export const summaryRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  fontSize: '12px',
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  marginBottom: '12px',
  selectors: {
    '&:last-child': { marginBottom: 0 },
  },
})

export const summaryKey = style({
  color: colors.gray700,
  fontWeight: 500,
})

export const summaryVal = style({
  color: colors.gray900,
  fontWeight: 600,
  textAlign: 'right',
})

export const summaryValStatus = style({
  color: colors.primary500,
  fontWeight: 600,
  textAlign: 'right',
})

/* —— Closed / blocked (717:3150) —— */
export const blockedStack = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '186px',
  marginTop: '48px',
  gap: '30px',
})

export const blockedIconWrap = style({
  width: '80px',
  height: '80px',
  flexShrink: 0,
})

export const blockedTitle = style({
  margin: 0,
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  textAlign: 'center',
})

export const blockedSub = style({
  margin: 0,
  width: '186px',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
  textAlign: 'center',
})
