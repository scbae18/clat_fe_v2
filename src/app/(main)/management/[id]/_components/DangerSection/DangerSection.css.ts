import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { media } from '@/styles/tokens/breakpoints'
import { fontStyles } from '@/styles/tokens/typography'

export const sectionRecipe = recipe({
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    borderRadius: '14px',
    padding: '24px 30px',
  },
  variants: {
    variant: {
      end: {
        backgroundColor: colors.primary50,
        border: `1px solid ${colors.primary200}`,
      },
      delete: {
        backgroundColor: colors.error50,
        border: `1px solid ${colors.error200}`,
      },
    },
  },
})

export const contentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
  minWidth: 0,
})

export const titleStyle = style({
  margin: 0,
  fontSize: '20px',
  fontWeight: '700',
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const descriptionStyle = style({
  margin: 0,
  whiteSpace: 'pre-line',
})

export const sectionWrapperStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

const actionButtonBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  boxSizing: 'border-box',
  height: '36px',
  padding: '8px 12px',
  borderRadius: '8px',
  backgroundColor: colors.white,
  cursor: 'pointer',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  whiteSpace: 'nowrap',
  flexShrink: 0,
} as const

export const endButtonStyle = style({
  ...actionButtonBase,
  color: colors.primary500,
  border: `1px solid ${colors.primary200}`,
})

export const deleteButtonStyle = style({
  ...actionButtonBase,
  color: colors.error500,
  border: `1px solid ${colors.error200}`,
})

export const dangerRowStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  alignItems: 'stretch',
  '@media': {
    [media.phone]: {
      gridTemplateColumns: '1fr',
    },
  },
})