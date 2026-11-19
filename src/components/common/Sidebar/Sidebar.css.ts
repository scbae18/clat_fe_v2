import { style, styleVariants } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import { media } from '@/styles/tokens/breakpoints'
import { zIndex } from '@/styles/tokens/zIndex'

const sidebarBase = style({
  height: '100vh',
  backgroundColor: colors.gray900,
  display: 'flex',
  flexDirection: 'column',
  padding: '2px 0',
  position: 'fixed',
  top: 0,
  left: 0,
  overflow: 'hidden',
  transition: 'width 0.2s ease',
  zIndex: 100,
  '@media': {
    [media.phone]: {
      display: 'none',
    },
  },
})

export const sidebarStyle = styleVariants({
  expanded: [sidebarBase, { width: '240px' }],
  collapsed: [sidebarBase, { width: '64px' }],
})

export const sidebarTopStyle = styleVariants({
  expanded: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '56px 24px 56px 36px',
    gap: '8px',
  },
  collapsed: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 8px 24px',
    gap: '12px',
  },
})

export const toggleButtonStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: 'none',
  background: 'rgba(255,255,255,0.06)',
  color: colors.gray500,
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background 0.2s, color 0.2s',
  selectors: {
    '&:hover': {
      background: 'rgba(255,255,255,0.1)',
      color: colors.white,
    },
  },
})

export const navStyle = styleVariants({
  expanded: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '8px',
    padding: '0 24px',
  },
  collapsed: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '8px',
    padding: '0 8px',
  },
})

export const navFixedStyle = style({
  flexGrow: 0,
  flexShrink: 0,
  flexBasis: 'auto',
})

const navItemBase = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  height: '48px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: fontStyles.titleMd.fontSize,
  fontWeight: fontStyles.titleMd.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  color: colors.gray600,
  textDecoration: 'none',
  transition: 'color 0.2s, background 0.2s',
  flexShrink: 0,
  selectors: {
    '&:hover': {
      color: colors.gray300,
    },
  },
} as const

export const navItemStyle = styleVariants({
  expanded: [
    navItemBase,
    {
      gap: '16px',
      padding: '0 16px',
    },
  ],
  collapsed: [
    navItemBase,
    {
      justifyContent: 'center',
      padding: 0,
      width: '100%',
    },
  ],
})

export const navItemActiveStyle = style({
  color: colors.white,
  fontWeight: fontStyles.titleMd.fontWeight,
  background: 'rgba(255,255,255,0.08)',
})

export const navLabelStyle = styleVariants({
  expanded: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: 1,
    transition: 'opacity 0.15s ease',
  },
  collapsed: {
    position: 'absolute',
    width: 0,
    height: 0,
    overflow: 'hidden',
    opacity: 0,
    pointerEvents: 'none',
  },
})

export const logoutButtonStyle = styleVariants({
  expanded: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    gap: '16px',
    padding: '0 16px',
    height: '48px',
    color: colors.gray600,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    fontSize: fontStyles.titleMd.fontSize,
    fontWeight: fontStyles.titleMd.fontWeight,
    letterSpacing: '-0.03em',
    lineHeight: '140%',
    transition: 'all 0.2s',
    selectors: {
      '&:hover': {
        color: colors.gray300,
      },
    },
  },
  collapsed: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '100%',
    height: '48px',
    padding: 0,
    color: colors.gray600,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    transition: 'all 0.2s',
    selectors: {
      '&:hover': {
        color: colors.gray300,
      },
    },
  },
})

export const sidebarBottomStyle = styleVariants({
  expanded: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 24px',
    minHeight: 0,
  },
  collapsed: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '0 8px',
    minHeight: 0,
  },
})

export const sidebarBottomScrollStyle = style({
  flex: '1 1 auto',
  minHeight: 0,
  marginTop: 0,
  overflowY: 'auto',
})

export const scheduleStackStyle = styleVariants({
  expanded: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    gap: '8px',
    marginBottom: '8px',
  },
  collapsed: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    gap: '6px',
    marginBottom: '8px',
  },
})

export const scheduleCardStyle = styleVariants({
  expanded: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    width: '100%',
    padding: '10px 12px',
    border: 'none',
    borderRadius: '12px',
    textAlign: 'left',
    font: 'inherit',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.08)',
    color: colors.white,
    flexShrink: 0,
    selectors: {
      '&:hover': {
        background: 'rgba(255,255,255,0.14)',
      },
      '&[data-open="true"]': {
        background: 'rgba(255,255,255,0.18)',
      },
    },
  },
  collapsed: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: '36px',
    padding: '6px 2px',
    border: 'none',
    borderRadius: '10px',
    font: 'inherit',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.08)',
    color: colors.white,
    flexShrink: 0,
    selectors: {
      '&:hover': {
        background: 'rgba(255,255,255,0.14)',
      },
      '&[data-open="true"]': {
        background: 'rgba(255,255,255,0.18)',
      },
    },
  },
})

export const scheduleBadgeStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  lineHeight: 1.3,
  color: colors.primary300,
})

export const scheduleTimeStyle = style({
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '-0.03em',
  lineHeight: 1.3,
  color: colors.primary300,
})

export const scheduleClassStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 600,
  lineHeight: 1.3,
  letterSpacing: '-0.03em',
  color: colors.white,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const scheduleDateStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '-0.03em',
  color: colors.gray500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const scheduleMoreStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 700,
  lineHeight: 1.3,
  letterSpacing: '-0.03em',
  color: colors.primary300,
})

export const scheduleLineButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  height: '40px',
  padding: '0 12px',
  border: 'none',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.08)',
  color: colors.white,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  flexShrink: 0,
  selectors: {
    '&:hover': {
      background: 'rgba(255,255,255,0.14)',
    },
    '&[data-open="true"]': {
      background: 'rgba(255,255,255,0.18)',
    },
  },
})

export const scheduleListHeading = style({
  margin: 0,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  color: colors.gray500,
})

export const scheduleListStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  maxHeight: '280px',
  overflowY: 'auto',
})

export const scheduleListItem = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  width: '100%',
  padding: '10px 12px',
  border: 'none',
  borderRadius: '10px',
  backgroundColor: colors.gray50,
  textAlign: 'left',
  font: 'inherit',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: colors.gray100,
    },
    '&[data-open="true"]': {
      backgroundColor: colors.primary50,
    },
  },
})

export const scheduleListTime = style({
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '-0.03em',
  lineHeight: 1.3,
  color: colors.primary500,
})

export const scheduleListBadge = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  lineHeight: 1.3,
  color: colors.primary500,
})

export const scheduleListName = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 600,
  lineHeight: 1.3,
  letterSpacing: '-0.03em',
  color: colors.gray900,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const scheduleListMeta = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '-0.03em',
  color: colors.gray500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const scheduleDetailStyle = styleVariants({
  expanded: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  collapsed: {
    display: 'none',
  },
})

export const usageCardStyle = styleVariants({
  expanded: {
    marginBottom: '8px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    gap: '2px',
    padding: '10px 12px',
    borderRadius: '12px',
    textDecoration: 'none',
    background: 'rgba(255,255,255,0.08)',
    color: colors.white,
    selectors: {
      '&:hover': {
        background: 'rgba(255,255,255,0.14)',
      },
    },
  },
  collapsed: {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    minHeight: '36px',
    padding: '6px 2px',
    borderRadius: '10px',
    textDecoration: 'none',
    background: 'rgba(255,255,255,0.08)',
    color: colors.primary300,
    selectors: {
      '&:hover': {
        background: 'rgba(255,255,255,0.14)',
      },
    },
  },
})

export const usagePlanStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  lineHeight: 1.3,
  color: colors.primary300,
})

export const usageLineStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  letterSpacing: '-0.03em',
  lineHeight: 1.3,
  color: colors.gray300,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const usageAlertStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 600,
  letterSpacing: '-0.03em',
  lineHeight: 1.3,
  color: colors.warning500,
})

export const usageRemainStyle = style({
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '-0.03em',
  lineHeight: 1.2,
  color: colors.primary300,
})

export const userCardStyle = styleVariants({
  expanded: {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: colors.gray300,
    transition: 'background 0.2s, color 0.2s',
    selectors: {
      '&:hover': {
        background: 'rgba(255,255,255,0.06)',
        color: colors.white,
      },
    },
  },
  collapsed: {
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: '10px 0',
    borderRadius: '12px',
    textDecoration: 'none',
    color: colors.gray300,
    transition: 'background 0.2s, color 0.2s',
    selectors: {
      '&:hover': {
        background: 'rgba(255,255,255,0.06)',
        color: colors.white,
      },
    },
  },
})

export const userCardActiveStyle = style({
  background: 'rgba(255,255,255,0.08)',
  color: colors.white,
})

export const userAvatarStyle = style({
  flexShrink: 0,
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${colors.primary300} 0%, ${colors.primary500} 100%)`,
  color: colors.white,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '-0.03em',
})

export const userTextWrapStyle = styleVariants({
  expanded: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  collapsed: {
    display: 'none',
  },
})

export const userNameStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  lineHeight: 1.3,
  letterSpacing: '-0.03em',
  color: 'inherit',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const userEmailStyle = style({
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '-0.03em',
  color: colors.gray500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const scheduleActionPopover = style({
  position: 'fixed',
  left: 'var(--schedule-popover-x, -9999px)',
  top: 'var(--schedule-popover-y, 0px)',
  zIndex: zIndex.tooltip,
  width: '280px',
  padding: '14px',
  borderRadius: '14px',
  border: `1px solid ${colors.gray100}`,
  backgroundColor: colors.white,
  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.14)',
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '-6px',
      top: 'var(--schedule-popover-arrow, 24px)',
      width: '12px',
      height: '12px',
      backgroundColor: colors.white,
      borderLeft: `1px solid ${colors.gray100}`,
      borderBottom: `1px solid ${colors.gray100}`,
      transform: 'translateY(-50%) rotate(45deg)',
    },
  },
})

export const scheduleActionStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export const scheduleActionField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
})

export const scheduleActionInput = style({
  height: '40px',
  padding: '0 12px',
  borderRadius: '8px',
  border: `1px solid ${colors.gray200}`,
  backgroundColor: colors.white,
  color: colors.gray900,
  fontSize: fontStyles.bodyMd.fontSize,
})

export const scheduleActionButtons = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const schedulePreview = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '10px 12px',
  borderRadius: '10px',
  backgroundColor: colors.gray50,
  maxHeight: '180px',
  overflowY: 'auto',
})

export const schedulePreviewBody = style({
  margin: 0,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontSize: fontStyles.bodyMd.fontSize,
  lineHeight: 1.45,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const schedulePreviewPeople = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '10px 12px',
  borderRadius: '10px',
  backgroundColor: colors.gray50,
  maxHeight: '140px',
  overflowY: 'auto',
})

export const schedulePreviewNames = style({
  margin: 0,
  wordBreak: 'break-word',
  fontSize: fontStyles.bodyMd.fontSize,
  lineHeight: 1.45,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const schedulePreviewChannels = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
})

export const schedulePreviewChannel = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 10px',
  borderRadius: '8px',
  border: `1px solid ${colors.gray100}`,
  backgroundColor: colors.white,
  color: colors.gray500,
  fontSize: fontStyles.labelSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  lineHeight: '140%',
  letterSpacing: '-0.03em',
})

export const schedulePreviewChannelOn = style({
  borderColor: colors.primary200,
  backgroundColor: colors.primary50,
  color: colors.primary500,
})

export const schedulePreviewLine = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})
