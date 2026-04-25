import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '14px 16px',
  borderRadius: '12px',
  border: `1px solid ${colors.gray75}`,
  backgroundColor: colors.white,
})

export const cardTriggered = style({
  borderColor: colors.error200,
  backgroundColor: colors.error50,
})

export const cardWarn = style({
  borderColor: colors.warning200,
  backgroundColor: colors.warning50,
})

export const head = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
})

export const labelRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
})

export const label = style({
  fontSize: '13px',
  fontWeight: 600,
  color: colors.gray700,
  letterSpacing: '-0.02em',
})

export const points = style({
  fontSize: '12px',
  fontWeight: 600,
  color: colors.gray500,
})

export const valueRow = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '6px',
})

export const value = style({
  fontSize: '20px',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: colors.gray900,
})

export const valueDanger = style({
  color: colors.error600,
})

export const valueWarn = style({
  color: '#A35908',
})

export const threshold = style({
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray500,
})

export const detail = style({
  margin: 0,
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray700,
  lineHeight: '150%',
  letterSpacing: '-0.02em',
})

export const meterTrack = style({
  width: '100%',
  height: '4px',
  borderRadius: '2px',
  backgroundColor: colors.gray75,
  overflow: 'hidden',
})

export const meterFill = style({
  height: '100%',
  borderRadius: '2px',
  backgroundColor: colors.gray300,
})

export const meterFillDanger = style({
  backgroundColor: colors.error500,
})

export const meterFillWarn = style({
  backgroundColor: colors.warning500,
})
