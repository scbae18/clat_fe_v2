import { styleVariants } from '@vanilla-extract/css'
import { fontStyles } from '@/styles/tokens/typography'
import { colors } from '@/styles/tokens/colors'
import { media } from '@/styles/tokens/breakpoints'

export const textVariants = styleVariants({
  display: {
    fontSize: fontStyles.display.fontSize,
    fontWeight: fontStyles.display.fontWeight,
    lineHeight: '140%',
    letterSpacing: '-0.03em',
    '@media': {
      [media.phone]: { fontSize: '22px' },
    },
  },
  headingLg: {
    fontSize: fontStyles.headingLg.fontSize,
    fontWeight: fontStyles.headingLg.fontWeight,
    lineHeight: '140%',
    letterSpacing: '-0.03em',
  },
  headingMd: {
    fontSize: fontStyles.headingMd.fontSize,
    fontWeight: fontStyles.headingMd.fontWeight,
    lineHeight: '140%',
    letterSpacing: '-0.03em',
    '@media': {
      [media.phone]: { fontSize: '18px' },
    },
  },
  headingSm: {
    fontSize: fontStyles.headingSm.fontSize,
    fontWeight: fontStyles.headingSm.fontWeight,
    lineHeight: '140%',
    letterSpacing: '-0.03em',
  },
  titleMd: {
    fontSize: fontStyles.titleMd.fontSize,
    fontWeight: fontStyles.titleMd.fontWeight,
    lineHeight: '140%',
    letterSpacing: '-0.03em',
  },
  titleSm: {
    fontSize: fontStyles.titleSm.fontSize,
    fontWeight: fontStyles.titleSm.fontWeight,
    lineHeight: '140%',
    letterSpacing: '-0.03em',
  },
  bodyLg: {
    fontSize: fontStyles.bodyLg.fontSize,
    fontWeight: fontStyles.bodyLg.fontWeight,
    lineHeight: '140%',
    letterSpacing: '-0.03em',
  },
  bodyMd: {
    fontSize: fontStyles.bodyMd.fontSize,
    fontWeight: fontStyles.bodyMd.fontWeight,
    lineHeight: '140%',
    letterSpacing: '-0.03em',
  },
  labelSm: {
    fontSize: fontStyles.labelSm.fontSize,
    fontWeight: fontStyles.labelSm.fontWeight,
    lineHeight: '140%',
    letterSpacing: '-0.03em',
  },
})

export const textColors = styleVariants(colors, (value) => ({
  color: value,
}))
