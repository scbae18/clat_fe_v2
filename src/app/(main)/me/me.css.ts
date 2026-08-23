import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'

export const pageRoot = style({
  width: '100%',
  maxWidth: '760px',
})

export const pageTitle = style({
  margin: '0 0 8px',
  fontSize: '39px',
  fontWeight: 700,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
  '@media': {
    [media.phone]: {
      fontSize: '24px',
    },
  },
})

export const pageDesc = style({
  margin: '0 0 40px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const cardStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const card = style({
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '20px',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
})

export const profileTop = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
})

export const avatar = style({
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${colors.primary300} 0%, ${colors.primary500} 100%)`,
  flexShrink: 0,
  color: colors.white,
  fontSize: '22px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  letterSpacing: '-0.03em',
})

export const profileName = style({
  fontSize: '22px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const profileEmail = style({
  marginTop: '2px',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
  wordBreak: 'break-all',
})

export const profileMeta = style({
  marginTop: '4px',
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.labelSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const sectionHead = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: 'wrap',
})

export const sectionTitle = style({
  margin: 0,
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
  whiteSpace: 'nowrap',
})

export const sectionDesc = style({
  margin: '6px 0 0',
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const fieldGrid = style({
  display: 'grid',
  gridTemplateColumns: '120px 1fr',
  columnGap: '16px',
  rowGap: '14px',
  alignItems: 'center',
  '@media': {
    [media.phone]: {
      gridTemplateColumns: '1fr',
      rowGap: '8px',
    },
  },
})

export const fieldLabel = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray700,
  whiteSpace: 'nowrap',
})

export const fieldValue = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.gray900,
  wordBreak: 'break-all',
})

export const input = style({
  width: '100%',
  height: '40px',
  padding: '0 14px',
  borderRadius: '10px',
  border: `1px solid ${colors.gray100}`,
  background: colors.white,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
  color: colors.gray900,
  outline: 'none',
  letterSpacing: '-0.03em',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
  selectors: {
    '&:focus': {
      borderColor: colors.primary400,
    },
    '&::placeholder': {
      color: colors.gray300,
    },
  },
})

export const modalFieldStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginTop: '8px',
})

export const modalField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const errorText = style({
  margin: 0,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.error500,
})

export const actionsRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  flexWrap: 'wrap',
})

export const modalActions = style({
  display: 'flex',
  gap: '8px',
  marginTop: '24px',
})

export const dangerCard = style({
  backgroundColor: colors.white,
  border: `1px solid ${colors.error200}`,
  borderRadius: '20px',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const dangerTitle = style({
  margin: 0,
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
  color: colors.error500,
  whiteSpace: 'nowrap',
})

export const emptyState = style({
  padding: '48px 16px',
  textAlign: 'center',
  color: colors.gray500,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 500,
})
