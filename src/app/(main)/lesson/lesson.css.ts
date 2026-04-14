import { style, globalStyle } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { cardGridBase } from '@/styles/tokens/grid'

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
})

export const lessonGridStyle = style({
  ...cardGridBase,
})

globalStyle(`${lessonGridStyle} > *`, {
  minHeight: '248px',
})

export const sectionTitleStyle = style({
  margin: '80px 0 20px',
})

export const weekNavStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginTop: '60px',
  marginBottom: '24px',
})
