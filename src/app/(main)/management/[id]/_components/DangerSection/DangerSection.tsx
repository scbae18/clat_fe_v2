import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import { sectionRecipe, contentStyle } from './DangerSection.css'
import TrashIcon from '@/assets/icons/icon-trash.svg'
import FlagIcon from '@/assets/icons/icon-flag.svg'

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
        <Text variant="headingMd" color="gray900">
          {title}
        </Text>
        <Text variant="bodyLg" color="gray500">
          {description}
        </Text>
      </div>
      <Button
        variant={variant === 'delete' ? 'deleteClass' : 'endClass'}
        size="sm"
        leftIcon={variant === 'delete' ? <TrashIcon width={20} height={20} /> : <FlagIcon width={20} height={20} />}
        onClick={onConfirm}
      >
        {buttonLabel}
      </Button>
    </div>
  )
}
