import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
})

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const item = style({
  display: 'flex',
  gap: '12px',
  alignItems: 'flex-start',
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: colors.gray50,
})

export const itemIndex = style({
  flexShrink: 0,
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  backgroundColor: colors.primary100,
  color: colors.primary500,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: 600,
  lineHeight: '28px',
  textAlign: 'center',
})

export const itemBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
})

export const itemDescription = style({
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  lineHeight: 1.65,
})

export const itemImage = style({
  display: 'block',
  width: '100%',
  maxHeight: '240px',
  marginTop: '8px',
  objectFit: 'contain',
  objectPosition: 'left center',
  borderRadius: '8px',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray75}`,
})

export const actions = style({
  marginTop: '24px',
})
