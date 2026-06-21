import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const modalHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '24px',
})

export const closeButtonStyle = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: colors.gray500,
  display: 'flex',
  alignItems: 'center',
  padding: '4px',
  selectors: {
    '&:hover': {
      color: colors.gray700,
    },
  },
})

export const columnsStyle = style({
  display: 'flex',
  gap: '20px',
  alignItems: 'flex-start',
})

export const columnStyle = style({
  flex: 1,
  minWidth: 0,
  backgroundColor: colors.gray50,
  borderRadius: '16px',
  padding: '24px',
})

export const footerStyle = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: '24px',
  paddingTop: '16px',
  borderTop: `1px solid ${colors.gray100}`,
})
