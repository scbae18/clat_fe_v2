import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const wrap = style({
  width: '100%',
  containerType: 'inline-size',
})

export const grid = style({
  display: 'grid',
  gap: '12px',
  gridTemplateColumns: '1fr',
  '@container': {
    '(min-width: 560px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '(min-width: 1100px)': {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
  },
})

export const card = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    minHeight: '176px',
    padding: '16px 18px 18px',
    borderRadius: '16px',
    textDecoration: 'none',
    overflow: 'hidden',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    selectors: {
      '&:hover': {
        transform: 'translateY(-2px)',
      },
      '&:focus-visible': {
        outline: `2px solid ${colors.primary500}`,
        outlineOffset: '2px',
      },
    },
  },
  variants: {
    tone: {
      lesson: {
        backgroundColor: colors.primary500,
        color: colors.white,
        selectors: {
          '&:hover': {
            boxShadow: `0 8px 24px ${colors.primary500}4d`,
          },
        },
      },
      broadcast: {
        backgroundColor: colors.primary400,
        color: colors.white,
        selectors: {
          '&:hover': {
            boxShadow: `0 8px 24px ${colors.primary400}4d`,
          },
        },
      },
      history: {
        backgroundColor: colors.primary300,
        color: colors.primary700,
        selectors: {
          '&:hover': {
            boxShadow: `0 8px 24px ${colors.primary400}33`,
          },
        },
      },
      students: {
        backgroundColor: colors.primary100,
        color: colors.primary500,
        selectors: {
          '&:hover': {
            boxShadow: `0 8px 24px ${colors.primary400}2e`,
          },
        },
      },
    },
  },
})

export const iconWriting = style({
  width: '36px',
  height: '36px',
  flexShrink: 0,
})

export const iconSend = style({
  width: '36px',
  height: '36px',
  flexShrink: 0,
})

export const iconKakao = style({
  width: '48px',
  height: '48px',
  flexShrink: 0,
  marginLeft: '-6px',
  marginTop: '-6px',
  marginBottom: '-6px',
})

export const iconPerson = style({
  width: '43px',
  height: '37px',
  flexShrink: 0,
  marginLeft: '-2px',
})

export const iconImgCover = style({
  display: 'block',
  width: '36px',
  height: '36px',
  objectFit: 'cover',
})

export const iconImgKakao = style({
  display: 'block',
  width: '48px',
  height: '48px',
  objectFit: 'contain',
})

export const iconImgPerson = style({
  display: 'block',
  width: '43px',
  height: '37px',
  objectFit: 'contain',
})

export const titleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
  marginTop: '12px',
  minWidth: 0,
})

export const title = style({
  fontSize: fontStyles.headingSm.fontSize,
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: 'inherit',
  minWidth: 0,
  wordBreak: 'keep-all',
})

export const chevron = style({
  display: 'flex',
  flexShrink: 0,
  color: 'inherit',
})

export const footer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: 'auto',
  paddingTop: '16px',
})

export const statRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '8px',
  minWidth: 0,
})

export const statLabel = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: 'inherit',
  minWidth: 0,
})

export const statValue = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '2px',
  flexShrink: 0,
  color: 'inherit',
})

export const statNumber = style({
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: 800,
  lineHeight: 1.2,
  letterSpacing: '-0.03em',
})

export const statUnit = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  paddingBottom: '2px',
})

export const hint = style({
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: 'inherit',
  wordBreak: 'keep-all',
})

export const progressTrack = recipe({
  base: {
    display: 'block',
    width: '100%',
    height: '10px',
    borderRadius: '99px',
    overflow: 'hidden',
  },
  variants: {
    tone: {
      lesson: {
        backgroundColor: colors.primary800,
      },
      students: {
        backgroundColor: colors.primary50,
      },
    },
  },
})

export const progressFill = recipe({
  base: {
    display: 'block',
    height: '100%',
    borderRadius: '99px',
    transition: 'width 0.3s ease',
  },
  variants: {
    tone: {
      lesson: {
        backgroundColor: colors.primary200,
      },
      students: {
        backgroundColor: colors.primary500,
      },
    },
  },
})
