import {
  dateCardRecipe,
  dayStyle,
  dateStyle,
  dateDefaultStyle,
  dateSelectedStyle,
  statusStyle,
} from './DateCard.css'
import Chip from '@/components/common/Chip'

type DateStatus = 'done' | 'inProgress' | 'none'

interface DateCardProps {
  day: string
  date: number
  status: DateStatus
  isSelected: boolean
  onClick: () => void
}

const STATUS_LABEL: Record<DateStatus, string> = {
  done: '입력 완료',
  inProgress: '입력 중',
  none: '입력 전',
}

const STATUS_VARIANT: Record<DateStatus, 'done' | 'inProgress' | 'default'> = {
  done: 'done',
  inProgress: 'inProgress',
  none: 'default',
}

export default function DateCard({ day, date, status, isSelected, onClick }: DateCardProps) {
  return (
    <div className={dateCardRecipe({ selected: isSelected })} onClick={onClick}>
      <span className={dayStyle}>{day}</span>
      <span className={`${dateStyle} ${isSelected ? dateSelectedStyle : dateDefaultStyle}`}>
        {date}
      </span>
      <Chip label={STATUS_LABEL[status]} variant={STATUS_VARIANT[status]} />
    </div>
  )
}
