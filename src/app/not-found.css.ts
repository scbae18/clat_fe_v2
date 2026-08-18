import { style } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'
import { fontStyles } from '@/styles/tokens/typography'

export const wrap = style({
  padding: '80px 24px',
  textAlign: 'center',
  color: vars.color.gray[900],
  ...fontStyles.headingLg,
})
