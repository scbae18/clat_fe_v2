import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { cardGridResponsive } from '@/styles/tokens/grid'
import { media } from '@/styles/tokens/breakpoints'

const tabBase = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: fontStyles.headingLg.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  padding: 0,
  whiteSpace: 'nowrap',
  flexShrink: 0,
  '@media': {
    [media.phone]: {
      fontSize: fontStyles.titleMd.fontSize,
    },
  },
} as const

export const tabContainerStyle = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '12px 32px',
  marginTop: '60px',
  marginBottom: '24px',
  '@media': {
    [media.phone]: {
      marginTop: '16px',
      marginBottom: '16px',
      gap: '12px',
    },
  },
})

export const tabGroupStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '32px',
  flexShrink: 0,
})

export const tabActionsStyle = style({
  marginLeft: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  '@media': {
    [media.phone]: {
      marginLeft: 0,
      width: '100%',
    },
  },
})

export const tabStyle = style([tabBase, {
  color: colors.gray300,
}])

export const tabActiveStyle = style([tabBase, {
  color: colors.gray900,
}])

export const gridStyle = style({
  ...cardGridResponsive,
  gridAutoRows: 'minmax(190px, auto)',
  '@media': {
    [media.tablet]: { gridTemplateColumns: 'repeat(2, 1fr)' },
    [media.phone]: {
      gridTemplateColumns: 'repeat(1, 1fr)',
      gridAutoRows: 'minmax(140px, auto)',
    },
  },
})

export const backButtonStyle = style({
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