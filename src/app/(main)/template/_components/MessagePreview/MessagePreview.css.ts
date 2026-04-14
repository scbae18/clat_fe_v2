import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const sectionHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
})

export const messageContainerStyle = style({
  backgroundColor: colors.white,
  borderRadius: '8px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray900,
  lineHeight: '180%',
  letterSpacing: '-0.03em',
})

export const emptyStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.white,
  borderRadius: '8px',
  padding: '20px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray300,
  letterSpacing: '-0.03em',
  minHeight: '120px',
})

export const lineStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '4px',
})

export const chipStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 12px',
  borderRadius: '20px',
  border: `1px solid ${colors.gray200}`,
  backgroundColor: colors.gray50,
  color: colors.gray500,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const valueChipStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 12px',
  borderRadius: '20px',
  border: `1px solid ${colors.primary300}`,
  backgroundColor: colors.primary100,
  color: colors.primary500,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const dividerStyle = style({
  height: '1px',
  backgroundColor: colors.gray75,
  margin: '8px 0',
})

export const itemListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const bulletLineStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '4px',
})
