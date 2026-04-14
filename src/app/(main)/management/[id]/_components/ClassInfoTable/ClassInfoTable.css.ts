import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const tableStyle = style({
  width: '100%',
  borderCollapse: 'collapse',
  border: `1px solid ${colors.gray100}`,
  overflow: 'hidden',
})

export const thStyle = style({
  width: '116px',
  height: '40px',
  padding: '0 16px',
  backgroundColor: colors.gray50,
  color: colors.gray900,
  fontSize: fontStyles.titleSm.fontSize,
  fontWeight: fontStyles.titleSm.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  textAlign: 'left',
  borderRight: `1px solid ${colors.gray100}`,
  borderBottom: `1px solid ${colors.gray100}`,
})

export const tdStyle = style({
  height: '40px',
  padding: '0 16px',
  backgroundColor: colors.white,
  color: colors.gray700,
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: fontStyles.bodyMd.fontWeight,
  letterSpacing: '-0.03em',
  lineHeight: '140%',
  borderRight: `1px solid ${colors.gray100}`,
  borderBottom: `1px solid ${colors.gray100}`,
  selectors: {
    '&:last-child': {
      borderRight: 'none',
    },
  },
})