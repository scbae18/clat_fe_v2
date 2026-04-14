import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { sq } from 'date-fns/locale'

export const buttonRecipe = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    border: 'none',
    borderRadius: '8px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    fontFamily: 'Pretendard, sans-serif',
    transition: 'background-color 0.2s, opacity 0.2s',
    whiteSpace: 'nowrap',
    selectors: {
      '&:disabled': {
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: colors.primary500,
        color: colors.gray50,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: colors.primary600 },
          '&:active:not(:disabled)': { backgroundColor: colors.primary700 },
          '&:disabled': { backgroundColor: colors.gray300, color: colors.gray100 },
        },
      },
      secondary: {
        backgroundColor: colors.primary100,
        color: colors.primary500,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: colors.primary200 },
          '&:active:not(:disabled)': { backgroundColor: colors.primary300 },
          '&:disabled': { backgroundColor: colors.gray50, color: colors.gray200 },
        },
      },
      ghost: {
        backgroundColor: colors.gray50,
        color: colors.gray500,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: colors.gray75 },
          '&:active:not(:disabled)': { backgroundColor: colors.gray100 },
          '&:disabled': { backgroundColor: colors.gray50, color: colors.gray100 },
        },
      },
      outlined: {
        backgroundColor: colors.white,
        color: colors.gray700,
        outline: `1px solid ${colors.gray100}`,
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: colors.primary50,
            color: colors.primary500,
            outline: `1px solid ${colors.primary500}`,
          },
          '&:active:not(:disabled)': {
            backgroundColor: colors.primary50,
            color: colors.primary500,
            outline: `1px solid ${colors.primary500}`,
          },
          '&:disabled': { color: colors.gray100, outline: `1px solid ${colors.gray100}` },
        },
      },
      danger: {
        backgroundColor: colors.error500,
        color: colors.white,
        selectors: {
          '&:hover:not(:disabled)': { backgroundColor: colors.error600 },
          '&:active:not(:disabled)': { backgroundColor: colors.error700 },
          '&:disabled': { backgroundColor: colors.gray300, color: colors.gray100 },
        },
      },
      endClass: {
        backgroundColor: colors.white,
        color: colors.primary500,
        outline: `1px solid ${colors.primary200}`,
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: colors.primary500,
            color: colors.white,
            outline: `1px solid ${colors.primary500}`,
          },
          '&:active:not(:disabled)': {
            backgroundColor: colors.primary600,
          },
        },
      },
      deleteClass: {
        backgroundColor: colors.white,
        color: colors.error500,
        outline: `1px solid ${colors.error200}`,
        selectors: {
          '&:hover:not(:disabled)': {
            backgroundColor: colors.error500,
            color: colors.white,
            outline: `1px solid ${colors.error500}`,
          },
          '&:active:not(:disabled)': {
            backgroundColor: colors.error600,
          },
        },
      },
    },
    size: {
      sm: { padding: '8px 12px', fontSize: '14px', fontWeight: '600', borderRadius: '8px' },
      md: { padding: '12px 24px', fontSize: '14px', fontWeight: '600', borderRadius: '8px' },
      lg: { padding: '16px 24px', fontSize: '16px', fontWeight: '600', borderRadius: '12px' },
    },
    shape: {
      square: {},
      capsule: {
        height: '48px',
        borderRadius: '999px',
        padding: '0 32px',
      },
    },
    fullWidth: {
      true: { width: '100%' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    shape: 'square',
  },
})
