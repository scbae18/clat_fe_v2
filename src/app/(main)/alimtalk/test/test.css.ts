import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

export const layout = style({
  display: 'grid',
  gridTemplateColumns: '222px minmax(0, 1fr)',
  gap: '24px',
  alignItems: 'start',
  '@media': {
    [media.tablet]: {
      gridTemplateColumns: '1fr',
    },
  },
})

export const menu = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  minWidth: 0,
})

export const infoCard = style({
  backgroundColor: colors.white,
  borderRadius: '16px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  boxSizing: 'border-box',
})

export const infoTitle = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const infoPhone = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const infoRemain = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const menuList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
})

export const menuButton = style({
  width: '100%',
  height: '48px',
  borderRadius: '8px',
  border: `1px solid ${colors.gray100}`,
  backgroundColor: colors.white,
  color: colors.gray900,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.gray50,
    },
  },
})

export const menuButtonActive = style({
  borderColor: colors.primary500,
  backgroundColor: colors.primary500,
  color: colors.white,
  selectors: {
    '&:hover': {
      backgroundColor: colors.primary500,
    },
  },
})

export const detail = style({
  backgroundColor: colors.white,
  borderRadius: '16px',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  boxSizing: 'border-box',
  minWidth: 0,
  '@media': {
    [media.phone]: {
      padding: '20px',
    },
  },
})

export const detailTitle = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '24px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const detailHint = style({
  margin: '4px 0 0',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const lessonTable = style({
  selectors: {
    '&&': {
      minWidth: 0,
    },
  },
})

export const attendanceCol = style({
  width: '172px',
})

export const codeBox = style({
  border: `1px solid ${colors.gray100}`,
  borderRadius: '8px',
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

export const codeLabel = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const codeValue = style({
  margin: 0,
  fontFamily: 'Pretendard, sans-serif',
  fontSize: '22px',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const noticeBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const noticeBox = style({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '8px',
  overflow: 'hidden',
})

export const noticeArea = style({
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '96px',
  margin: 0,
  padding: '16px 16px 8px',
  border: 'none',
  outline: 'none',
  resize: 'none',
  backgroundColor: 'transparent',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: 1.5,
  letterSpacing: '-0.03em',
  color: colors.gray700,
  selectors: {
    '&:focus': {
      outline: 'none',
      border: 'none',
      boxShadow: 'none',
    },
    '&::placeholder': {
      color: colors.gray300,
    },
  },
})
