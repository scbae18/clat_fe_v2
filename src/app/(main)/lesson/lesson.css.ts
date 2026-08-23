import { style, globalStyle } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { cardGridResponsive } from '@/styles/tokens/grid'
import { media } from '@/styles/tokens/breakpoints'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
})

export const navButtonStyle = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: colors.gray50,
  borderRadius: 4,
  color: colors.gray500,
  selectors: {
    '&:hover': {
      backgroundColor: colors.gray75,
    },
  },
})

export const dateGridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '12px',
  '@media': {
    [media.phone]: {
      display: 'flex',
      gap: '6px',
      overflow: 'visible',
    },
  },
})

export const lessonGridStyle = style({
  ...cardGridResponsive,
})

globalStyle(`${lessonGridStyle} > *`, {
  minHeight: '248px',
  '@media': {
    [media.phone]: {
      minHeight: '148px',
    },
  },
})

export const sectionTitleStyle = style({
  margin: '80px 0 20px',
  '@media': {
    [media.phone]: {
      margin: '32px 0 16px',
    },
  },
})

export const weekNavStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginTop: '60px',
  marginBottom: '24px',
  '@media': {
    [media.phone]: {
      marginTop: '16px',
      marginBottom: '12px',
      gap: '8px',
    },
  },
})

export const weekLabelStyle = style({
  flex: 1,
  textAlign: 'center',
  minWidth: 0,
  whiteSpace: 'nowrap',
})
