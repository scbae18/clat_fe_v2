import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const pageRoot = style({
  width: '100%',
  maxWidth: '1200px',
})

export const headerRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '32px',
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

export const pageTitle = style({
  fontSize: '28px',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const columns = style({
  display: 'flex',
  gap: '24px',
  alignItems: 'flex-start',
})

export const leftCol = style({
  width: '448px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
})

export const profileCard = style({
  background: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '20px',
  padding: '27px',
  minHeight: '316px',
})

export const profileTop = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '32px',
})

export const avatar = style({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${colors.primary300} 0%, ${colors.primary500} 100%)`,
  flexShrink: 0,
})

export const profileName = style({
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const infoGrid = style({
  display: 'grid',
  gridTemplateColumns: '110px 1fr',
  columnGap: '48px',
  rowGap: '12px',
  alignItems: 'center',
})

export const infoLabelCell = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const infoValueCell = style({
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const statsRow = style({
  display: 'flex',
  gap: '8px',
})

export const statMini = style({
  width: '144px',
  background: colors.gray50,
  borderRadius: '12px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

export const statMiniLabel = style({
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const statMiniValue = style({
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const statTrendRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginTop: '4px',
})

export const statTrendMuted = style({
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.primary400,
})

export const statTrendDown = style({
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.error500,
})

export const incompleteCard = style({
  background: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '20px',
  padding: '28px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
})

export const incompleteTitle = style({
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const incompleteCount = style({
  color: colors.primary500,
})

export const incompleteList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const incompleteRow = style({
  position: 'relative',
  height: '51px',
  background: colors.gray50,
  borderRadius: '12px',
  padding: '0 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: 'none',
  width: '100%',
  cursor: 'pointer',
  textAlign: 'left',
  ':hover': {
    filter: 'brightness(0.98)',
  },
})

export const incompleteLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: 0,
})

export const incompleteName = style({
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray700,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '200px',
})

export const badgeOverdue = style({
  background: '#fee5e5',
  color: colors.error500,
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  padding: '4px 8px',
  borderRadius: '6px',
  flexShrink: 0,
})

export const badgeNote = style({
  background: colors.primary100,
  color: colors.primary400,
  fontSize: '12px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  padding: '4px 8px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  flexShrink: 0,
})

export const rightCol = style({
  flex: 1,
  minWidth: 0,
  maxWidth: '636px',
})

export const panelCard = style({
  background: colors.white,
  border: `1px solid ${colors.gray50}`,
  borderRadius: '20px',
  overflow: 'hidden',
  minHeight: '731px',
  display: 'flex',
  flexDirection: 'column',
})

export const tabRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '32px',
  padding: '27px 27px 0',
  borderBottom: `1px solid ${colors.gray50}`,
  position: 'relative',
})

export const tabBtn = style({
  padding: '0 0 16px',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray500,
  position: 'relative',
})

export const tabBtnActive = style({
  color: colors.gray900,
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '-1px',
      height: '2px',
      background: colors.gray900,
      borderRadius: '1px',
    },
  },
})

export const panelBody = style({
  padding: '20px 27px 27px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})

export const periodRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '20px',
})

export const periodChip = style({
  border: 'none',
  cursor: 'pointer',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  background: colors.white,
  color: colors.gray500,
})

export const periodChipActive = style({
  background: colors.gray50,
  color: colors.gray700,
})

export const chartWrap = style({
  position: 'relative',
  width: '100%',
  minHeight: '360px',
  marginBottom: '16px',
  overflow: 'visible',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

export const chartSvgArea = style({
  flex: 1,
  minHeight: '260px',
  width: '100%',
})

export const chartTooltip = style({
  position: 'absolute',
  zIndex: 10,
  pointerEvents: 'none',
  minWidth: '180px',
  maxWidth: '260px',
  padding: '10px 12px',
  borderRadius: '10px',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray100}`,
  boxShadow: '0 4px 16px rgba(54, 55, 68, 0.12)',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.45,
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const chartTooltipTitle = style({
  fontSize: '13px',
  fontWeight: 600,
  color: colors.gray900,
  marginBottom: '6px',
})

export const chartTooltipRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '12px',
  marginTop: '2px',
})

export const chartTooltipMuted = style({
  color: colors.gray500,
  flexShrink: 0,
})

export const chartLegend = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px 16px',
  marginTop: '8px',
  marginBottom: '4px',
})

export const chartLegendItem = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray600,
  letterSpacing: '-0.03em',
})

export const chartLegendSwatch = style({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  flexShrink: 0,
})

export const aiBox = style({
  background: colors.primary50,
  borderRadius: '12px',
  padding: '20px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  marginTop: 'auto',
})

export const aiTitleRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '4px',
})

export const aiTitle = style({
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.primary500,
})

export const aiBody = style({
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray700,
  whiteSpace: 'pre-wrap',
})

export const aiToolbar = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: '4px',
})

export const aiRefreshBtn = style({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 600,
  color: colors.primary400,
  textDecoration: 'underline',
})

export const listTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
})

export const th = style({
  textAlign: 'left',
  padding: '10px 8px',
  color: colors.gray500,
  fontWeight: 600,
  borderBottom: `1px solid ${colors.gray50}`,
})

export const td = style({
  padding: '12px 8px',
  color: colors.gray700,
  fontWeight: 500,
  borderBottom: `1px solid ${colors.gray50}`,
})

export const emptyState = style({
  padding: '48px 16px',
  textAlign: 'center',
  color: colors.gray500,
  fontSize: '14px',
  fontWeight: 500,
})

export const infoIconBtn = style({
  display: 'inline-flex',
  border: 'none',
  background: 'transparent',
  padding: 0,
  marginLeft: '4px',
  cursor: 'default',
  verticalAlign: 'middle',
})
