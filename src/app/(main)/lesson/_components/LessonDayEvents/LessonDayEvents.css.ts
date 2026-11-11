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

export const item = style({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 220px',
  maxWidth: '280px',
  gap: '4px',
  padding: '14px 16px',
  borderRadius: '12px',
  border: `1px solid ${colors.primary100}`,
  backgroundColor: colors.primary50,
  backgroundImage: `radial-gradient(ellipse at 0% 0%, ${colors.primary200} 0%, ${colors.primary50} 46%, ${colors.white} 78%)`,
  boxShadow: `0 8px 28px color-mix(in srgb, ${colors.primary500} 14%, transparent)`,
})

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
  wordBreak: 'break-word',
})
