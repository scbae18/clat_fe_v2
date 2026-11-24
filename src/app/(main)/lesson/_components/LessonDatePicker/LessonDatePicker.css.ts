import { globalStyle, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { media } from '@/styles/tokens/breakpoints'
import { fontStyles } from '@/styles/tokens/typography'
import { zIndex } from '@/styles/tokens/zIndex'

export const trigger = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  maxWidth: '100%',
  padding: '4px 8px',
  border: 'none',
  borderRadius: '8px',
  background: 'transparent',
  color: colors.gray900,
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.gray50,
    },
    '&:focus-visible': {
      outline: `2px solid ${colors.primary500}`,
      outlineOffset: '2px',
    },
  },
  '@media': {
    [media.phone]: {
      minHeight: '44px',
      padding: '0 8px',
    },
  },
})

export const triggerLabel = style({
  whiteSpace: 'nowrap',
})

globalStyle(`${trigger} ${triggerLabel}`, {
  '@media': {
    [media.phone]: {
      fontSize: '16px',
    },
  },
})

export const chevron = style({
  flexShrink: 0,
  color: colors.gray500,
  transition: 'transform 0.2s ease',
})

export const chevronOpen = style({
  transform: 'rotate(180deg)',
})

export const panel = style({
  position: 'fixed',
  left: 'var(--lesson-date-picker-x, -9999px)',
  top: 'var(--lesson-date-picker-y, 0px)',
  zIndex: zIndex.tooltip,
  width: '312px',
  maxWidth: 'calc(100vw - 16px)',
  padding: '8px 8px 12px',
  border: `1px solid ${colors.gray75}`,
  borderRadius: '16px',
  backgroundColor: colors.white,
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '8px 8px 4px',
})

export const heading = style({
  margin: 0,
  whiteSpace: 'nowrap',
})

export const nav = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flexShrink: 0,
})

export const navIcon = style({
  selectors: {
    '&&': {
      padding: '8px',
    },
  },
})

export const weekdays = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: '4px',
  padding: '4px 8px 0',
})

export const weekday = style({
  textAlign: 'center',
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: '4px',
  padding: '4px 8px 0',
})

export const day = recipe({
  base: {
    border: '1px solid transparent',
    background: 'transparent',
    borderRadius: '8px',
    minHeight: '40px',
    padding: 0,
    cursor: 'pointer',
    color: colors.gray900,
    fontFamily: 'Pretendard, sans-serif',
    fontSize: fontStyles.bodyMd.fontSize,
    fontWeight: fontStyles.bodyMd.fontWeight,
    letterSpacing: '-0.03em',
    lineHeight: '140%',
    selectors: {
      '&:hover': {
        backgroundColor: colors.gray50,
      },
      '&:focus-visible': {
        outline: `2px solid ${colors.primary500}`,
        outlineOffset: '1px',
      },
    },
  },
  variants: {
    outside: {
      true: { color: colors.gray300 },
      false: {},
    },
    selected: {
      true: {
        backgroundColor: colors.primary100,
        borderColor: colors.primary500,
        color: colors.primary500,
        selectors: {
          '&:hover': {
            backgroundColor: colors.primary100,
          },
        },
      },
      false: {},
    },
    today: {
      true: { borderColor: colors.primary300 },
      false: {},
    },
  },
  compoundVariants: [
    {
      variants: { selected: true, today: true },
      style: { borderColor: colors.primary500 },
    },
    {
      variants: { selected: true, outside: true },
      style: { color: colors.primary500 },
    },
  ],
})
