import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const addCardStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  backgroundColor: colors.gray50,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '16px',
  padding: '24px',
  cursor: 'pointer',
  width: '100%',
  height: '100%',
  transition: 'background-color 0.2s',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: colors.primary50,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      color: colors.gray300,
    },
  },
  color: colors.gray300,
})

export const descriptionStyle = style({
  color: colors.gray300,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  textAlign: 'center',
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})