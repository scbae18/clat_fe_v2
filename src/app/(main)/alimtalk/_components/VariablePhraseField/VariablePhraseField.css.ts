import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const fieldWrap = style({
  position: 'relative',
  width: '100%',
})

export const field = style({
  width: '100%',
  minHeight: '123px',
  padding: '14px 16px',
  borderRadius: '8px',
  border: `1px solid ${colors.gray50}`,
  backgroundColor: colors.white,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  boxSizing: 'border-box',
  resize: 'vertical',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  selectors: {
    '&:focus': {
      outline: `2px solid ${colors.primary200}`,
      outlineOffset: '1px',
    },
  },
})

export const placeholder = style({
  position: 'absolute',
  top: '14px',
  left: '16px',
  right: '16px',
  color: colors.gray300,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  pointerEvents: 'none',
})

export const chip = style({
  display: 'inline-flex',
  alignItems: 'center',
  margin: '0 2px',
  padding: '1px 8px',
  borderRadius: '50px',
  backgroundColor: colors.primary100,
  color: colors.primary500,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  verticalAlign: 'baseline',
  userSelect: 'none',
})
