import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

export const sectionHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
})

export const compactHeaderStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '4px',
  marginBottom: '12px',
})

export const categoryMarkStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  flexShrink: 0,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  color: colors.gray500,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const categoryDividerStyle = style({
  color: colors.gray200,
})

export const rowListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const rowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: colors.white,
  borderRadius: '8px',
  minHeight: '52px',
  padding: '12px',
  userSelect: 'none',
  flexWrap: 'wrap',
})

export const rowDraggingStyle = style({
  opacity: 0.5,
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
})

export const compactRowStyle = style({
  flexWrap: 'nowrap',
  minHeight: '44px',
  padding: '8px 12px',
  '@media': {
    [media.phone]: {
      flexWrap: 'wrap',
    },
  },
})

export const dragHandleStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  cursor: 'grab',
  flexShrink: 0,
  color: colors.gray200,
  selectors: {
    '&:active': {
      cursor: 'grabbing',
    },
  },
})

export const dragDotRowStyle = style({
  display: 'flex',
  gap: '3px',
})

export const dragDotStyle = style({
  width: '3px',
  height: '3px',
  borderRadius: '50%',
  backgroundColor: 'currentColor',
})

export const rowLabelStyle = style({
  flex: 1,
  minWidth: 0,
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: fontStyles.titleMd.fontWeight,
  color: colors.gray700,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const itemTypeBadgeStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  color: colors.gray500,
  letterSpacing: '-0.03em',
  flexShrink: 0,
})

export const recipientGroupStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
})

export const recipientButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 10px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  whiteSpace: 'nowrap',
  backgroundColor: colors.gray50,
  color: colors.gray500,
  transition: 'background-color 0.2s, color 0.2s',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: colors.gray75,
    },
    '&[data-pressed="true"]': {
      backgroundColor: colors.primary100,
      color: colors.primary500,
    },
    '&[data-pressed="true"]:hover:not(:disabled)': {
      backgroundColor: colors.primary200,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      backgroundColor: colors.gray50,
      color: colors.gray200,
    },
    '&[data-pressed="true"]:disabled': {
      backgroundColor: colors.primary50,
      color: colors.primary300,
    },
  },
})
