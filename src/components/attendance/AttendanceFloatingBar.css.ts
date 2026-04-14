import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

/** Figma node 732:2245 */
export const barWrapStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '24px',
  width: '100%',
  padding: '24px 32px',
  borderRadius: '20px',
  backgroundColor: colors.primary400,
  boxShadow: '0px 0px 30px 0px rgba(0,0,0,0.25)',
  boxSizing: 'border-box',
  '@media': {
    '(max-width: 1024px)': {
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  },
})

export const leftClusterStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '60px',
  flexWrap: 'wrap',
  rowGap: '16px',
})

export const titleBlockStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexShrink: 0,
})

export const titleTextGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '6px',
})

export const titleTextStyle = style({
  margin: 0,
  color: colors.white,
  fontSize: fontStyles.headingMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  whiteSpace: 'nowrap',
})

export const codeTextStyle = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.white,
  opacity: 0.95,
  whiteSpace: 'nowrap',
})

export const statsRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '40px',
})

export const statBlockStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2px',
  minWidth: '30px',
  color: colors.white,
})

export const statLabelStyle = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  textAlign: 'center',
  width: '100%',
})

export const statValueStyle = style({
  margin: 0,
  fontSize: '28px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  textAlign: 'center',
  width: '100%',
})

export const dividerStyle = style({
  width: '1px',
  height: '44px',
  backgroundColor: 'rgba(255,255,255,0.35)',
  flexShrink: 0,
})

export const rightClusterStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '28px',
  flexShrink: 0,
  flexWrap: 'wrap',
})

export const timeTextStyle = style({
  margin: 0,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.white,
  whiteSpace: 'nowrap',
})

export const actionsStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const btnSecondaryStyle = style({
  border: 'none',
  borderRadius: '8px',
  padding: '8px 12px',
  backgroundColor: colors.primary200,
  color: colors.primary500,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary300,
    },
  },
})

export const btnPrimaryStyle = style({
  border: 'none',
  borderRadius: '8px',
  padding: '8px 12px',
  backgroundColor: colors.primary500,
  color: colors.white,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary600,
    },
  },
})

export const timerIconStyle = style({
  flexShrink: 0,
  color: colors.white,
})
