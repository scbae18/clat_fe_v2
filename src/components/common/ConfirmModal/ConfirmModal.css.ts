import { style } from '@vanilla-extract/css'

export const contentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginTop: '44px',
  marginBottom: '36px',
})

export const titleStyle = style({
  marginBottom: '12px',
})

export const actionsStyle = style({
  display: 'flex',
  gap: '8px',
})