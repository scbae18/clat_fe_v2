import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

/** Figma 673:4616 — centered copy, 12px pill actions */
export const bodyStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '12px',
  paddingTop: '20px',
  paddingBottom: '8px',
  flex: 1,
  justifyContent: 'center',
})

export const titleStyle = style({
  margin: 0,
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  maxWidth: '280px',
})

export const descBlockStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
  maxWidth: '320px',
})

export const descLineStyle = style({
  margin: 0,
})

export const actionsStyle = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  width: '100%',
  marginTop: '8px',
})

const btnBase = style({
  flex: '1 1 0',
  minWidth: 0,
  border: 'none',
  cursor: 'pointer',
  padding: '12px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  fontFamily: 'Pretendard, sans-serif',
  transition: 'opacity 0.2s, filter 0.2s, background-color 0.2s',
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
})

export const cancelBtnStyle = style([
  btnBase,
  {
    backgroundColor: colors.gray50,
    color: colors.gray500,
    selectors: {
      '&:hover:not(:disabled)': {
        filter: 'brightness(0.97)',
      },
    },
  },
])

export const confirmPrimaryStyle = style([
  btnBase,
  {
    backgroundColor: colors.primary500,
    color: colors.white,
    selectors: {
      '&:hover:not(:disabled)': {
        backgroundColor: colors.primary600,
      },
    },
  },
])

export const confirmDangerStyle = style([
  btnBase,
  {
    backgroundColor: '#e54351',
    color: colors.white,
    selectors: {
      '&:hover:not(:disabled)': {
        filter: 'brightness(0.95)',
      },
    },
  },
])
