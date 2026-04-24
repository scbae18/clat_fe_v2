import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const pageRoot = style({
  width: '100%',
  maxWidth: '760px',
})

export const headerRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '32px',
})

export const pageTitle = style({
  margin: 0,
  fontSize: '28px',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const cardStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const card = style({
  background: colors.white,
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
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const profileEmail = style({
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
  marginTop: '2px',
})

export const profileMeta = style({
  marginTop: '4px',
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray500,
})

export const sectionHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
})

export const sectionTitle = style({
  margin: 0,
  fontSize: '18px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const sectionDesc = style({
  margin: 0,
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const fieldGrid = style({
  display: 'grid',
  gridTemplateColumns: '140px 1fr',
  columnGap: '16px',
  rowGap: '14px',
  alignItems: 'center',
})

export const fieldLabel = style({
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const fieldValue = style({
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const input = style({
  width: '100%',
  height: '40px',
  padding: '0 14px',
  borderRadius: '10px',
  border: `1px solid ${colors.gray100}`,
  background: colors.white,
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray900,
  outline: 'none',
  letterSpacing: '-0.03em',
  transition: 'border-color 0.15s',
  ':focus': {
    borderColor: colors.primary400,
  },
  '::placeholder': {
    color: colors.gray300,
  },
})

export const inputError = style({
  borderColor: colors.error500,
})

export const helperText = style({
  margin: '6px 0 0',
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray500,
  letterSpacing: '-0.03em',
})

export const errorText = style({
  margin: '6px 0 0',
  fontSize: '12px',
  fontWeight: 500,
  color: colors.error500,
  letterSpacing: '-0.03em',
})

export const actionsRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
})

export const button = style({
  border: 'none',
  cursor: 'pointer',
  padding: '10px 18px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '-0.03em',
  transition: 'all 0.15s',
  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.55,
  },
})

export const buttonPrimary = style({
  background: colors.primary500,
  color: colors.white,
  ':hover': {
    background: colors.primary600,
  },
})

export const buttonGhost = style({
  background: colors.gray50,
  color: colors.gray700,
  ':hover': {
    background: colors.gray75,
  },
})

export const buttonDanger = style({
  background: colors.error500,
  color: colors.white,
  ':hover': {
    background: colors.error600,
  },
})

export const buttonDangerGhost = style({
  background: colors.white,
  color: colors.error500,
  border: `1px solid ${colors.error200}`,
  ':hover': {
    background: colors.error50,
  },
})

export const dangerCard = style({
  background: colors.white,
  border: `1px solid ${colors.error200}`,
  borderRadius: '20px',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const dangerTitle = style({
  margin: 0,
  fontSize: '18px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.error500,
})

export const emptyState = style({
  padding: '48px 16px',
  textAlign: 'center',
  color: colors.gray500,
  fontSize: '14px',
  fontWeight: 500,
})

export const backButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  borderRadius: '8px',
  ':hover': {
    background: colors.gray50,
  },
})
