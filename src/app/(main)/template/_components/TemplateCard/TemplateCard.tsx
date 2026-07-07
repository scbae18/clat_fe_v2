'use client'

import { useRouter } from 'next/navigation'
import Text from '@/components/common/Text'
import Chip from '@/components/common/Chip'

import TrashIcon from '@/assets/icons/icon-trash.svg'
import {
  cardStyle,
  cardHeaderStyle,
  cardTitleStyle,
  iconButtonStyle,
  classCountStyle,
  countHighlightStyle,
  chipGroupStyle,
} from './TemplateCard.css'

interface TemplateCardProps {
  id: number
  title: string
  classCount: number
  classList: string[]
  onDelete: (id: number) => void
}

export default function TemplateCard({
  id,
  title,
  classCount,
  classList,
  onDelete,
}: TemplateCardProps) {
  const router = useRouter()

  return (
    <div className={cardStyle} onClick={() => router.push(`/template/${id}/edit`)}>
      <div className={cardHeaderStyle}>
        <div className={cardTitleStyle} title={title}>
          {title}
        </div>
        <button
          className={iconButtonStyle}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(id)
          }}
        >
          <TrashIcon width={24} height={24} />
        </button>
      </div>
      <p className={classCountStyle}>
        사용 중인 반 <span className={countHighlightStyle}>{classCount}</span>
      </p>
      <div className={chipGroupStyle}>
        {classList.map((name) => (
          <Chip key={name} variant="default" label={name} />
        ))}
      </div>
    </div>
  )
}
