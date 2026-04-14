import { style, keyframes } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '60px',
  paddingBottom: '80px',
})

export const headerStyle = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const backButtonStyle = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: colors.gray500,
  display: 'flex',
  alignItems: 'center',
  selectors: {
    '&:hover': {
      color: colors.gray700,
    },
  },
})

export const headerLeftStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

export const headerButtonGroupStyle = style({
  display: 'flex',
  gap: '8px',
})

export const footerStyle = style({
  position: 'fixed',
  bottom: 0,
  left: '240px',
  right: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 48px',
  backgroundColor: colors.primary100,
  borderTop: `1px solid ${colors.gray100}`,
  zIndex: 100,
})

export const sectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
})

export const templateSectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const templateLabelRowStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

export const templateChipGroupStyle = style({
  display: 'flex',
  gap: '8px',
})

const shimmer = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.4 },
})

export const skeletonSectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
})

export const skeletonTableStyle = style({
  width: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  border: `1px solid ${colors.gray100}`,
  display: 'flex',
  flexDirection: 'column',
})

export const skeletonRowStyle = style({
  height: '48px',
  backgroundColor: colors.gray100,
  animation: `${shimmer} 1.5s ease-in-out infinite`,
  selectors: {
    '& + &': {
      borderTop: `1px solid ${colors.white}`,
    },
  },
})

export const templateChipRecipe = recipe({
  base: {
    height: '40px',
    padding: '0 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: fontStyles.bodyMd.fontSize,
    fontWeight: fontStyles.bodyMd.fontWeight,
    letterSpacing: '-0.03em',
    lineHeight: '140%',
    transition: 'background-color 0.15s, border-color 0.15s, color 0.15s',
  },
  variants: {
    selected: {
      true: {
        backgroundColor: colors.primary100,
        border: `1px solid ${colors.primary500}`,
        color: colors.primary500,
      },
      false: {
        backgroundColor: colors.white,
        border: `1px solid ${colors.gray100}`,
        color: colors.gray500,
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
})

export const templateChipButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '8px 12px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: colors.gray50,
  color: colors.gray500,
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  cursor: 'pointer',
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  selectors: {
    '&:hover': {
      backgroundColor: colors.gray75,
    },
  },
})