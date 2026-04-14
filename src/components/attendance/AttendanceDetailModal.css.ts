import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const rootStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100%',
  maxHeight: 'min(85vh, 800px)',
})

export const timerIconWrapStyle = style({
  width: '60px',
  height: '60px',
  marginBottom: '20px',
  color: colors.primary400,
})

export const titleStyle = style({
  margin: 0,
  marginBottom: '32px',
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const metaRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '24px',
})

export const metaItemStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  color: colors.gray700,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const metaIconBoxStyle = style({
  width: '20px',
  height: '20px',
  borderRadius: '6px',
  backgroundColor: colors.gray100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontSize: '11px',
  fontWeight: 700,
  color: colors.gray600,
})

export const summaryRowStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  marginBottom: '24px',
})

export const summaryCardStyle = style({
  backgroundColor: colors.gray50,
  borderRadius: '12px',
  padding: '16px 24px 24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const summaryInnerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
})

export const summaryLabelPresentStyle = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  color: colors.primary500,
})

export const summaryLabelAbsentStyle = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  color: colors.gray700,
})

export const summaryValuePresentStyle = style({
  margin: 0,
  fontSize: '28px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.primary500,
})

export const summaryValueAbsentStyle = style({
  margin: 0,
  fontSize: '28px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const pillsRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '20px',
})

export const pillStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 12px',
  borderRadius: '999px',
  border: 'none',
  cursor: 'pointer',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const pillActiveStyle = style({
  backgroundColor: colors.primary500,
  color: colors.white,
})

export const pillInactiveStyle = style({
  backgroundColor: colors.gray50,
  color: colors.gray700,
})

export const devLinksStyle = style({
  backgroundColor: colors.gray50,
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '20px',
  maxHeight: '200px',
  overflowY: 'auto',
})

export const devLinksTitleStyle = style({
  margin: '0 0 12px',
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: 600,
  color: colors.gray700,
})

export const devLinkRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '8px 0',
  borderTop: `1px solid ${colors.gray100}`,
  selectors: {
    '&:first-of-type': {
      borderTop: 'none',
      paddingTop: 0,
    },
  },
})

export const copyTinyStyle = style({
  border: `1px solid ${colors.primary500}`,
  background: colors.white,
  color: colors.primary500,
  borderRadius: '8px',
  padding: '6px 10px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 600,
  cursor: 'pointer',
  flexShrink: 0,
})

export const gridStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px 20px',
  overflowY: 'auto',
  flex: 1,
  minHeight: '120px',
  marginBottom: '24px',
  '@media': {
    '(max-width: 560px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const studentCellStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  minWidth: 0,
})

export const studentNameStyle = style({
  fontSize: fontStyles.bodyLg.fontSize,
  fontWeight: 500,
  color: colors.gray900,
  flexShrink: 0,
  maxWidth: '46%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const studentRightStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
})

export const linkBtnStyle = style({
  border: `1px solid ${colors.primary500}`,
  backgroundColor: colors.white,
  color: colors.primary500,
  borderRadius: '8px',
  padding: '4px 8px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  cursor: 'pointer',
})

export const timeTextStyle = style({
  fontSize: fontStyles.bodyLg.fontSize,
  fontWeight: 500,
  color: colors.gray500,
})

export const badgeStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  padding: '4px 8px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
})

export const badgePresentStyle = style({
  backgroundColor: colors.success50,
  color: colors.success500,
})

export const badgeLateStyle = style({
  backgroundColor: colors.warning50,
  color: colors.warning500,
})

export const badgeAbsentStyle = style({
  backgroundColor: colors.error50,
  color: colors.error500,
})

export const selectNativeStyle = style({
  position: 'absolute',
  opacity: 0,
  width: '1px',
  height: '1px',
  pointerEvents: 'none',
})

export const endBtnStyle = style({
  width: '100%',
  border: 'none',
  borderRadius: '12px',
  padding: '16px 12px',
  backgroundColor: colors.primary500,
  color: colors.white,
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  cursor: 'pointer',
})
