import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const sectionHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
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
  height: '52px',
  padding: '12px',
  userSelect: 'none',
})

export const rowDraggingStyle = style({
  opacity: 0.5,
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
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
