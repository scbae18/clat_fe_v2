import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const wrap = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '16px',
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '8px',
  border: `1px solid ${colors.gray75}`,
  background: colors.white,
})

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
  wordBreak: 'break-word',
})
