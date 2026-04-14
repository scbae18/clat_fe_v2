import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const tableStyle = style({
  width: '100%',
  borderCollapse: 'collapse',
  border: `1px solid ${colors.gray100}`,
  overflow: 'hidden',
})

const baseThStyles = {
  height: '40px',
  paddingLeft: '16px',
  backgroundColor: colors.gray50,
  color: colors.gray900,
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  textAlign: 'left' as const,
  borderBottom: `1px solid ${colors.gray100}`,
  borderRight: `1px solid ${colors.gray100}`,
  whiteSpace: 'nowrap' as const,
  selectors: {
    '&:last-child': { borderRight: 'none' as const },
  },
}

const baseTdStyles = {
  height: '40px',
  paddingLeft: '16px',
  backgroundColor: colors.white,
  borderBottom: `1px solid ${colors.gray100}`,
  borderRight: `1px solid ${colors.gray100}`,
  selectors: {
    '&:last-child': { borderRight: 'none' as const },
    'tr:last-child &': { borderBottom: 'none' as const },
  },
}

// 기본 (메모)
export const thStyle = style({ ...baseThStyles, paddingRight: '16px' })
export const tdStyle = style({ ...baseTdStyles, paddingRight: '16px' })

// 학생, 출결: 콘텐츠 너비 + paddingRight 36
export const thCompactStyle = style({ ...baseThStyles, paddingRight: '36px', width: '1%' })
export const tdCompactStyle = style({ ...baseTdStyles, paddingRight: '36px', width: '1%' })

// 과제, 오답노트, 시험 점수: 헤더 콘텐츠 기준 수축
export const thShrinkStyle = style({ ...baseThStyles, paddingRight: '16px', width: '1%' })
export const tdShrinkStyle = style({ ...baseTdStyles, paddingRight: '16px', width: '1%' })

export const cellButtonGroupStyle = style({
  display: 'flex',
  gap: '4px',
})

export const cellButtonRecipe = recipe({
  base: {
    height: '24px',
    width: '44px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: fontStyles.labelSm.fontSize,
    fontWeight: fontStyles.labelSm.fontWeight,
    letterSpacing: '-0.03em',
    lineHeight: '140%',
    transition: 'background-color 0.15s',
    border: 'none',
  },
  variants: {
    variant: {
      default: {
        backgroundColor: colors.gray50,
        color: colors.gray300,
      },
      attend: {
        backgroundColor: colors.success500,
        color: colors.white,
      },
      late: {
        backgroundColor: colors.warning500,
        color: colors.white,
      },
      absent: {
        backgroundColor: colors.error500,
        color: colors.white,
      },
      done: {
        backgroundColor: colors.success500,
        color: colors.white,
      },
      undone: {
        backgroundColor: colors.error500,
        color: colors.white,
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export const cellEditableStyle = style({
  width: '100%',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray700,
  letterSpacing: '-0.03em',
  outline: 'none',
  cursor: 'text',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  selectors: {
    '&:empty::before': {
      content: '"—"',
      color: colors.gray300,
      pointerEvents: 'none',
    },
  },
})

export const nameCellStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray700,
  letterSpacing: '-0.03em',
  whiteSpace: 'nowrap',
})

export const thInnerStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  whiteSpace: 'nowrap',
})

export const checkboxLabelStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  color: colors.gray300,
  letterSpacing: '-0.03em',
})

export const checkboxLabelActiveStyle = style({
  color: colors.primary500,
})

export const activeRowStyle = style({
  backgroundColor: colors.success50,
})