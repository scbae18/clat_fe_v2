import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const panelStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minWidth: 0,
})

export const tabListStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '24px',
})

export const tabButtonStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.headingSm.fontSize,
  fontWeight: fontStyles.headingSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  color: colors.gray500,
  selectors: {
    '&[data-active="true"]': {
      color: colors.primary500,
    },
  },
})

export const tabUnderlineStyle = style({
  width: '100%',
  height: '2px',
  backgroundColor: 'transparent',
  selectors: {
    '[data-active="true"] &': {
      backgroundColor: colors.primary500,
    },
  },
})

export const captionStyle = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 400,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const captionMarkStyle = style({
  color: colors.primary500,
})

export const ruleStyle = style({
  height: '1px',
  backgroundColor: colors.gray100,
  border: 'none',
  margin: 0,
})

export const lessonStackStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  minWidth: 0,
})

export const scrollFrameStyle = style({
  position: 'relative',
  minWidth: 0,
})

export const fadeStyle = style({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: '80px',
  borderRadius: '0 8px 8px 0',
  background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${colors.white} 100%)`,
  pointerEvents: 'none',
})

export const hintStyle = style({
  display: 'flex',
  justifyContent: 'flex-end',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  color: colors.gray500,
})

export const emptyHintStyle = style({
  padding: '24px 16px',
  textAlign: 'center',
  color: colors.gray500,
  fontSize: fontStyles.bodyMd.fontSize,
})
