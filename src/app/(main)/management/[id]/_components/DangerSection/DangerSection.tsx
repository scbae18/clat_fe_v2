import Text from '@/components/common/Text'
import { textColors } from '@/components/common/Text/Text.css'
import {
  sectionRecipe,
  contentStyle,
  titleStyle,
  descriptionStyle,
  endButtonStyle,
  deleteButtonStyle,
} from './DangerSection.css'
import TrashIcon from '@/assets/icons/icon-trash-01.svg'
import FlagIcon from '@/assets/icons/icon-flag-01.svg'

interface DangerSectionProps {
  variant: 'end' | 'delete'
  title: string
  description: string
  buttonLabel: string
  onConfirm: () => void
}

export default function DangerSection({
  variant,
  title,
  description,
  buttonLabel,
  onConfirm,
}: DangerSectionProps) {
  return (
    <div className={sectionRecipe({ variant })}>
      <div className={contentStyle}>
        <p className={`${titleStyle} ${variant === 'delete' ? textColors.error500 : textColors.primary500}`}>
          {title}
        </p>
        <Text variant="bodyLg" color="gray500" as="p" className={descriptionStyle}>
          {description}
        </Text>
      </div>
      <button
        type="button"
        className={variant === 'delete' ? deleteButtonStyle : endButtonStyle}
        onClick={onConfirm}
      >
        {variant === 'delete' ? <TrashIcon width={20} height={20} /> : <FlagIcon width={20} height={20} />}
        {buttonLabel}
      </button>
    </div>
  )
}
