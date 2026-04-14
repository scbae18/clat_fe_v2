import { createGlobalTheme } from '@vanilla-extract/css'
import { colors } from './tokens/colors'

export const vars = createGlobalTheme(':root', {
  color: {
    primary: {
      50: colors.primary50,
      100: colors.primary100,
      200: colors.primary200,
      300: colors.primary300,
      400: colors.primary400,
      500: colors.primary500,
      600: colors.primary600,
      700: colors.primary700,
      800: colors.primary800,
    },
    gray: {
      50: colors.gray50,
      75: colors.gray75,
      100: colors.gray100,
      200: colors.gray200,
      300: colors.gray300,
      500: colors.gray500,
      600: colors.gray600,
      700: colors.gray700,
      900: colors.gray900,
    },
    semantic: {
      success: {
        50: colors.success50,
        200: colors.success200,
        500: colors.success500,
      },
      warning: {
        50: colors.warning50,
        200: colors.warning200,
        500: colors.warning500,
      },
      error: {
        50: colors.error50,
        200: colors.error200,
        500: colors.error500,
        600: colors.error600,
        700: colors.error700,
      },
    },
  },
})
