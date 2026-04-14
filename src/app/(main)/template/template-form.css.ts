import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const pageStyle = style({
  display: 'flex',
  gap: '20px',
})

export const leftSectionStyle = style({
  flex: 5,
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
})

export const rightSectionStyle = style({
  flex: 7,
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
})

export const sectionBoxStyle = style({
  backgroundColor: colors.gray50,
  borderRadius: '16px',
  padding: '32px',
})

export const formHeaderStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px',
})

export const formHeaderLeftStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

export const formBackButtonStyle = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: colors.gray500,
  display: 'flex',
  alignItems: 'center',
  selectors: {
    '&:hover': {
      color: colors.gray700,
    },
  },
})