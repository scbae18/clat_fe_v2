import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { media } from '@/styles/tokens/breakpoints'
import { zIndex } from '@/styles/tokens/zIndex'

const scrim = `color-mix(in srgb, ${colors.gray900} 45%, transparent)`
const lift = `0 12px 32px color-mix(in srgb, ${colors.gray900} 18%, transparent)`

export const spotlight = style({
  position: 'fixed',
  borderRadius: '12px',
  boxShadow: `0 0 0 9999px ${scrim}`,
  pointerEvents: 'none',
  zIndex: zIndex.tour,
})

export const tooltip = style({
  position: 'fixed',
  zIndex: zIndex.tour + 1,
  width: 'min(320px, calc(100vw - 32px))',
  background: colors.white,
  borderRadius: '16px',
  padding: '16px',
  boxShadow: lift,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const plainText = style({
  margin: 0,
  whiteSpace: 'pre-line',
})

export const tooltipActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '4px',
})

export const fallback = style({
  position: 'fixed',
  left: '16px',
  right: '16px',
  bottom: '96px',
  zIndex: zIndex.tour + 1,
  margin: '0 auto',
  maxWidth: '360px',
  background: colors.white,
  borderRadius: '16px',
  padding: '16px',
  boxShadow: lift,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const homeCard = style({
  background: colors.white,
  border: `1px solid ${colors.gray75}`,
  borderRadius: '12px',
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  '@media': {
    [media.phone]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
})

export const homeCopy = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

export const homeActions = style({
  display: 'flex',
  gap: '8px',
  flexShrink: 0,
})

export const dialogBody = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '12px',
  paddingBottom: '8px',
})

export const dialogActions = style({
  display: 'flex',
  gap: '8px',
  width: '100%',
})
