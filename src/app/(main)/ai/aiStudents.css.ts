import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const layout = style({
  display: 'grid',
  gridTemplateColumns: '320px 1fr',
  gap: '20px',
  alignItems: 'start',
  '@media': {
    'screen and (max-width: 1023px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const listColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '16px',
  borderRadius: '20px',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray75}`,
  position: 'sticky',
  top: '24px',
  maxHeight: 'calc(100vh - 200px)',
  overflowY: 'auto',
  '@media': {
    'screen and (max-width: 1023px)': {
      position: 'static',
      maxHeight: 'none',
    },
  },
})

export const searchInput = style({
  width: '100%',
  height: '40px',
  borderRadius: '10px',
  border: `1px solid ${colors.gray75}`,
  padding: '0 12px',
  fontSize: '13px',
  fontWeight: 500,
  color: colors.gray900,
  outline: 'none',
  boxSizing: 'border-box',
  selectors: {
    '&:focus': { borderColor: colors.primary300 },
    '&::placeholder': { color: colors.gray500 },
  },
})

export const filterChips = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flexWrap: 'wrap',
})

export const filterChip = style({
  border: 'none',
  borderRadius: '999px',
  padding: '6px 10px',
  fontSize: '12px',
  fontWeight: 600,
  color: colors.gray500,
  backgroundColor: colors.gray50,
  cursor: 'pointer',
  letterSpacing: '-0.02em',
})

export const filterChipActive = style({
  backgroundColor: colors.primary100,
  color: colors.primary500,
})

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  padding: '10px 12px',
  borderRadius: '10px',
  cursor: 'pointer',
  border: `1px solid transparent`,
  transition: 'background-color 0.15s, border-color 0.15s',
  selectors: {
    '&:hover': { backgroundColor: colors.gray50 },
  },
})

export const listItemActive = style({
  backgroundColor: colors.primary50,
  borderColor: colors.primary100,
  selectors: {
    '&:hover': { backgroundColor: colors.primary50 },
  },
})

export const listLeft = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
})

export const listName = style({
  fontSize: '14px',
  fontWeight: 600,
  color: colors.gray900,
  letterSpacing: '-0.02em',
})

export const listMeta = style({
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray500,
})

export const listRight = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '2px',
})

export const listScore = style({
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '-0.02em',
})

export const detailColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

export const detailCard = style({
  padding: '24px',
  borderRadius: '20px',
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray75}`,
})

export const detailHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '16px',
  flexWrap: 'wrap',
})

export const studentIdentity = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

export const studentNameLg = style({
  fontSize: '24px',
  fontWeight: 700,
  color: colors.gray900,
  letterSpacing: '-0.03em',
})

export const studentMetaLg = style({
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray500,
  letterSpacing: '-0.02em',
})

export const scoreBlockLg = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '8px',
})

export const scoreNumberLg = style({
  fontSize: '36px',
  fontWeight: 700,
  color: colors.gray900,
  letterSpacing: '-0.03em',
  lineHeight: 1,
})

export const scoreUnitLg = style({
  fontSize: '14px',
  fontWeight: 600,
  color: colors.gray500,
})

export const oneLinerBox = style({
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: colors.primary50,
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray900,
  lineHeight: '160%',
  letterSpacing: '-0.02em',
})

export const sectionTitle = style({
  margin: '0 0 12px',
  fontSize: '16px',
  fontWeight: 600,
  color: colors.gray700,
  letterSpacing: '-0.02em',
})

export const sectionTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  marginBottom: '12px',
})

export const signalsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '8px',
})

export const causesList = style({
  margin: 0,
  padding: '0 0 0 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
})

export const causeItem = style({
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray700,
  lineHeight: '160%',
  letterSpacing: '-0.02em',
})

export const actionButtonsRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
})

export const timeline = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const timelineItem = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '12px',
  borderRadius: '10px',
  backgroundColor: colors.gray50,
})

export const timelineDate = style({
  fontSize: '12px',
  fontWeight: 600,
  color: colors.gray500,
  letterSpacing: '-0.02em',
  whiteSpace: 'nowrap',
  paddingTop: '2px',
})

export const timelineBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  minWidth: 0,
})

export const timelineHeadRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

export const timelineText = style({
  fontSize: '13px',
  fontWeight: 500,
  color: colors.gray700,
  lineHeight: '150%',
  letterSpacing: '-0.02em',
})

export const decisionChip = style({
  padding: '2px 8px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '-0.02em',
})

export const decisionActed = style({
  backgroundColor: colors.success50,
  color: '#0E7553',
})

export const decisionSnoozed = style({
  backgroundColor: colors.gray75,
  color: colors.gray700,
})

export const decisionDismissed = style({
  backgroundColor: colors.gray50,
  color: colors.gray500,
})

export const lessonTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '13px',
})

export const lessonTh = style({
  padding: '10px 12px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: 600,
  color: colors.gray500,
  borderBottom: `1px solid ${colors.gray75}`,
  letterSpacing: '-0.02em',
})

export const lessonTd = style({
  padding: '12px',
  fontSize: '13px',
  fontWeight: 500,
  color: colors.gray700,
  borderBottom: `1px solid ${colors.gray50}`,
  letterSpacing: '-0.02em',
})

export const tagAttendance = style({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: '999px',
  fontSize: '11px',
  fontWeight: 600,
})

export const tagPresent = style({
  backgroundColor: colors.success50,
  color: '#0E7553',
})

export const tagLate = style({
  backgroundColor: colors.warning50,
  color: '#A35908',
})

export const tagAbsent = style({
  backgroundColor: colors.error50,
  color: colors.error600,
})

export const noteEditor = style({
  width: '100%',
  minHeight: '72px',
  borderRadius: '12px',
  border: `1px solid ${colors.gray100}`,
  padding: '12px',
  fontSize: '13px',
  fontWeight: 500,
  fontFamily: 'inherit',
  color: colors.gray900,
  outline: 'none',
  boxSizing: 'border-box',
  resize: 'vertical',
  selectors: {
    '&:focus': { borderColor: colors.primary300 },
  },
})

export const noteRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '8px',
  marginTop: '8px',
})

export const emptyDetail = style({
  padding: '64px 24px',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray500,
})
