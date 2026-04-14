import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { listItemRowStyle, listItemRowSelectedStyle } from '@/components/common/styles/listItem.css'

export const headerStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '28px',
})

export const classListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '40px',
  maxHeight: '320px',
  overflowY: 'auto',
})

export const classItemStyle = listItemRowStyle

export const classItemSelectedStyle = listItemRowSelectedStyle

export const radioStyle = style({
  flexShrink: 0,
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  border: `2px solid ${colors.gray200}`,
  transition: 'border-color 0.15s',
})

export const radioSelectedStyle = style({
  borderColor: colors.primary500,
  backgroundImage: `radial-gradient(circle, ${colors.primary500} 40%, transparent 40%)`,
})

export const classNameStyle = style({
  fontSize: fontStyles.headingSm.fontSize,
  fontWeight: fontStyles.headingSm.fontWeight,
  color: colors.gray900,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const classMetaStyle = style({
  display: 'flex',
  gap: '4px',
})

export const actionsStyle = style({
  display: 'flex',
  gap: '8px',
})

export const emptyStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 0',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray300,
  letterSpacing: '-0.03em',
})
