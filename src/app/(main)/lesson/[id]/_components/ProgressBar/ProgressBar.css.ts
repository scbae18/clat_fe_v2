import { style, globalStyle } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'
import { footerStyle } from '../../lessonDetail.css'

export const wrapperStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '36px',
  flex: 1,
  marginRight: '24px',
  '@media': {
    [media.phone]: {
      width: '100%',
      minWidth: 0,
      gap: '12px',
      marginRight: 0,
    },
  },
})

globalStyle(`${footerStyle} > button`, {
  '@media': {
    [media.phone]: {
      width: '100%',
    },
  },
})

export const labelStyle = style({
  fontSize: fontStyles.headingSm.fontSize,
  fontWeight: fontStyles.headingSm.fontWeight,
  color: colors.primary500,
  letterSpacing: '-0.03em',
  whiteSpace: 'nowrap',
})

export const trackStyle = style({
  flex: 1,
  height: '16px',
  backgroundColor: colors.gray50,
  borderRadius: '999px',
  overflow: 'hidden',
})

export const barStyle = style({
  height: '100%',
  backgroundColor: colors.primary500,
  borderRadius: '999px',
  transition: 'width 0.4s',
})

export const countStyle = style({
  fontSize: fontStyles.headingSm.fontSize,
  fontWeight: fontStyles.headingSm.fontWeight,
  color: colors.gray700,
  letterSpacing: '-0.03em',
  whiteSpace: 'nowrap',
})