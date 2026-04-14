import { style, keyframes } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

const fadeSlideIn = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
})

const fadeSlideOut = keyframes({
  from: { opacity: 1, transform: 'translateY(0)' },
  to: { opacity: 0, transform: 'translateY(8px)' },
})

export const containerStyle = style({
  position: 'fixed',
  top: '32px',
  right: '32px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'flex-end',
  pointerEvents: 'none',
})

export const toastStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: colors.gray700,
  color: colors.white,
  borderRadius: '12px',
  padding: '12px 16px',
  minWidth: '320px',
  maxWidth: '480px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  animation: `${fadeSlideIn} 0.25s ease-out`,
  pointerEvents: 'auto',
  whiteSpace: 'pre-wrap',
})

export const toastClosingStyle = style({
  animation: `${fadeSlideOut} 0.25s ease-in forwards`,
})
