import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { baseCardStyleRule } from '@/styles/tokens/card'

export const cardStyle = style({
  ...baseCardStyleRule,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const chipGroupStyle = style({
  display: 'flex',
  gap: '4px',
})

export const progressWrapperStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '4px',
})

export const progressLabelStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const progressTrackStyle = style({
  width: '100%',
  height: '16px',
  backgroundColor: colors.primary50,
  borderRadius: '999px',
  overflow: 'hidden',
})

export const progressBarStyle = style({
  height: '100%',
  backgroundColor: colors.primary500,
  borderRadius: '999px',
  transition: 'width 0.3s',
})
