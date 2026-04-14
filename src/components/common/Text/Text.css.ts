import { styleVariants } from '@vanilla-extract/css'
import { fontStyles } from '@/styles/tokens/typography'
import { colors } from '@/styles/tokens/colors'

export const textVariants = styleVariants(fontStyles, ({ fontSize, fontWeight }) => ({
  fontSize,
  fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
}))

export const textColors = styleVariants(colors, (value) => ({
  color: value,
}))
