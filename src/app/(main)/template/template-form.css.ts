import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { media } from '@/styles/tokens/breakpoints'

export const pageStyle = style({
  display: 'flex',
  gap: '20px',
  '@media': {
    [media.phone]: {
      flexDirection: 'column',
    },
  },
})

export const leftSectionStyle = style({
  flex: 5,
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  minWidth: 0,
  '@media': {
    [media.phone]: {
      flex: 'none',
      width: '100%',
    },
  },
})

export const rightSectionStyle = style({
  flex: 7,
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  minWidth: 0,
  '@media': {
    [media.phone]: {
      flex: 'none',
      width: '100%',
    },
  },
})

export const sectionBoxStyle = style({
  backgroundColor: colors.gray50,
  borderRadius: '16px',
  padding: '32px',
  '@media': {
    [media.phone]: {
      padding: '20px',
    },
  },
})

export const formHeaderStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px',
  gap: '12px',
  '@media': {
    [media.phone]: {
      flexWrap: 'wrap',
      marginBottom: '20px',
    },
  },
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