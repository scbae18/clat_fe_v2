import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const page = style({
  maxWidth: '480px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
})

export const lead = style({
  margin: 0,
})

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const label = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: 600,
  color: colors.gray700,
})

export const input = style({
  padding: '14px 16px',
  borderRadius: '12px',
  border: `1px solid ${colors.gray100}`,
  fontSize: fontStyles.bodyLg.fontSize,
})
