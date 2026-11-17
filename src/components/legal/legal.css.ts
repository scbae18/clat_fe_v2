import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { media } from '@/styles/tokens/breakpoints'

export const pageStyle = style({
  minHeight: '100dvh',
  backgroundColor: colors.background,
  color: colors.gray900,
})

export const topbarStyle = style({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px 16px',
  padding: '14px 20px',
  backgroundColor: colors.white,
  borderBottom: `1px solid ${colors.gray75}`,
})

export const logoLinkStyle = style({
  display: 'flex',
  flexShrink: 0,
})

export const logoStyle = style({
  display: 'block',
  height: '28px',
  width: 'auto',
  objectFit: 'contain',
})

export const navStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: '8px 14px',
  '@media': {
    [media.phone]: {
      justifyContent: 'flex-start',
      width: '100%',
    },
  },
})

export const navLinkStyle = style({
  color: colors.gray600,
  fontSize: '13px',
  fontWeight: 500,
  textDecoration: 'none',
  selectors: {
    '&[aria-current="page"]': {
      color: colors.primary500,
      fontWeight: 600,
    },
  },
})

export const innerStyle = style({
  maxWidth: '840px',
  margin: '0 auto',
  padding: '28px 20px 72px',
})

export const sheetStyle = style({
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray75}`,
  borderRadius: '16px',
  padding: '28px 22px 36px',
  '@media': {
    [media.desktop]: { padding: '40px 40px 48px' },
  },
})

export const dateStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  marginBottom: '12px',
  padding: '4px 10px',
  borderRadius: '999px',
  backgroundColor: colors.primary50,
  color: colors.primary700,
  fontSize: '12px',
  fontWeight: 600,
})

export const titleStyle = style({
  margin: '0 0 20px',
  fontSize: '28px',
  fontWeight: 700,
  letterSpacing: '-0.03em',
  lineHeight: 1.3,
  wordBreak: 'keep-all',
})

export const tocStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  margin: '0 0 8px',
  padding: '16px',
  borderRadius: '12px',
  backgroundColor: colors.gray50,
})

export const tocLabelStyle = style({
  fontSize: '12px',
  fontWeight: 600,
  color: colors.gray500,
})

export const tocListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
})

export const tocLinkStyle = style({
  color: colors.gray700,
  fontSize: '14px',
  lineHeight: 1.45,
  textDecoration: 'none',
  wordBreak: 'keep-all',
  selectors: {
    '&:hover': { color: colors.primary500 },
  },
})

export const h2Style = style({
  margin: '36px 0 12px',
  paddingTop: '28px',
  borderTop: `1px solid ${colors.gray75}`,
  fontSize: '20px',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1.4,
  scrollMarginTop: '120px',
  wordBreak: 'keep-all',
})

export const h3Style = style({
  margin: '22px 0 8px',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: 1.45,
  scrollMarginTop: '120px',
  wordBreak: 'keep-all',
})

export const paragraphStyle = style({
  margin: '0 0 12px',
  color: colors.gray700,
  fontSize: '15px',
  fontWeight: 450,
  lineHeight: 1.75,
  wordBreak: 'keep-all',
})

export const listStyle = style({
  margin: '0 0 14px',
  paddingLeft: '1.25rem',
  color: colors.gray700,
  fontSize: '15px',
  lineHeight: 1.75,
  wordBreak: 'keep-all',
})

export const nestedListStyle = style({
  margin: '4px 0 6px',
  paddingLeft: '1.1rem',
})

export const linkStyle = style({
  color: colors.primary500,
  textUnderlineOffset: '2px',
})

export const tableWrapStyle = style({
  margin: '8px 0 16px',
  overflowX: 'auto',
  border: `1px solid ${colors.gray75}`,
  borderRadius: '12px',
})

export const tableStyle = style({
  width: '100%',
  minWidth: '560px',
  borderCollapse: 'collapse',
  fontSize: '13px',
  lineHeight: 1.5,
})

export const thStyle = style({
  padding: '10px 12px',
  backgroundColor: colors.gray50,
  color: colors.gray900,
  fontWeight: 600,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  borderBottom: `1px solid ${colors.gray75}`,
})

export const tdStyle = style({
  padding: '10px 12px',
  color: colors.gray700,
  verticalAlign: 'top',
  wordBreak: 'keep-all',
  borderBottom: `1px solid ${colors.gray75}`,
  selectors: {
    'tr:last-child &': { borderBottom: 'none' },
  },
})

export const footerBlockStyle = style({
  marginTop: '36px',
  paddingTop: '24px',
  borderTop: `1px solid ${colors.gray75}`,
})
