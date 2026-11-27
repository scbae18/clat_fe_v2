import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const box = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '88px',
  textAlign: 'center',
  color: colors.gray700,
  fontSize: fontStyles.bodyMd.fontSize,
})
