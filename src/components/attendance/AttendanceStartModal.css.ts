import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 0,
  width: '100%',
})

export const timerIconWrapStyle = style({
  width: '60px',
  height: '60px',
  marginBottom: '20px',
  color: colors.primary400,
  flexShrink: 0,
})

export const titleStyle = style({
  margin: 0,
  marginBottom: '8px',
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const subtitleStyle = style({
  margin: 0,
  marginBottom: '32px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const sectionLabelStyle = style({
  margin: 0,
  marginBottom: '12px',
  fontSize: fontStyles.headingSm.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const chipRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '12px',
})

export const chipStyle = style({
  minWidth: '64px',
  height: '32px',
  padding: '0 12px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  backgroundColor: colors.gray50,
  color: colors.gray500,
})

export const chipSelectedStyle = style({
  backgroundColor: colors.primary50,
  color: colors.primary500,
})

export const directInputStyle = style({
  width: '100%',
  maxWidth: '200px',
  padding: '10px 12px',
  borderRadius: '8px',
  border: `1px solid ${colors.gray100}`,
  fontSize: fontStyles.bodyMd.fontSize,
  marginBottom: '16px',
})

export const infoBoxStyle = style({
  width: '100%',
  boxSizing: 'border-box',
  backgroundColor: colors.primary50,
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '32px',
})

export const infoListStyle = style({
  margin: 0,
  paddingLeft: '21px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const actionsRowStyle = style({
  display: 'flex',
  gap: '12px',
  width: '100%',
})

export const actionHalfStyle = style({
  flex: 1,
  minWidth: 0,
  border: 'none',
  borderRadius: '12px',
  padding: '16px 12px',
  cursor: 'pointer',
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const cancelBtnStyle = style({
  backgroundColor: colors.gray50,
  color: colors.gray500,
})

export const primaryBtnStyle = style({
  backgroundColor: colors.primary500,
  color: colors.white,
})

export const successCodeStyle = style({
  margin: '16px 0 24px',
  fontSize: '48px',
  fontWeight: 700,
  letterSpacing: '0.2em',
  color: colors.primary500,
  lineHeight: 1.2,
})

export const linkRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  padding: '12px 0',
  borderBottom: `1px solid ${colors.gray100}`,
  width: '100%',
})

export const linkNameStyle = style({
  fontSize: fontStyles.bodyLg.fontSize,
  fontWeight: 500,
  color: colors.gray900,
  flexShrink: 0,
})

export const copyBtnStyle = style({
  border: `1px solid ${colors.primary500}`,
  backgroundColor: colors.white,
  color: colors.primary500,
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  cursor: 'pointer',
  flexShrink: 0,
  whiteSpace: 'nowrap',
})

export const linkListWrapStyle = style({
  width: '100%',
  maxHeight: '220px',
  overflowY: 'auto',
  marginBottom: '24px',
})

export const devNoteStyle = style({
  margin: '0 0 16px',
  fontSize: fontStyles.bodyMd.fontSize,
  color: colors.gray500,
  lineHeight: '140%',
})
