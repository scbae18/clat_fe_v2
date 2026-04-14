import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const formStyle = style({
  backgroundColor: colors.primary100,
  borderRadius: '8px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
})

export const fieldStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const typeGridStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
})

export const typeCardRecipe = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    backgroundColor: colors.white,
    border: `1px solid ${colors.gray300}`,
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
    textAlign: 'left',
    selectors: {
        '&:hover': {
            backgroundColor: colors.primary50,
            borderColor: colors.primary500,
        },
    }
  },
  variants: {
    selected: {
      true: {
        backgroundColor: colors.primary50,
        borderColor: colors.primary500,
        color: colors.primary500,
      },
      false: {
        color: colors.gray300,
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
})

export const typeCardTitleStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const typeCardDescStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  marginBottom: '12px',
})

export const actionsStyle = style({
  display: 'flex',
  gap: '8px',
})

export const labelStyle = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  color: colors.gray900,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const tagInputContainerStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 12px',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray200}`,
  borderRadius: '8px',
  minHeight: '40px',
})

export const tagStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 8px',
  backgroundColor: colors.primary100,
  borderRadius: '4px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  color: colors.primary500,
  letterSpacing: '-0.03em',
})

export const tagRemoveButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  color: colors.primary500,
})

export const tagInputStyle = style({
  flex: 1,
  minWidth: '100px',
  border: 'none',
  outline: 'none',
  background: 'none',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  color: colors.gray900,
  letterSpacing: '-0.03em',
  '::placeholder': {
    color: colors.gray300,
  },
})

export const completionInfoStyle = style({
  padding: '12px',
  backgroundColor: colors.primary50,
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const completionInfoTitleStyle = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  color: colors.primary500,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})

export const completionInfoListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  paddingLeft: '16px',
  listStyle: 'disc',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  color: colors.gray700,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
})