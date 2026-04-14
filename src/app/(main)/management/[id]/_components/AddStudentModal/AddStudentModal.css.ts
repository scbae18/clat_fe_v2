import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { listItemRowStyle, listItemRowSelectedStyle } from '@/components/common/styles/listItem.css'

export const titleStyle = style({
  marginBottom: '20px',
})

export const searchWrapperStyle = style({
  marginBottom: '16px',
})

export const studentListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '40px',
  maxHeight: '320px',
  overflowY: 'auto',
})

export const studentRowStyle = listItemRowStyle

export const studentRowSelectedStyle = listItemRowSelectedStyle

export const studentNameStyle = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  color: colors.gray900,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const studentPhoneStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray500,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const actionsStyle = style({
  display: 'flex',
  gap: '8px',
  marginTop: '24px',
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