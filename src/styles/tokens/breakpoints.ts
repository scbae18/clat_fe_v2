export const breakpoint = {
  phoneMax: 767,
  tabletMax: 1279,
} as const

export const media = {
  phone: `screen and (max-width: ${breakpoint.phoneMax}px)`,
  tablet: `screen and (max-width: ${breakpoint.tabletMax}px)`,
  desktop: `screen and (min-width: ${breakpoint.phoneMax + 1}px)`,
} as const
