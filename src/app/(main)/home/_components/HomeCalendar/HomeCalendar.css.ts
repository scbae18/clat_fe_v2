import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const card = style({
  minWidth: 0,
  background: colors.white,
  border: `1px solid ${colors.gray75}`,
  borderRadius: '20px',
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '12px 8px 4px',
})

export const headingReset = style({
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
  padding: '0 8px',
})

export const weekday = style({
  textAlign: 'center',
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  gap: '4px',
  padding: '0 8px',
})

export const day = recipe({
  base: {
    border: '1px solid transparent',
    background: 'transparent',
    borderRadius: '8px',
    minHeight: '40px',
    padding: '2px 0',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    color: colors.gray900,
    fontFamily: 'Pretendard, sans-serif',
    fontSize: fontStyles.bodyMd.fontSize,
    fontWeight: fontStyles.bodyMd.fontWeight,
    letterSpacing: '-0.03em',
    lineHeight: '140%',
    ':focus-visible': {
      outline: `2px solid ${colors.primary500}`,
      outlineOffset: '1px',
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

export const dot = style({
  width: '4px',
  height: '4px',
  borderRadius: '999px',
  background: colors.primary500,
})

export const dotSpacer = style({
  width: '4px',
  height: '4px',
})

export const dayHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '8px 12px 0',
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  margin: 0,
  padding: '0 12px 12px',
  listStyle: 'none',
})

export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '8px',
  border: `1px solid ${colors.gray75}`,
  background: colors.white,
})

export const itemBodyButton = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '2px',
  padding: 0,
  border: 'none',
  background: 'transparent',
  textAlign: 'left',
  cursor: 'pointer',
  wordBreak: 'break-word',
})

export const checkButton = style({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
})

export const struck = style({
  textDecoration: 'line-through',
})

export const note = style({
  margin: 0,
  padding: '0 12px 12px',
})

export const modalTitle = style({
  marginBottom: '36px',
})

export const fieldGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '36px',
  marginBottom: '48px',
})

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const students = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  maxHeight: '240px',
  overflowY: 'auto',
})

export const studentButton = recipe({
  base: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
    font: 'inherit',
    ':hover': {
      backgroundColor: colors.gray50,
    },
    ':focus-visible': {
      outline: `2px solid ${colors.primary500}`,
      outlineOffset: '2px',
    },
  },
  variants: {
    selected: {
      true: {
        backgroundColor: colors.primary50,
        ':hover': { backgroundColor: colors.primary100 },
      },
      false: {},
    },
  },
})

export const checkOn = style({
  color: colors.primary500,
  flexShrink: 0,
})

export const checkOff = style({
  color: colors.gray200,
  flexShrink: 0,
})

export const actions = style({
  display: 'flex',
  gap: '8px',
})

export const itemActions = style({
  display: 'flex',
  flexShrink: 0,
  gap: '4px',
})

export const targetTabs = style({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  borderBottom: `1px solid ${colors.gray100}`,
  paddingBottom: '12px',
})

export const targetTab = style({
  background: 'none',
  border: 'none',
  padding: '0 0 10px',
  marginBottom: '-13px',
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  ':focus-visible': {
    outline: `2px solid ${colors.primary500}`,
    outlineOffset: '2px',
  },
})

export const targetTabActive = style({
  borderBottomColor: colors.primary500,
})
