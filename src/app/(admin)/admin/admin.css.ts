import { globalStyle, style, styleVariants } from '@vanilla-extract/css'
import { vars } from '@/styles/theme.css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

const tracking = '-0.03em'

export const shell = style({
  minHeight: '100vh',
  backgroundColor: colors.background,
})

export const sidebar = style({
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 40,
  display: 'flex',
  height: '100vh',
  width: '240px',
  flexShrink: 0,
  flexDirection: 'column',
  backgroundColor: vars.color.gray[900],
})

export const brandWrap = style({
  display: 'flex',
  alignItems: 'center',
  padding: '56px 36px 40px',
})

export const brandLink = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

export const brandTitle = style({
  fontSize: '15px',
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: tracking,
  color: colors.white,
})

export const brandSub = style({
  marginTop: '2px',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: tracking,
  color: vars.color.gray[500],
})

export const nav = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  gap: '8px',
  padding: '0 24px',
})

const navLinkBase = style({
  display: 'flex',
  height: '48px',
  alignItems: 'center',
  gap: '16px',
  borderRadius: '8px',
  padding: '0 16px',
  fontSize: '16px',
  fontWeight: 600,
  letterSpacing: tracking,
  transition: 'color 0.15s',
})

export const navLink = styleVariants({
  idle: [
    navLinkBase,
    {
      color: vars.color.gray[600],
      selectors: {
        '&:hover': { color: vars.color.gray[300] },
      },
    },
  ],
  active: [navLinkBase, { color: colors.white }],
})

export const sidebarFooter = style({
  borderTop: '1px solid rgba(255,255,255,0.1)',
  padding: '20px 24px',
})

export const footerLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '12px',
  color: vars.color.gray[500],
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: tracking,
})

export const footerLabelText = style({
  color: vars.color.gray[300],
})

export const footerHint = style({
  fontSize: '11px',
  fontWeight: 500,
  lineHeight: 1.6,
  letterSpacing: tracking,
  color: vars.color.gray[600],
})

export const teacherAppLink = style({
  display: 'inline-block',
  marginTop: '12px',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: tracking,
  color: vars.color.primary[300],
  selectors: {
    '&:hover': { color: colors.white },
  },
})

export const main = style({
  minHeight: '100vh',
  paddingLeft: '240px',
})

export const mainInner = style({
  margin: '0 auto',
  minHeight: '100vh',
  maxWidth: '1200px',
  padding: '48px',
})

export const stack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
})

export const pageHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  '@media': {
    '(min-width: 640px)': {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
  },
})

export const pageTitle = style({
  fontSize: '24px',
  fontWeight: 600,
  letterSpacing: tracking,
  color: vars.color.gray[900],
})

export const pageSub = style({
  marginTop: '4px',
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: tracking,
  color: vars.color.gray[500],
})

export const sectionTitle = style({
  marginBottom: '16px',
  fontSize: '18px',
  fontWeight: 600,
  letterSpacing: tracking,
  color: vars.color.gray[900],
})

export const sectionTitleInline = style({
  marginBottom: 0,
  fontSize: '18px',
  fontWeight: 600,
  letterSpacing: tracking,
  color: vars.color.gray[900],
})

export const kpiGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '16px',
  '@media': {
    '(min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
  },
})

export const kpiGrid3 = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '16px',
})

export const grid2 = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px',
  '@media': {
    '(min-width: 1024px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
})

export const statCard = style({
  borderRadius: '16px',
  border: `1px solid ${vars.color.gray[100]}`,
  backgroundColor: colors.white,
  padding: '24px',
})

export const statCardAccent = styleVariants({
  primary: [statCard, { borderLeft: `4px solid ${vars.color.primary[500]}` }],
  success: [statCard, { borderLeft: `4px solid ${vars.color.semantic.success[500]}` }],
  warning: [statCard, { borderLeft: `4px solid ${vars.color.semantic.warning[500]}` }],
  error: [statCard, { borderLeft: `4px solid ${vars.color.semantic.error[500]}` }],
})

export const statTop = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px',
})

export const statLabel = style({
  fontSize: '14px',
  fontWeight: 500,
  color: vars.color.gray[500],
})

export const iconBox = styleVariants({
  primary50: {
    display: 'flex',
    height: '36px',
    width: '36px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    backgroundColor: vars.color.primary[50],
    color: vars.color.primary[500],
  },
  primary100: {
    display: 'flex',
    height: '36px',
    width: '36px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    backgroundColor: vars.color.primary[100],
    color: vars.color.primary[600],
  },
  success: {
    display: 'flex',
    height: '36px',
    width: '36px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    backgroundColor: vars.color.semantic.success[50],
    color: vars.color.semantic.success[500],
  },
  warning: {
    display: 'flex',
    height: '36px',
    width: '36px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    backgroundColor: vars.color.semantic.warning[50],
    color: vars.color.semantic.warning[500],
  },
  error: {
    display: 'flex',
    height: '36px',
    width: '36px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    backgroundColor: vars.color.semantic.error[50],
    color: vars.color.semantic.error[600],
  },
  gray: {
    display: 'flex',
    height: '36px',
    width: '36px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    backgroundColor: vars.color.gray[50],
    color: vars.color.gray[600],
  },
})

export const statValueRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '8px',
})

export const statValue = style({
  fontSize: '30px',
  fontWeight: 700,
  lineHeight: 1.2,
  color: vars.color.gray[900],
})

export const statValueSuccess = style([statValue, { color: vars.color.semantic.success[500] }])
export const statValueWarning = style([statValue, { color: vars.color.semantic.warning[500] }])
export const statValueError = style([statValue, { color: vars.color.semantic.error[600] }])

export const statHint = style({
  marginTop: '4px',
  fontSize: '12px',
  fontWeight: 500,
  color: vars.color.gray[500],
})

export const wow = styleVariants({
  up: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    marginBottom: '4px',
    fontSize: '12px',
    fontWeight: 600,
    color: vars.color.semantic.success[500],
  },
  down: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    marginBottom: '4px',
    fontSize: '12px',
    fontWeight: 600,
    color: vars.color.semantic.error[500],
  },
  flat: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    marginBottom: '4px',
    fontSize: '12px',
    fontWeight: 600,
    color: vars.color.gray[500],
  },
})

export const card = style({
  overflow: 'hidden',
  borderRadius: '16px',
  border: `1px solid ${vars.color.gray[100]}`,
  backgroundColor: colors.white,
})

export const cardHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${vars.color.gray[100]}`,
  padding: '16px 24px',
})

export const cardTitle = style({
  fontSize: '16px',
  fontWeight: 600,
  color: vars.color.gray[900],
})

export const cardTitleMuted = style({
  fontSize: '16px',
  fontWeight: 600,
  color: vars.color.gray[500],
})

export const tableWrap = style({
  overflowX: 'auto',
})

export const table = style({
  width: '100%',
  textAlign: 'left',
  fontSize: '14px',
  letterSpacing: tracking,
})

export const th = style({
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: 600,
  color: vars.color.gray[900],
  backgroundColor: vars.color.gray[50],
  borderBottom: `1px solid ${vars.color.gray[100]}`,
  whiteSpace: 'nowrap',
})

export const td = style({
  padding: '12px 16px',
  fontWeight: 500,
  color: vars.color.gray[700],
  borderBottom: `1px solid ${vars.color.gray[100]}`,
  verticalAlign: 'middle',
  selectors: {
    'tr:hover &': {
      backgroundColor: 'rgba(241, 244, 253, 0.4)',
    },
  },
})

export const tdRight = style([td, { textAlign: 'right' }])

export const nameLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontWeight: 500,
  color: vars.color.gray[900],
  selectors: {
    '&:hover': { color: vars.color.primary[500] },
  },
})

export const muted = style({
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  color: vars.color.gray[500],
})

export const mutedInline = style({
  fontSize: '12px',
  fontWeight: 500,
  color: vars.color.gray[500],
})

export const badge = styleVariants({
  green: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: tracking,
    backgroundColor: vars.color.semantic.success[50],
    color: vars.color.semantic.success[500],
  },
  yellow: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: tracking,
    backgroundColor: vars.color.semantic.warning[50],
    color: vars.color.semantic.warning[500],
  },
  red: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: tracking,
    backgroundColor: vars.color.semantic.error[50],
    color: vars.color.semantic.error[600],
  },
  slate: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: tracking,
    backgroundColor: vars.color.gray[50],
    color: vars.color.gray[700],
  },
  indigo: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: tracking,
    backgroundColor: vars.color.primary[100],
    color: vars.color.primary[700],
  },
})

export const ghostBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '8px',
  border: `1px solid ${vars.color.gray[75]}`,
  backgroundColor: vars.color.gray[50],
  padding: '6px 10px',
  fontSize: '12px',
  fontWeight: 600,
  color: vars.color.gray[700],
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: vars.color.gray[100] },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  },
})

export const dangerBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  borderRadius: '8px',
  border: `1px solid ${vars.color.semantic.error[200]}`,
  backgroundColor: vars.color.semantic.error[50],
  padding: '6px 10px',
  fontSize: '12px',
  fontWeight: 600,
  color: vars.color.semantic.error[600],
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: vars.color.semantic.error[200] },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  },
})

export const filterChip = styleVariants({
  idle: {
    borderRadius: '12px',
    border: `1px solid ${vars.color.gray[75]}`,
    backgroundColor: colors.white,
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
    color: vars.color.gray[700],
    cursor: 'pointer',
    selectors: {
      '&:hover': { backgroundColor: vars.color.gray[50] },
    },
  },
  active: {
    borderRadius: '12px',
    border: 'none',
    backgroundColor: vars.color.primary[500],
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
    color: colors.white,
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(54, 55, 68, 0.05)',
  },
})

export const filterRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
})

export const pager = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '12px',
  padding: '12px 24px',
})

export const loading = style({
  ...fontStyles.bodyLg,
  color: vars.color.gray[500],
  padding: '80px 0',
  textAlign: 'center',
})

export const empty = style({
  fontSize: '14px',
  fontWeight: 500,
  color: vars.color.gray[500],
  padding: '48px 0',
  textAlign: 'center',
})

export const backLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '16px',
  fontSize: '14px',
  color: vars.color.gray[500],
  selectors: {
    '&:hover': { color: vars.color.gray[900] },
  },
})

export const metaRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '12px',
  marginTop: '6px',
  fontSize: '14px',
  color: vars.color.gray[500],
})

export const headerRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '16px',
})

export const funnelHead = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '20px',
})

export const funnelStepHead = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '6px',
})

export const funnelLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const funnelNum = style({
  width: '20px',
  height: '20px',
  borderRadius: '999px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.white,
  fontSize: '12px',
  fontWeight: 700,
  flexShrink: 0,
  backgroundColor: 'var(--step, #3B51CC)',
})

export const dropText = style({
  fontSize: '12px',
  color: vars.color.semantic.error[500],
})

export const track = style({
  width: '100%',
  backgroundColor: vars.color.gray[50],
  borderRadius: '999px',
  height: '10px',
  overflow: 'hidden',
})

export const trackFill = style({
  height: '10px',
  borderRadius: '999px',
  width: 'calc(var(--pct, 0) * 1%)',
  backgroundColor: 'var(--bar, #3B51CC)',
})

export const trackFillSm = style({
  height: '8px',
  borderRadius: '999px',
  width: 'calc(var(--pct, 0) * 1%)',
  backgroundColor: vars.color.primary[500],
})

export const trackSm = style({
  flex: 1,
  backgroundColor: vars.color.gray[50],
  borderRadius: '999px',
  height: '8px',
  overflow: 'hidden',
})

export const rankRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

export const rankBadge = styleVariants({
  gold: {
    width: '24px',
    height: '24px',
    borderRadius: '999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    flexShrink: 0,
    backgroundColor: vars.color.semantic.warning[50],
    color: vars.color.semantic.warning[500],
  },
  silver: {
    width: '24px',
    height: '24px',
    borderRadius: '999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    flexShrink: 0,
    backgroundColor: vars.color.gray[100],
    color: vars.color.gray[600],
  },
  bronze: {
    width: '24px',
    height: '24px',
    borderRadius: '999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    flexShrink: 0,
    backgroundColor: vars.color.primary[100],
    color: vars.color.primary[700],
  },
  rest: {
    width: '24px',
    height: '24px',
    borderRadius: '999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    flexShrink: 0,
    backgroundColor: vars.color.gray[50],
    color: vars.color.gray[500],
  },
})

export const feedDot = style({
  width: '6px',
  height: '6px',
  borderRadius: '999px',
  backgroundColor: vars.color.semantic.success[500],
  flexShrink: 0,
  marginTop: '8px',
})

export const feedRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
})

export const usageGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '16px',
  '@media': {
    '(min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
  },
})

export const usageCell = style({
  textAlign: 'center',
})

export const ringWrap = style({
  position: 'relative',
  width: '80px',
  height: '80px',
  margin: '0 auto 8px',
})

export const ringSvg = style({
  width: '80px',
  height: '80px',
})

export const ringCenter = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  fontWeight: 700,
  color: vars.color.gray[900],
})

export const formToggle = style({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 24px',
  textAlign: 'left',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: vars.color.gray[50] },
  },
})

export const formToggleLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

export const formGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '16px',
  '@media': {
    '(min-width: 1024px)': {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  },
})

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
})

export const fieldLabel = style({
  fontSize: '14px',
  fontWeight: 600,
  color: vars.color.gray[700],
})

export const formBody = style({
  borderTop: `1px solid ${vars.color.gray[75]}`,
  padding: '20px 24px 24px',
})

export const formActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '12px',
  marginTop: '16px',
})

export const warnBox = style({
  borderRadius: '16px',
  border: `1px solid ${vars.color.semantic.warning[200]}`,
  backgroundColor: vars.color.semantic.warning[50],
  padding: '20px',
})

export const errorBox = style({
  borderRadius: '16px',
  border: `1px solid ${vars.color.semantic.error[200]}`,
  backgroundColor: vars.color.semantic.error[50],
  padding: '20px',
})

export const dangerZone = style({
  borderRadius: '16px',
  border: `1px solid ${vars.color.semantic.error[200]}`,
  backgroundColor: 'rgba(255, 241, 241, 0.9)',
  padding: '24px',
})

export const chipWrap = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
})

export const healthCard = styleVariants({
  ok: {
    borderRadius: '12px',
    border: `1px solid ${vars.color.semantic.success[200]}`,
    backgroundColor: vars.color.semantic.success[50],
    padding: '20px',
  },
  warn: {
    borderRadius: '12px',
    border: `1px solid ${vars.color.semantic.warning[200]}`,
    backgroundColor: vars.color.semantic.warning[50],
    padding: '20px',
  },
  error: {
    borderRadius: '12px',
    border: `1px solid ${vars.color.semantic.error[200]}`,
    backgroundColor: vars.color.semantic.error[50],
    padding: '20px',
  },
  info: {
    borderRadius: '12px',
    border: `1px solid ${vars.color.primary[200]}`,
    backgroundColor: vars.color.primary[50],
    padding: '20px',
  },
})

export const healthTitle = styleVariants({
  ok: { fontWeight: 600, color: vars.color.semantic.success[500] },
  warn: { fontWeight: 600, color: vars.color.semantic.warning[500] },
  error: { fontWeight: 600, color: vars.color.semantic.error[600] },
  info: { fontWeight: 600, color: vars.color.primary[600] },
})

export const healthCount = styleVariants({
  ok: { fontSize: '24px', fontWeight: 700, color: vars.color.semantic.success[500] },
  warn: { fontSize: '24px', fontWeight: 700, color: vars.color.semantic.warning[500] },
  error: { fontSize: '24px', fontWeight: 700, color: vars.color.semantic.error[600] },
  info: { fontSize: '24px', fontWeight: 700, color: vars.color.primary[600] },
})

export const preview = style({
  fontSize: '12px',
  fontWeight: 500,
  color: vars.color.gray[500],
  maxWidth: '240px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
})

export const mono = style({
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '12px',
  color: vars.color.gray[600],
})

export const strike = style({
  color: vars.color.gray[500],
  textDecoration: 'line-through',
})

export const divideList = style({})

globalStyle(`${divideList} > *:not(:first-child)`, {
  borderTop: `1px solid ${vars.color.gray[75]}`,
})

export const padRow = style({
  padding: '16px 24px',
})

export const confirmList = style({
  margin: '12px 0 16px 18px',
  listStyle: 'disc',
})

export const confirmItem = style({
  fontSize: '14px',
  fontWeight: 500,
  color: vars.color.gray[600],
  marginBottom: '6px',
})

export const dangerNote = style({
  fontSize: '14px',
  fontWeight: 500,
  color: vars.color.gray[700],
  lineHeight: 1.6,
  margin: '12px 0',
})

export const modalActions = style({
  display: 'flex',
  gap: '12px',
  marginTop: '16px',
})

export const flex1 = style({ flex: 1 })

export const rateOk = style({ fontWeight: 600, color: vars.color.semantic.success[500] })
export const rateWarn = style({ fontWeight: 600, color: vars.color.semantic.warning[500] })
export const rateBad = style({ fontWeight: 600, color: vars.color.semantic.error[500] })

export const chartNote = style({
  fontSize: '12px',
  color: vars.color.gray[500],
  marginTop: '-12px',
  marginBottom: '16px',
})

export const okBanner = style({
  borderRadius: '16px',
  border: `1px solid ${vars.color.semantic.success[200]}`,
  backgroundColor: vars.color.semantic.success[50],
  padding: '32px',
  textAlign: 'center',
})
