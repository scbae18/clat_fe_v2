import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const wrap = style({
  marginBottom: '16px',
})

export const list = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'stretch',
  gap: '12px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

const card = {
  display: 'flex',
  flex: '1 1 220px',
  maxWidth: '280px',
  borderRadius: '12px',
  border: `1px solid ${colors.primary100}`,
  backgroundColor: colors.primary50,
  backgroundImage: `radial-gradient(ellipse at 0% 0%, ${colors.primary200} 0%, ${colors.primary50} 46%, ${colors.white} 78%)`,
  boxShadow: `0 8px 28px color-mix(in srgb, ${colors.primary500} 14%, transparent)`,
} as const

export const item = style(card)

export const itemDone = style({
  ...card,
  backgroundColor: colors.gray50,
  backgroundImage: 'none',
  border: `1px solid ${colors.gray100}`,
  boxShadow: 'none',
})

export const hit = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  width: '100%',
  padding: '14px 16px',
  border: 'none',
  background: 'transparent',
  textAlign: 'left',
  cursor: 'pointer',
  color: 'inherit',
})

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
  wordBreak: 'break-word',
})

export const struck = style({
  textDecoration: 'line-through',
})

export const checkOn = style({
  color: colors.primary500,
  flexShrink: 0,
  marginTop: '2px',
})

export const checkOff = style({
  color: colors.gray300,
  flexShrink: 0,
  marginTop: '2px',
})

export const error = style({
  margin: '8px 0 0',
})
