import { ButtonHTMLAttributes, ReactNode } from 'react'
import { addCardStyle, descriptionStyle } from './AddCard.css'
import Text from '@/components/common/Text'

interface AddCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  label: string
  description?: string
}

export default function AddCard({ icon, label, description, ...props }: AddCardProps) {
  return (
    <button className={addCardStyle} {...props}>
      {icon}
      <Text variant="titleSm" color="gray300">{label}</Text>
      {description && <p className={descriptionStyle}>{description}</p>}
    </button>
  )
}