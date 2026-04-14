import { chipRecipe } from './Chip.css'

interface ChipProps {
  variant?: 'default' | 'active' | 'ended' | 'done' | 'inProgress'
  label: string
  className?: string
}

export default function Chip({ variant = 'default', label, className }: ChipProps) {
  return (
    <span className={`${chipRecipe({ variant })}${className ? ` ${className}` : ''}`}>
      {label}
    </span>
  )
}