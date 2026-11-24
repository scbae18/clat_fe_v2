import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { zIndex } from '@/styles/tokens/zIndex'

export const title = style({
  width: 'fit-content',
  cursor: 'help',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${colors.primary500}`,
      outlineOffset: '2px',
      borderRadius: '4px',
    },
  },
})

export const tooltip = style({
  position: 'fixed',
  left: 'var(--lesson-section-tip-x)',
  top: 'var(--lesson-section-tip-y)',
  transform: 'translate(0, calc(-100% - 6px))',
  zIndex: zIndex.tooltip,
  width: 'max-content',
  maxWidth: 'min(360px, calc(100vw - 24px))',
  padding: '6px 10px',
  borderRadius: '8px',
  backgroundColor: colors.gray900,
  color: colors.white,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  lineHeight: 1.45,
  letterSpacing: '-0.03em',
  pointerEvents: 'none',
})
