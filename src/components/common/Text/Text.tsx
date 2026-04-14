import { textVariants, textColors } from './Text.css'

type TextVariant = keyof typeof textVariants
type TextColor = keyof typeof textColors
type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'div'

interface TextProps {
  variant?: TextVariant
  color?: TextColor
  as?: TextTag
  children: React.ReactNode
  className?: string
}

export default function Text({
  variant = 'bodyMd',
  color = 'gray900',
  as: Tag = 'span',
  children,
  className,
}: TextProps) {
  return (
    <Tag
      className={[textVariants[variant], textColors[color], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  )
}
